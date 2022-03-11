import Debug from 'debug'
import dirGlob from 'dir-glob'
import globby from 'globby'
import { castArray, isPlainObject, uniq, uniqWith } from 'lodash'
import path from 'node:path'

const debug = Debug('semantic-release:github')

export const GlobAssets = async ({ cwd }: any, assets: any) =>
  uniqWith(
    (
      await Promise.all(
        assets.map(async (asset: any) => {
          // Wrap single glob definition in Array
          let glob = castArray(isPlainObject(asset) ? asset.path : asset)
          glob = uniq([...(await dirGlob(glob, { cwd })), ...glob])

          // Skip solo negated pattern (avoid to include every non js file with `!**/*.js`)
          if (glob.length <= 1 && glob[0].startsWith('!')) {
            debug(
              'skipping the negated glob %o as its alone in its group and would retrieve a large amount of files',
              glob[0]
            )

            return []
          }

          const globbed = await globby(glob, {
            cwd,
            dot: true,
            expandDirectories: false,
            gitignore: false,
            onlyFiles: false
          })

          if (isPlainObject(asset)) {
            if (globbed.length > 1) {
              /*
               * If asset is an Object with a glob the `path` property that resolve to multiple files,
               * Output an Object definition for each file matched and set each one with:
               * - `path` of the matched file
               * - `name` based on the actual file name (to avoid assets with duplicate `name`)
               * - other properties of the original asset definition
               */
              return globbed.map((file) => ({ ...asset, name: path.basename(file), path: file }))
            }

            /*
             * If asset is an Object, output an Object definition with:
             * - `path` of the matched file if there is one, or the original `path` definition (will be considered as a missing file)
             * - other properties of the original asset definition
             */
            return { ...asset, path: globbed[0] || asset.path }
          }

          if (globbed.length > 0) {
            // If asset is a String definition, output each files matched
            return globbed
          }

          // If asset is a String definition but no match is found, output the elements of the original glob (each one will be considered as a missing file)
          return glob
        })
        // Sort with Object first, to prioritize Object definition over Strings in dedup
      )
    )
      .flat()
      // eslint-disable-next-line etc/no-assign-mutated-array
      .sort((asset) => (isPlainObject(asset) ? -1 : 1)),
    // Compare `path` property if Object definition, value itself if String
    (first, second) =>
      path.resolve(cwd, isPlainObject(first) ? first.path : first) ===
      path.resolve(cwd, isPlainObject(second) ? second.path : second)
  )
