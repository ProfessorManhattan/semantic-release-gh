import AggregateError from 'aggregate-error'
import Debug from 'debug'
import issueParser from 'issue-parser'
import { flatten, isEmpty, isNil, template, uniqBy } from 'lodash'
import pFilter from 'p-filter'
import { RELEASE_NAME } from './definitions/constants'
import { FindSRIssues } from './find-sr-issues'
import { GetClient } from './get-client'
import { GetReleaseLinks } from './get-release-links'
import { GetSearchQueries } from './get-search-queries'
import { GetSuccessComment } from './get-success-comment'
import { ParseGitHubURL } from './parse-github-url'
import { ResolveConfig } from './resolve-config'

const debug = Debug('semantic-release:github')

export const SuccessGitHub = async (pluginConfig: any, context: any) => {
  const { options, commits, nextRelease, releases, logger } = context
  const {
    githubToken,
    githubUrl,
    githubApiPathPrefix,
    proxy,
    successComment,
    failComment,
    failTitle,
    releasedLabels,
    addReleases,
    repositoryUrl
  } = ResolveConfig(pluginConfig, context)

  debug('options: %O', options)

  const github = GetClient({ githubApiPathPrefix, githubToken, githubUrl, proxy })
  // In case the repo changed name, get the new `repo`/`owner` as the search API will not follow redirects
  const [owner, repo] = (await github.repos.get(ParseGitHubURL(repositoryUrl))).data.full_name.split('/')

  const errors: readonly any[] = []

  if (successComment === false) {
    logger.log('Skipping commenting on issues and pull requests.')
  } else {
    const parser = issueParser('github', githubUrl ? { hosts: [githubUrl] } : {})
    const releaseInfos = releases.filter((release: any) => Boolean(release.name))
    const shas = commits.map(({ hash }: any) => hash)

    const searchQueries = GetSearchQueries(`repo:${owner}/${repo}+type:pr+is:merged`, shas).map(
      async (q: any) => (await github.search.issuesAndPullRequests({ q })).data.items
    )

    const prs = await pFilter(
      uniqBy(flatten(await Promise.all(searchQueries)), 'number'),
      async ({ pullNumber }: any) =>
        (
          await github.pulls.listCommits({ owner, pull_number: pullNumber, repo })
        ).data.find(({ sha }: any) => shas.includes(sha)) ||
        shas.includes((await github.pulls.get({ owner, pull_number: pullNumber, repo })).data.merge_commit_sha)
    )

    debug(
      'found pull requests: %O',
      prs.map((pr) => pr.number)
    )

    // Parse the release commits message and PRs body to find resolved issues/PRs via comment keyworkds
    // eslint-disable-next-line unicorn/no-array-reduce
    const issues = [...prs.map((pr) => pr.body), ...commits.map((commit: any) => commit.message)].reduce(
      (issues_, message) => {
        return message
          ? // eslint-disable-next-line unicorn/prefer-spread
            issues_.concat(
              parser(message)
                .actions.close.filter((action: any) => isNil(action.slug) || action.slug === `${owner}/${repo}`)
                .map((action: any) => ({ number: Number.parseInt(action.issue, 10) }))
            )
          : issues_
      },
      []
    )

    debug('found issues via comments: %O', issues)

    await Promise.all(
      uniqBy([...prs, ...issues], 'number').map(async (issue) => {
        const body = successComment
          ? template(successComment)({ ...context, issue })
          : GetSuccessComment(issue, releaseInfos, nextRelease)
        try {
          const comment = { body, issue_number: issue.number, owner, repo }
          debug('create comment: %O', comment)
          const {
            data: { html_url: url }
          } = await github.issues.createComment(comment)
          logger.log('Added comment to issue #%d: %s', issue.number, url)

          if (releasedLabels) {
            const labels = (releasedLabels as readonly any[]).map((label: any) => template(label)(context))
            /*
             * Don’t use .issues.addLabels for GHE < 2.16 support
             * https://github.com/semantic-release/github/issues/138
             */
            await github.request('POST /repos/:owner/:repo/issues/:number/labels', {
              data: labels,
              number: issue.number,
              owner,
              repo
            })
            logger.log('Added labels %O to issue #%d', labels, issue.number)
          }
        } catch (error) {
          const HTTP_STATUS_403 = 403
          const HTTP_STATUS_404 = 404
          if (error.status === HTTP_STATUS_403) {
            logger.error('Not allowed to add a comment to the issue #%d.', issue.number)
          } else if (error.status === HTTP_STATUS_404) {
            logger.log(
              "Failed to add a comment to the issue #%d as it doesn't exist. This issue might be on GitLab.",
              issue.number
            )
          } else {
            ;(errors as any).push(error)
            logger.error('Failed to add a comment to the issue #%d.', issue.number)
            // Don't throw right away and continue to update other issues
          }
        }
      })
    )
  }

  if (failComment === false || failTitle === false) {
    logger.log('Skip closing issue.')
  } else {
    const srIssues = await FindSRIssues(github, failTitle, owner, repo)

    debug('found semantic-release issues: %O', srIssues)

    await Promise.all(
      srIssues.map(async (issue: any) => {
        debug('close issue: %O', issue)
        try {
          const updateIssue = { issue_number: issue.number, owner, repo, state: 'closed' }
          debug('closing issue: %O', updateIssue)
          const {
            data: { html_url: url }
          } = await github.issues.update(updateIssue)
          logger.log('Closed issue #%d: %s.', issue.number, url)
        } catch (error) {
          ;(errors as any).push(error)
          logger.error('Failed to close the issue #%d.', issue.number)
          // Don't throw right away and continue to close other issues
        }
      })
    )
  }

  if (addReleases !== false && errors.length === 0) {
    const ghRelease = releases.find((release: any) => release.name && release.name === RELEASE_NAME)
    if (!isNil(ghRelease)) {
      const ghRelaseId = ghRelease.id
      const additionalReleases = GetReleaseLinks(releases)
      if (!isEmpty(additionalReleases) && !isNil(ghRelaseId)) {
        const newBody =
          addReleases === 'top'
            ? [...additionalReleases, '\n---\n', ...nextRelease.notes]
            : [nextRelease.notes, '\n---\n', ...additionalReleases].join('')
        await github.repos.updateRelease({ body: newBody, owner, release_id: ghRelaseId, repo })
      }
    }
  }

  if (errors.length > 0) {
    throw new AggregateError(errors)
  }
}
