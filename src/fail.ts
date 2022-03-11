import Debug from 'debug'
import { template } from 'lodash'
import { ISSUE_ID } from './definitions/constants'
import { FindSRIssues } from './find-sr-issues'
import { GetClient } from './get-client'
import { GetFailComment } from './get-fail-comment'
import { ParseGitHubURL } from './parse-github-url'
import { ResolveConfig } from './resolve-config'

const debug = Debug('semantic-release:github')

export const FailGitHub = async (pluginConfig: any, context: any) => {
  const { options, branch, errors, logger } = context
  const {
    githubToken,
    githubUrl,
    githubApiPathPrefix,
    proxy,
    failComment,
    failTitle,
    labels,
    assignees,
    repositoryUrl
  } = ResolveConfig(pluginConfig, context)

  debug('options: %O', options)

  if (failComment === false || failTitle === false) {
    logger.log('Skip issue creation.')
  } else {
    const github = GetClient(githubApiPathPrefix, githubToken, githubUrl, proxy)
    // In case the repo changed name, get the new `repo`/`owner` as the search API will not follow redirects
    const [owner, repo] = (await github.repos.get(ParseGitHubURL(repositoryUrl))).data.full_name.split('/')
    const body = failComment ? template(failComment)({ branch, errors }) : GetFailComment(branch, errors)
    const [srIssue] = await FindSRIssues(github, failTitle, owner, repo)

    if (srIssue) {
      logger.log('Found existing semantic-release issue #%d.', srIssue.number)
      const comment = { body, issue_number: srIssue.number, owner, repo }
      debug('create comment: %O', comment)
      const {
        data: { html_url: url }
      } = await github.issues.createComment(comment)
      logger.log('Added comment to issue #%d: %s.', srIssue.number, url)
    } else {
      const newIssue = {
        assignees,
        body: `${body}\n\n${ISSUE_ID}`,
        labels: labels || [],
        owner,
        repo,
        title: failTitle
      }
      debug('create issue: %O', newIssue)
      const {
        data: { html_url: url, number }
      } = await github.issues.create(newIssue)
      logger.log('Created issue #%d: %s.', number, url)
    }
  }
}
