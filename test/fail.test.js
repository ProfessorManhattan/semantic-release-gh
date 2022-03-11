const { escape } = require('querystring')
const test = require('ava')
const nock = require('nock')
const { stub } = require('sinon')
const proxyquire = require('proxyquire')
const SemanticReleaseError = require('@semantic-release/error')
const { ISSUE_ID } = require('../dist/definitions/constants')
const { authenticate } = require('./helpers/mock-github')
const rateLimit = require('./helpers/rate-limit')

/* eslint camelcase: ["error", {properties: "never"}] */

const fail = proxyquire('../dist/fail', {
  './get-client': proxyquire('../dist/get-client', { './definitions/rate-limit': rateLimit })
})

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

test.serial('Open a new issue with the list of errors', async (t) => {
  const owner = 'test_user'
  const repo = 'test_repo'
  const redirectedOwner = 'test_user_2'
  const redirectedRepo = 'test_repo_2'
  const environment = { GITHUB_TOKEN: 'github_token' }
  const failTitle = 'The automated release is failing 🚨'
  const pluginConfig = { failTitle }
  const options = { repositoryUrl: `https://github.com/${owner}/${repo}.git` }
  const errors = [
    new SemanticReleaseError('Error message 1', 'ERR1', 'Error 1 details'),
    new SemanticReleaseError('Error message 2', 'ERR2', 'Error 2 details'),
    new SemanticReleaseError('Error message 3', 'ERR3', 'Error 3 details')
  ]
  const github = authenticate(environment)
    .get(`/repos/${owner}/${repo}`)
    .reply(200, { full_name: `${redirectedOwner}/${redirectedRepo}` })
    .get(
      `/search/issues?q=${escape('in:title')}+${escape(`repo:${redirectedOwner}/${redirectedRepo}`)}+${escape(
        'type:issue'
      )}+${escape('state:open')}+${escape(failTitle)}`
    )
    .reply(200, { items: [] })
    .post(`/repos/${redirectedOwner}/${redirectedRepo}/issues`, {
      body: /---\n\n### Error message 1\n\nError 1 details\n\n---\n\n### Error message 2\n\nError 2 details\n\n---\n\n### Error message 3\n\nError 3 details\n\n---/,
      labels: ['semantic-release'],
      title: failTitle
    })
    .reply(200, { html_url: 'https://github.com/issues/1', number: 1 })

  await fail(pluginConfig, { branch: { name: 'master' }, env: environment, errors, logger: t.context.logger, options })

  t.true(t.context.log.calledWith('Created issue #%d: %s.', 1, 'https://github.com/issues/1'))
  t.true(github.isDone())
})

test.serial('Open a new issue with the list of errors, retrying 4 times', async (t) => {
  const owner = 'test_user'
  const repo = 'test_repo'
  const environment = { GITHUB_TOKEN: 'github_token' }
  const failTitle = 'The automated release is failing 🚨'
  const pluginConfig = { failTitle }
  const options = { repositoryUrl: `https://github.com/${owner}/${repo}.git` }
  const errors = [
    new SemanticReleaseError('Error message 1', 'ERR1', 'Error 1 details'),
    new SemanticReleaseError('Error message 2', 'ERR2', 'Error 2 details'),
    new SemanticReleaseError('Error message 3', 'ERR3', 'Error 3 details')
  ]
  const github = authenticate(environment)
    .get(`/repos/${owner}/${repo}`)
    .reply(200, { full_name: `${owner}/${repo}` })
    .get(
      `/search/issues?q=${escape('in:title')}+${escape(`repo:${owner}/${repo}`)}+${escape('type:issue')}+${escape(
        'state:open'
      )}+${escape(failTitle)}`
    )
    .times(3)
    .reply(404)
    .get(
      `/search/issues?q=${escape('in:title')}+${escape(`repo:${owner}/${repo}`)}+${escape('type:issue')}+${escape(
        'state:open'
      )}+${escape(failTitle)}`
    )
    .reply(200, { items: [] })
    .post(`/repos/${owner}/${repo}/issues`, {
      body: /---\n\n### Error message 1\n\nError 1 details\n\n---\n\n### Error message 2\n\nError 2 details\n\n---\n\n### Error message 3\n\nError 3 details\n\n---/,
      labels: ['semantic-release'],
      title: failTitle
    })
    .times(3)
    .reply(500)
    .post(`/repos/${owner}/${repo}/issues`, {
      body: /---\n\n### Error message 1\n\nError 1 details\n\n---\n\n### Error message 2\n\nError 2 details\n\n---\n\n### Error message 3\n\nError 3 details\n\n---/,
      labels: ['semantic-release'],
      title: failTitle
    })
    .reply(200, { html_url: 'https://github.com/issues/1', number: 1 })

  await fail(pluginConfig, { branch: { name: 'master' }, env: environment, errors, logger: t.context.logger, options })

  t.true(t.context.log.calledWith('Created issue #%d: %s.', 1, 'https://github.com/issues/1'))
  t.true(github.isDone())
})

test.serial('Open a new issue with the list of errors and custom title and comment', async (t) => {
  const owner = 'test_user'
  const repo = 'test_repo'
  const environment = { GITHUB_TOKEN: 'github_token' }
  const failTitle = 'Custom title'
  const failComment = `branch \${branch.name} \${errors[0].message} \${errors[1].message} \${errors[2].message}`
  const pluginConfig = { failComment, failTitle }
  const options = { repositoryUrl: `https://github.com/${owner}/${repo}.git` }
  const errors = [
    new SemanticReleaseError('Error message 1', 'ERR1', 'Error 1 details'),
    new SemanticReleaseError('Error message 2', 'ERR2', 'Error 2 details'),
    new SemanticReleaseError('Error message 3', 'ERR3', 'Error 3 details')
  ]
  const github = authenticate(environment)
    .get(`/repos/${owner}/${repo}`)
    .reply(200, { full_name: `${owner}/${repo}` })
    .get(
      `/search/issues?q=${escape('in:title')}+${escape(`repo:${owner}/${repo}`)}+${escape('type:issue')}+${escape(
        'state:open'
      )}+${escape(failTitle)}`
    )
    .reply(200, { items: [] })
    .post(`/repos/${owner}/${repo}/issues`, {
      body: `branch master Error message 1 Error message 2 Error message 3\n\n${ISSUE_ID}`,
      labels: ['semantic-release'],
      title: failTitle
    })
    .reply(200, { html_url: 'https://github.com/issues/1', number: 1 })

  await fail(pluginConfig, { branch: { name: 'master' }, env: environment, errors, logger: t.context.logger, options })

  t.true(t.context.log.calledWith('Created issue #%d: %s.', 1, 'https://github.com/issues/1'))
  t.true(github.isDone())
})

test.serial('Open a new issue with assignees and the list of errors', async (t) => {
  const owner = 'test_user'
  const repo = 'test_repo'
  const environment = { GITHUB_TOKEN: 'github_token' }
  const failTitle = 'The automated release is failing 🚨'
  const assignees = ['user1', 'user2']
  const pluginConfig = { assignees, failTitle }
  const options = { repositoryUrl: `https://github.com/${owner}/${repo}.git` }
  const errors = [
    new SemanticReleaseError('Error message 1', 'ERR1', 'Error 1 details'),
    new SemanticReleaseError('Error message 2', 'ERR2', 'Error 2 details')
  ]
  const github = authenticate(environment)
    .get(`/repos/${owner}/${repo}`)
    .reply(200, { full_name: `${owner}/${repo}` })
    .get(
      `/search/issues?q=${escape('in:title')}+${escape(`repo:${owner}/${repo}`)}+${escape('type:issue')}+${escape(
        'state:open'
      )}+${escape(failTitle)}`
    )
    .reply(200, { items: [] })
    .post(`/repos/${owner}/${repo}/issues`, {
      assignees: ['user1', 'user2'],
      body: /---\n\n### Error message 1\n\nError 1 details\n\n---\n\n### Error message 2\n\nError 2 details\n\n---/,
      labels: ['semantic-release'],
      title: failTitle
    })
    .reply(200, { html_url: 'https://github.com/issues/1', number: 1 })

  await fail(pluginConfig, { branch: { name: 'master' }, env: environment, errors, logger: t.context.logger, options })

  t.true(t.context.log.calledWith('Created issue #%d: %s.', 1, 'https://github.com/issues/1'))
  t.true(github.isDone())
})

test.serial('Open a new issue without labels and the list of errors', async (t) => {
  const owner = 'test_user'
  const repo = 'test_repo'
  const environment = { GITHUB_TOKEN: 'github_token' }
  const failTitle = 'The automated release is failing 🚨'
  const labels = false
  const pluginConfig = { failTitle, labels }
  const options = { repositoryUrl: `https://github.com/${owner}/${repo}.git` }
  const errors = [
    new SemanticReleaseError('Error message 1', 'ERR1', 'Error 1 details'),
    new SemanticReleaseError('Error message 2', 'ERR2', 'Error 2 details')
  ]
  const github = authenticate(environment)
    .get(`/repos/${owner}/${repo}`)
    .reply(200, { full_name: `${owner}/${repo}` })
    .get(
      `/search/issues?q=${escape('in:title')}+${escape(`repo:${owner}/${repo}`)}+${escape('type:issue')}+${escape(
        'state:open'
      )}+${escape(failTitle)}`
    )
    .reply(200, { items: [] })
    .post(`/repos/${owner}/${repo}/issues`, {
      body: /---\n\n### Error message 1\n\nError 1 details\n\n---\n\n### Error message 2\n\nError 2 details\n\n---/,
      labels: [],
      title: failTitle
    })
    .reply(200, { html_url: 'https://github.com/issues/1', number: 1 })

  await fail(pluginConfig, { branch: { name: 'master' }, env: environment, errors, logger: t.context.logger, options })

  t.true(t.context.log.calledWith('Created issue #%d: %s.', 1, 'https://github.com/issues/1'))
  t.true(github.isDone())
})

test.serial('Update the first existing issue with the list of errors', async (t) => {
  const owner = 'test_user'
  const repo = 'test_repo'
  const environment = { GITHUB_TOKEN: 'github_token' }
  const failTitle = 'The automated release is failing 🚨'
  const pluginConfig = { failTitle }
  const options = { repositoryUrl: `https://github.com/${owner}/${repo}.git` }
  const errors = [
    new SemanticReleaseError('Error message 1', 'ERR1', 'Error 1 details'),
    new SemanticReleaseError('Error message 2', 'ERR2', 'Error 2 details'),
    new SemanticReleaseError('Error message 3', 'ERR3', 'Error 3 details')
  ]
  const issues = [
    { body: 'Issue 1 body', number: 1, title: failTitle },
    { body: `Issue 2 body\n\n${ISSUE_ID}`, number: 2, title: failTitle },
    { body: `Issue 3 body\n\n${ISSUE_ID}`, number: 3, title: failTitle }
  ]
  const github = authenticate(environment)
    .get(`/repos/${owner}/${repo}`)
    .reply(200, { full_name: `${owner}/${repo}` })
    .get(
      `/search/issues?q=${escape('in:title')}+${escape(`repo:${owner}/${repo}`)}+${escape('type:issue')}+${escape(
        'state:open'
      )}+${escape(failTitle)}`
    )
    .reply(200, { items: issues })
    .post(`/repos/${owner}/${repo}/issues/2/comments`, {
      body: /---\n\n### Error message 1\n\nError 1 details\n\n---\n\n### Error message 2\n\nError 2 details\n\n---\n\n### Error message 3\n\nError 3 details\n\n---/
    })
    .reply(200, { html_url: 'https://github.com/issues/2', number: 2 })

  await fail(pluginConfig, { branch: { name: 'master' }, env: environment, errors, logger: t.context.logger, options })

  t.true(t.context.log.calledWith('Found existing semantic-release issue #%d.', 2))
  t.true(t.context.log.calledWith('Added comment to issue #%d: %s.', 2, 'https://github.com/issues/2'))
  t.true(github.isDone())
})

test.serial('Skip if "failComment" is "false"', async (t) => {
  const owner = 'test_user'
  const repo = 'test_repo'
  const environment = { GITHUB_TOKEN: 'github_token' }
  const pluginConfig = { failComment: false }
  const options = { repositoryUrl: `https://github.com/${owner}/${repo}.git` }
  const errors = [
    new SemanticReleaseError('Error message 1', 'ERR1', 'Error 1 details'),
    new SemanticReleaseError('Error message 2', 'ERR2', 'Error 2 details'),
    new SemanticReleaseError('Error message 3', 'ERR3', 'Error 3 details')
  ]

  await fail(pluginConfig, { branch: { name: 'master' }, env: environment, errors, logger: t.context.logger, options })

  t.true(t.context.log.calledWith('Skip issue creation.'))
})

test.serial('Skip if "failTitle" is "false"', async (t) => {
  const owner = 'test_user'
  const repo = 'test_repo'
  const environment = { GITHUB_TOKEN: 'github_token' }
  const pluginConfig = { failTitle: false }
  const options = { repositoryUrl: `https://github.com/${owner}/${repo}.git` }
  const errors = [
    new SemanticReleaseError('Error message 1', 'ERR1', 'Error 1 details'),
    new SemanticReleaseError('Error message 2', 'ERR2', 'Error 2 details'),
    new SemanticReleaseError('Error message 3', 'ERR3', 'Error 3 details')
  ]

  await fail(pluginConfig, { branch: { name: 'master' }, env: environment, errors, logger: t.context.logger, options })

  t.true(t.context.log.calledWith('Skip issue creation.'))
})
