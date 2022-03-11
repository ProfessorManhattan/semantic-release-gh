// eslint-disable-next-line unicorn/prefer-module
const SemanticReleaseError = require('@semantic-release/error')
import { ERROR_DEFINITIONS } from './definitions/errors'

export const GetError: any = (code: any, context: any = {}) => {
  // eslint-disable-next-line security/detect-object-injection
  const { message, details } = ERROR_DEFINITIONS[code](context)

  return new SemanticReleaseError(message, code, details)
}
