import AggregateError from 'aggregate-error'
import { isArray, isNil, isNumber, isPlainObject, isString } from 'lodash'
import { debug } from 'node:console'
import urlJoin from 'url-join'
import { GetClient } from './get-client'
import { GetError } from './get-error'
import { ParseGitHubURL } from './parse-github-url'
import { ResolveConfig } from './resolve-config'

const isNonEmptyString = (value: any) => isString(value) && value.trim()
const oneOf = (enumArray: any) => (value: any) => enumArray.includes(value)
const isStringOrStringArray = (value: any) =>
  isNonEmptyString(value) || (isArray(value) && value.every((string) => isNonEmptyString(string)))
const isArrayOf = (validator: any) => (array: any) => isArray(array) && array.every((value) => validator(value))
const canBeDisabled = (validator: any) => (value: any) => value === false || validator(value)

const VALIDATORS: any = {
  addReleases: canBeDisabled(oneOf(['bottom', 'top'])),
  assets: isArrayOf(
    (asset: any) => isStringOrStringArray(asset) || (isPlainObject(asset) && isStringOrStringArray(asset.path))
  ),
  assignees: isArrayOf(isNonEmptyString),
  failComment: canBeDisabled(isNonEmptyString),
  failTitle: canBeDisabled(isNonEmptyString),
  labels: canBeDisabled(isArrayOf(isNonEmptyString)),
  proxy: canBeDisabled(
    (proxy: any) =>
      isNonEmptyString(proxy) || (isPlainObject(proxy) && isNonEmptyString(proxy.host) && isNumber(proxy.port))
  ),
  releasedLabels: canBeDisabled(isArrayOf(isNonEmptyString)),
  repositoryUrl: canBeDisabled(isNonEmptyString),
  successComment: canBeDisabled(isNonEmptyString)
}

export const VerifyGitHub = async (pluginConfig: any, context: any) => {
  let {
    env,
    options: { repositoryUrl },
    logger
  } = context
  const { githubToken, githubUrl, githubApiPathPrefix, proxy, ...options } = ResolveConfig(pluginConfig, context)
  repositoryUrl = pluginConfig.repositoryUrl

  debug(`options repositoryUrl: ${repositoryUrl}`)

  const verifyErrors = Object.entries({ ...options, proxy }).reduce(
    (errors, [option, value]): any =>
      !isNil(value) && !VALIDATORS[option](value)
        ? [...errors, GetError(`EINVALID${option.toUpperCase()}`, { [option]: value })]
        : errors,
    []
  )

  if (githubUrl) {
    logger.log('Verify GitHub authentication (%s)', urlJoin(githubUrl, githubApiPathPrefix))
  } else {
    logger.log('Verify GitHub authentication')
  }

  const { repo, owner } = ParseGitHubURL(repositoryUrl)
  if (!owner || !repo) {
    ;(verifyErrors as any).push(GetError('EINVALIDGITHUBURL'))
  } else if (githubToken && !verifyErrors.some(({ code }) => code === 'EINVALIDPROXY')) {
    const github = GetClient({ githubApiPathPrefix, githubToken, githubUrl, proxy })

    /*
     * https://github.com/semantic-release/github/issues/182
     * Do not check for permissions in GitHub actions, as the provided token is an installation access token.
     * github.repos.get({repo, owner}) does not return the "permissions" key in that case. But GitHub Actions
     * have all permissions required for @semantic-release/github to work
     */
    if (env.GITHUB_ACTION) {
      return
    }

    try {
      const {
        data: {
          permissions: { push }
        }
      } = await github.repos.get({ owner, repo })
      if (!push) {
        /*
         * If authenticated as GitHub App installation, `push` will always be false.
         * We send another request to check if current authentication is an installation.
         * Note: we cannot check if the installation has all required permissions, it's
         * up to the user to make sure it has
         */
        if (await github.request('HEAD /installation/repositories', { per_page: 1 }).catch(() => false)) {
          return
        }

        ;(verifyErrors as any).push(GetError('EGHNOPERMISSION', { owner, repo }))
      }
    } catch (error) {
      const HTTP_STATUS_401 = 401
      const HTTP_STATUS_404 = 404
      if (error.status === HTTP_STATUS_401) {
        ;(verifyErrors as any).push(GetError('EINVALIDGHTOKEN', { owner, repo }))
      } else if (error.status === HTTP_STATUS_404) {
        ;(verifyErrors as any).push(GetError('EMISSINGREPO', { owner, repo }))
      } else {
        throw error
      }
    }
  }

  if (!githubToken) {
    ;(verifyErrors as any).push(GetError('ENOGHTOKEN', { owner, repo }))
  }

  if (verifyErrors.length > 0) {
    throw new AggregateError(verifyErrors)
  }
}
