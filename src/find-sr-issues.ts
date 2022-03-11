import { ISSUE_ID } from './definitions/constants'

// eslint-disable-next-line max-params
export const FindSRIssues = async (github: any, title: string, owner: string, repo: string) => {
  const {
    data: { items: issues }
  } = await github.search.issuesAndPullRequests({
    // eslint-disable-next-line id-length
    q: `in:title+repo:${owner}/${repo}+type:issue+state:open+${title}`
  })

  return issues.filter((issue: any) => issue.body && issue.body.includes(ISSUE_ID))
}
