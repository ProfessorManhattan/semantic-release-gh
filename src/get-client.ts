import { Octokit } from '@octokit/rest'
import Bottleneck from 'bottleneck'
import { HttpProxyAgent } from 'http-proxy-agent'
import { HttpsProxyAgent } from 'https-proxy-agent'
import { get, memoize } from 'lodash'
import pRetry from 'p-retry'
import urljoin from 'url-join'
import { GLOBAL_RATE_LIMIT, RATE_LIMITS, RETRY_CONF } from './definitions/rate-limit'

/**
 * Http error status for which to not retry.
 */
const HTTP_STATUS_400 = 400
const HTTP_STATUS_401 = 401
const HTTP_STATUS_403 = 403
const SKIP_RETRY_CODES = new Set([HTTP_STATUS_400, HTTP_STATUS_401, HTTP_STATUS_403])

/**
 * Create or retrieve the throttler function for a given rate limit group.
 *
 * @param rate - The rate limit group.
 * @param limit - The rate limits per API endpoints.
 * @param globalThrottler - The global throttler.
 * @returns The throller function for the given rate limit group.
 */
const getThrottler = memoize((rate: number, globalThrottler: any) =>
  new Bottleneck({ minTime: get(RATE_LIMITS, rate) }).chain(globalThrottler)
)

export const GetClient: any = ({ githubToken, githubUrl, githubApiPathPrefix, proxy }: any) => {
  const baseUrl = githubUrl && urljoin(githubUrl, githubApiPathPrefix)
  const globalThrottler = new Bottleneck({ minTime: GLOBAL_RATE_LIMIT })
  const github = new Octokit({
    auth: `token ${githubToken}`,
    baseUrl,
    request: {
      agent: proxy
        ? baseUrl && new URL(baseUrl).protocol.replace(':', '') === 'http'
          ? new HttpProxyAgent(proxy)
          : new HttpsProxyAgent(proxy)
        : null
    }
  })

  github.hook.wrap('request', (request: any, options: any): any => {
    const access: 'read' | 'write' = options.method === 'GET' ? 'read' : 'write'
    const rateCategory: 'search' | 'core' = options.url.startsWith('/search') ? 'search' : 'core'
    // eslint-disable-next-line security/detect-object-injection
    const limitKey: any = [rateCategory, RATE_LIMITS[rateCategory][access] && access].filter(Boolean).join('.')

    return pRetry(async () => {
      try {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore:next-line
        return await getThrottler(limitKey, globalThrottler).wrap(request)(options)
      } catch (error) {
        if (SKIP_RETRY_CODES.has(error.status)) {
          throw new pRetry.AbortError(error)
        }

        throw error
      }
    }, RETRY_CONF)
  })

  return github
}
