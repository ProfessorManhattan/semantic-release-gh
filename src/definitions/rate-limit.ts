/**
 * Default exponential backoff configuration for retries.
 */
const MILLIS_IN_SECONDS = 1000
const RETRIES = 3
const FACTOR = 2
export const RETRY_CONF = { factor: FACTOR, minTimeout: MILLIS_IN_SECONDS, retries: RETRIES }

/**
 * Rate limit per API endpoints.
 *
 * See {@link https://developer.github.com/v3/search/#rate-limit|Search API rate limit}.
 * See {@link https://developer.github.com/v3/#rate-limiting|Rate limiting}.
 */
const SECONDS_IN_HOUR = 3600
const CALLS_PER_HOUR_MAX = 5000
const WRITE_DELAY = 3000
const MILLIS_IN_HOUR = 60_000
const MINUTES_IN_HALF_HOUR = 30
const SAFETY_MODIFIER = 1.1
export const RATE_LIMITS: any = {
  // 30 calls per minutes => 1 call every 2s + 10% safety margin
  core: {
    // 5000 calls per hour => 1 call per 720ms + 10% safety margin
    read: ((SECONDS_IN_HOUR * MILLIS_IN_SECONDS) / CALLS_PER_HOUR_MAX) * SAFETY_MODIFIER,
    // 1 call every 3 seconds
    write: WRITE_DELAY
  },
  search: (MILLIS_IN_HOUR / MINUTES_IN_HALF_HOUR) * SAFETY_MODIFIER
}

/**
 * Global rate limit to prevent abuse.
 *
 * See {@link https://developer.github.com/v3/guides/best-practices-for-integrators/#dealing-with-abuse-rate-limits|Dealing with abuse rate limits}
 */
export const GLOBAL_RATE_LIMIT = 1000
