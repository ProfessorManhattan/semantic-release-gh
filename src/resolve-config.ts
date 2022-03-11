import { castArray, isNil } from 'lodash'

export const ResolveConfig = (
  {
    githubUrl,
    githubApiPathPrefix,
    proxy,
    assets,
    successComment,
    failTitle,
    failComment,
    labels,
    assignees,
    releasedLabels,
    addReleases,
    repositoryUrl
  }: any,
  { env }: any
) => ({
  addReleases: isNil(addReleases) ? false : addReleases,
  assets: assets ? castArray(assets) : assets,
  assignees: assignees ? castArray(assignees) : assignees,
  failComment,
  failTitle: isNil(failTitle) ? 'The automated release is failing 🚨' : failTitle,
  githubApiPathPrefix: githubApiPathPrefix || env.GH_PREFIX || env.GITHUB_PREFIX || '',
  githubToken: env.GH_TOKEN || env.GITHUB_TOKEN,
  githubUrl: githubUrl || env.GITHUB_API_URL || env.GH_URL || env.GITHUB_URL,
  labels: isNil(labels) ? ['semantic-release'] : labels === false ? false : castArray(labels),
  proxy: isNil(proxy) ? env.http_proxy || env.HTTP_PROXY || false : proxy,
  releasedLabels: isNil(releasedLabels)
    ? // eslint-disable-next-line no-template-curly-in-string
      ['released<%= nextRelease.channel ? ` on @${nextRelease.channel}` : "" %>']
    : releasedLabels === false
    ? false
    : castArray(releasedLabels),
  repositoryUrl,
  successComment
})
