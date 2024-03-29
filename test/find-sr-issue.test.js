const { escape } = require('querystring')
const test = require('ava')
const nock = require('nock')
const { stub } = require('sinon')
const proxyquire = require('proxyquire')
const { ISSUE_ID } = require('../dist/definitions/constants')
const findSRIssues = require('../dist/find-sr-issues')
const { authenticate } = require('./helpers/mock-github')
const rateLimit = require('./helpers/rate-limit')

const githubToken = 'github_token'
const client = proxyquire('../dist/get-client', { './definitions/rate-limit': rateLimit })({ githubToken })

test.beforeEach((t) => {
  // Mock logger
  t.context.log = stub()
  t.context.error = stub()
  t.context.logger = { error: t.context.error, log: t.context.log }
})

test.afterEach.always(() => {
  // Clear nock
  nock.cleanAll()
})

test.serial('Filter out issues without ID', async (t) => {
  const owner = 'test_user'
  const repo = 'test_repo'
  const githubToken = 'github_token'
  const title = 'The automated release is failing 🚨'
  const issues = [
    { body: 'Issue 1 body', number: 1, title },
    { body: `Issue 2 body\n\n${ISSUE_ID}`, number: 2, title },
    { body: `Issue 3 body\n\n${ISSUE_ID}`, number: 3, title }
  ]
  const github = authenticate({}, { githubToken })
    .get(
      `/search/issues?q=${escape('in:title')}+${escape(`repo:${owner}/${repo}`)}+${escape('type:issue')}+${escape(
        'state:open'
      )}+${escape(title)}`
    )
    .reply(200, { items: issues })

  const srIssues = await findSRIssues(client, title, owner, repo)

  t.deepEqual(srIssues, [
    { body: 'Issue 2 body\n\n<!-- semantic-release:github -->', number: 2, title },
    { body: 'Issue 3 body\n\n<!-- semantic-release:github -->', number: 3, title }
  ])

  t.true(github.isDone())
})

test.serial('Return empty array if not issues found', async (t) => {
  const owner = 'test_user'
  const repo = 'test_repo'
  const githubToken = 'github_token'
  const title = 'The automated release is failing 🚨'
  const issues = []
  const github = authenticate({}, { githubToken })
    .get(
      `/search/issues?q=${escape('in:title')}+${escape(`repo:${owner}/${repo}`)}+${escape('type:issue')}+${escape(
        'state:open'
      )}+${escape(title)}`
    )
    .reply(200, { items: issues })

  const srIssues = await findSRIssues(client, title, owner, repo)

  t.deepEqual(srIssues, [])

  t.true(github.isDone())
})

test.serial('Return empty array if not issues has matching ID', async (t) => {
  const owner = 'test_user'
  const repo = 'test_repo'
  const githubToken = 'github_token'
  const title = 'The automated release is failing 🚨'
  const issues = [
    { body: 'Issue 1 body', number: 1, title },
    { body: 'Issue 2 body', number: 2, title }
  ]
  const github = authenticate({}, { githubToken })
    .get(
      `/search/issues?q=${escape('in:title')}+${escape(`repo:${owner}/${repo}`)}+${escape('type:issue')}+${escape(
        'state:open'
      )}+${escape(title)}`
    )
    .reply(200, { items: issues })

  const srIssues = await findSRIssues(client, title, owner, repo)

  t.deepEqual(srIssues, [])
  t.true(github.isDone())
})

test.serial('Retries 4 times', async (t) => {
  const owner = 'test_user'
  const repo = 'test_repo'
  const title = 'The automated release is failing :rotating_light:'
  const github = authenticate({}, { githubToken })
    .get(
      `/search/issues?q=${escape('in:title')}+${escape(`repo:${owner}/${repo}`)}+${escape('type:issue')}+${escape(
        'state:open'
      )}+${escape(title)}`
    )
    .times(4)
    .reply(422)

  const error = await t.throwsAsync(findSRIssues(client, title, owner, repo))

  t.is(error.status, 422)
  t.true(github.isDone())
})

test.serial('Do not retry on 401 error', async (t) => {
  const owner = 'test_user'
  const repo = 'test_repo'
  const title = 'The automated release is failing :rotating_light:'
  const github = authenticate({}, { githubToken })
    .get(
      `/search/issues?q=${escape('in:title')}+${escape(`repo:${owner}/${repo}`)}+${escape('type:issue')}+${escape(
        'state:open'
      )}+${escape(title)}`
    )
    .reply(401)

  const error = await t.throwsAsync(findSRIssues(client, title, owner, repo))

  t.is(error.status, 401)
  t.true(github.isDone())
})
