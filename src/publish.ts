import Debug from 'debug'
import { readFile, stat } from 'fs-extra'
import { isPlainObject, template } from 'lodash'
import mime from 'mime'
import path from 'node:path'
import { RELEASE_NAME } from './definitions/constants'
import { GetClient } from './get-client'
import { GlobAssets } from './glob-assets'
import { IsPrerelease } from './is-prerelease'
import { ParseGitHubURL } from './parse-github-url'
import { ResolveConfig } from './resolve-config'

const debug = Debug('semantic-release:github')

export const PublishGitHub = async (pluginConfig: any, context: any) => {
  const {
    cwd,
    options,
    branch,
    nextRelease: { name, gitTag, notes },
    logger
  } = context

  debug('options: %O', options)

  const { githubToken, githubUrl, githubApiPathPrefix, proxy, assets, repositoryUrl } = ResolveConfig(
    pluginConfig,
    context
  )
  const { owner, repo } = ParseGitHubURL(repositoryUrl)
  const github = GetClient({ githubApiPathPrefix, githubToken, githubUrl, proxy })
  const release = {
    body: notes,
    name,
    owner,
    prerelease: IsPrerelease(branch.name),
    repo,
    tag_name: gitTag,
    target_commitish: branch.name
  }

  debug('release object: %O', release)

  // When there are no assets, we publish a release directly
  if (!assets || assets.length === 0) {
    const {
      data: { html_url: url, id: releaseId }
    } = await github.repos.createRelease(release)

    logger.log('Published GitHub release: %s', url)

    return { id: releaseId, name: RELEASE_NAME, url }
  }

  /*
   * We'll create a draft release, append the assets to it, and then publish it.
   * This is so that the assets are available when we get a Github release event.
   */
  const draftRelease = { ...release, draft: true }

  const {
    data: { upload_url: uploadUrl, id: releaseId }
  } = await github.repos.createRelease(draftRelease)

  // Append assets to the release
  const globbedAssets = await GlobAssets(context, assets)
  debug('globed assets: %o', globbedAssets)

  await Promise.all(
    globbedAssets.map(async (asset) => {
      const filePath = isPlainObject(asset) ? asset.path : asset
      let file: any = ''

      try {
        file = await stat(path.resolve(cwd, filePath))
      } catch {
        logger.error('The asset %s cannot be read, and will be ignored.', filePath)

        return
      }

      if (!file || !file.isFile()) {
        logger.error('The asset %s is not a file, and will be ignored.', filePath)

        return
      }

      const fileName = template(asset.name || path.basename(filePath))(context)
      const upload = {
        data: await readFile(path.resolve(cwd, filePath)),
        headers: {
          'content-length': file.size,
          'content-type': mime.getType(path.extname(fileName)) || 'text/plain'
        },
        name: fileName,
        url: uploadUrl
      }

      debug('file path: %o', filePath)
      debug('file name: %o', fileName)

      if (isPlainObject(asset) && asset.label) {
        ;(upload as any).label = template(asset.label)(context)
      }

      const {
        data: { browser_download_url: downloadUrl }
      } = await github.repos.uploadReleaseAsset(upload)
      logger.log('Published file %s', downloadUrl)
    })
  )

  const {
    data: { html_url: url }
  } = await github.repos.updateRelease({ draft: false, owner, release_id: releaseId, repo })

  logger.log('Published GitHub release: %s', url)

  return { id: releaseId, name: RELEASE_NAME, url }
}
