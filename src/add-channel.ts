import Debug from 'debug'
import { RELEASE_NAME } from './definitions/constants'
import { GetClient } from './get-client'
import { IsPrerelease } from './is-prerelease'
import { ParseGitHubURL } from './parse-github-url'
import { ResolveConfig } from './resolve-config'

const debug = Debug('semantic-release:github')

export const AddChannelGitHub = async (pluginConfig: any, context: any) => {
  const {
    options,
    branch,
    nextRelease: { name, gitTag, notes },
    logger
  } = context
  debug('options: %O', options)
  const { githubToken, githubUrl, githubApiPathPrefix, proxy, repositoryUrl } = ResolveConfig(pluginConfig, context)
  const { owner, repo } = ParseGitHubURL(repositoryUrl)
  const github = GetClient({githubApiPathPrefix, githubToken, githubUrl, proxy})

  let releaseId = ''

  const release = { name, owner, prerelease: IsPrerelease(branch.name), repo, tag_name: gitTag }

  debug('release object: %O', release)

  try {
    ;({
      data: { id: releaseId }
    } = await github.repos.getReleaseByTag({ owner, repo, tag: gitTag }))
  } catch (error) {
    const HTTP_STATUS_404 = 404
    if (error.status === HTTP_STATUS_404) {
      logger.log('There is no release for tag %s, creating a new one', gitTag)

      const {
        data: { html_url: url }
      } = await github.repos.createRelease({ ...release, body: notes })

      logger.log('Published GitHub release: %s', url)

      return { name: RELEASE_NAME, url }
    }

    throw error
  }

  debug('release release_id: %o', releaseId)

  const {
    data: { html_url: url }
  } = await github.repos.updateRelease({ ...release, release_id: releaseId })

  logger.log('Updated GitHub release: %s', url)

  return { name: RELEASE_NAME, url }
}
