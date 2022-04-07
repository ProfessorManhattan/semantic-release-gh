import { RELEASE_NAME } from './definitions/constants'

const linkify = (releaseInfo: any) =>
  `${
    releaseInfo.url
      ? releaseInfo.url.startsWith('http')
        ? `**[${releaseInfo.name}](${releaseInfo.url})**`
        : `${releaseInfo.name}: \`${releaseInfo.url}\``
      : `\`${releaseInfo.name}\``
  }`

const filterReleases = (releaseInfos: any) =>
  releaseInfos.filter((releaseInfo: any) => releaseInfo.name && releaseInfo.name !== RELEASE_NAME)

export const GetReleaseLinks = (releaseInfos: any) => {
  return `${
    filterReleases(releaseInfos).length > 0
      ? `This release is also available on:\n${filterReleases(releaseInfos)
          .map((releaseInfo: any) => `- ${linkify(releaseInfo)}`)
          .join('\n')}`
      : ''
  }`
}
