const test = require('ava')
const nock = require('nock')
const { stub } = require('sinon')
const proxyquire = require('proxyquire')
const { authenticate } = require('./helpers/mock-github')
const rateLimit = require('./helpers/rate-limit')

/* eslint camelcase: ["error", {properties: "never"}] */

const addChannel = proxyquire('../dist/add-channel', {
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

test.serial('Update a release', async (t) => {
  const owner = 'test_user'
  const repo = 'test_repo'
  const environment = { GITHUB_TOKEN: 'github_token' }
  const pluginConfig = {}
  const nextRelease = { gitTag: 'v1.0.0', name: 'v1.0.0', notes: 'Test release note body' }
  const options = { repositoryUrl: `https://github.com/${owner}/${repo}.git` }
  const releaseUrl = `https://github.com/${owner}/${repo}/releases/${nextRelease.version}`
  const releaseId = 1

  const github = authenticate(environment)
    .get(`/repos/${owner}/${repo}/releases/tags/${nextRelease.gitTag}`)
    .reply(200, { id: releaseId })
    .patch(`/repos/${owner}/${repo}/releases/${releaseId}`, {
      name: nextRelease.name,
      prerelease: false,
      tag_name: nextRelease.gitTag
    })
    .reply(200, { html_url: releaseUrl })

  const result = await addChannel(pluginConfig, {
    branch: { main: true, type: 'release' },
    env: environment,
    logger: t.context.logger,
    nextRelease,
    options
  })

  t.is(result.url, releaseUrl)
  t.deepEqual(t.context.log.args[0], ['Updated GitHub release: %s', releaseUrl])
  t.true(github.isDone())
})

test.serial('Update a maintenance release', async (t) => {
  const owner = 'test_user'
  const repo = 'test_repo'
  const environment = { GITHUB_TOKEN: 'github_token' }
  const pluginConfig = {}
  const nextRelease = { channel: '1.x', gitTag: 'v1.0.0', name: 'v1.0.0', notes: 'Test release note body' }
  const options = { repositoryUrl: `https://github.com/${owner}/${repo}.git` }
  const releaseUrl = `https://github.com/${owner}/${repo}/releases/${nextRelease.version}`
  const releaseId = 1

  const github = authenticate(environment)
    .get(`/repos/${owner}/${repo}/releases/tags/${nextRelease.gitTag}`)
    .reply(200, { id: releaseId })
    .patch(`/repos/${owner}/${repo}/releases/${releaseId}`, {
      name: nextRelease.name,
      prerelease: false,
      tag_name: nextRelease.gitTag
    })
    .reply(200, { html_url: releaseUrl })

  const result = await addChannel(pluginConfig, {
    branch: { channel: '1.x', main: false, type: 'maintenance' },
    env: environment,
    logger: t.context.logger,
    nextRelease,
    options
  })

  t.is(result.url, releaseUrl)
  t.deepEqual(t.context.log.args[0], ['Updated GitHub release: %s', releaseUrl])
  t.true(github.isDone())
})

test.serial('Update a prerelease', async (t) => {
  const owner = 'test_user'
  const repo = 'test_repo'
  const environment = { GITHUB_TOKEN: 'github_token' }
  const pluginConfig = {}
  const nextRelease = { gitTag: 'v1.0.0', name: 'v1.0.0', notes: 'Test release note body' }
  const options = { repositoryUrl: `https://github.com/${owner}/${repo}.git` }
  const releaseUrl = `https://github.com/${owner}/${repo}/releases/${nextRelease.version}`
  const releaseId = 1

  const github = authenticate(environment)
    .get(`/repos/${owner}/${repo}/releases/tags/${nextRelease.gitTag}`)
    .reply(200, { id: releaseId })
    .patch(`/repos/${owner}/${repo}/releases/${releaseId}`, {
      name: nextRelease.name,
      prerelease: false,
      tag_name: nextRelease.gitTag
    })
    .reply(200, { html_url: releaseUrl })

  const result = await addChannel(pluginConfig, {
    branch: { channel: '1.x', main: false, type: 'maintenance' },
    env: environment,
    logger: t.context.logger,
    nextRelease,
    options
  })

  t.is(result.url, releaseUrl)
  t.deepEqual(t.context.log.args[0], ['Updated GitHub release: %s', releaseUrl])
  t.true(github.isDone())
})

test.serial('Update a release with a custom github url', async (t) => {
  const owner = 'test_user'
  const repo = 'test_repo'
  const environment = { GH_PREFIX: 'prefix', GH_TOKEN: 'github_token', GH_URL: 'https://othertesturl.com:443' }
  const pluginConfig = {}
  const nextRelease = { gitTag: 'v1.0.0', name: 'v1.0.0', notes: 'Test release note body' }
  const options = { repositoryUrl: `${environment.GH_URL}/${owner}/${repo}.git` }
  const releaseUrl = `${environment.GH_URL}/${owner}/${repo}/releases/${nextRelease.version}`
  const releaseId = 1

  const github = authenticate(environment)
    .get(`/repos/${owner}/${repo}/releases/tags/${nextRelease.gitTag}`)
    .reply(200, { id: releaseId })
    .patch(`/repos/${owner}/${repo}/releases/${releaseId}`, {
      name: nextRelease.name,
      prerelease: false,
      tag_name: nextRelease.gitTag
    })
    .reply(200, { html_url: releaseUrl })

  const result = await addChannel(pluginConfig, {
    branch: { main: true, type: 'release' },
    env: environment,
    logger: t.context.logger,
    nextRelease,
    options
  })

  t.is(result.url, releaseUrl)
  t.deepEqual(t.context.log.args[0], ['Updated GitHub release: %s', releaseUrl])
  t.true(github.isDone())
})

test.serial('Update a release, retrying 4 times', async (t) => {
  const owner = 'test_user'
  const repo = 'test_repo'
  const environment = { GITHUB_TOKEN: 'github_token' }
  const pluginConfig = {}
  const nextRelease = { gitTag: 'v1.0.0', name: 'v1.0.0', notes: 'Test release note body' }
  const options = { repositoryUrl: `https://github.com/${owner}/${repo}.git` }
  const releaseUrl = `https://github.com/${owner}/${repo}/releases/${nextRelease.version}`
  const releaseId = 1

  const github = authenticate(environment)
    .get(`/repos/${owner}/${repo}/releases/tags/${nextRelease.gitTag}`)
    .times(3)
    .reply(404)
    .get(`/repos/${owner}/${repo}/releases/tags/${nextRelease.gitTag}`)
    .reply(200, { id: releaseId })
    .patch(`/repos/${owner}/${repo}/releases/${releaseId}`, {
      name: nextRelease.name,
      prerelease: false,
      tag_name: nextRelease.gitTag
    })
    .times(3)
    .reply(500)
    .patch(`/repos/${owner}/${repo}/releases/${releaseId}`, {
      name: nextRelease.name,
      prerelease: false,
      tag_name: nextRelease.gitTag
    })
    .reply(200, { html_url: releaseUrl })

  const result = await addChannel(pluginConfig, {
    branch: { main: true, type: 'release' },
    env: environment,
    logger: t.context.logger,
    nextRelease,
    options
  })

  t.is(result.url, releaseUrl)
  t.deepEqual(t.context.log.args[0], ['Updated GitHub release: %s', releaseUrl])
  t.true(github.isDone())
})

test.serial('Create the new release if current one is missing', async (t) => {
  const owner = 'test_user'
  const repo = 'test_repo'
  const environment = { GITHUB_TOKEN: 'github_token' }
  const pluginConfig = {}
  const nextRelease = { gitTag: 'v1.0.0', name: 'v1.0.0', notes: 'Test release note body' }
  const options = { repositoryUrl: `https://github.com/${owner}/${repo}.git` }
  const releaseUrl = `https://github.com/${owner}/${repo}/releases/${nextRelease.version}`

  const github = authenticate(environment)
    .get(`/repos/${owner}/${repo}/releases/tags/${nextRelease.gitTag}`)
    .times(4)
    .reply(404)
    .post(`/repos/${owner}/${repo}/releases`, {
      body: nextRelease.notes,
      name: nextRelease.name,
      prerelease: false,
      tag_name: nextRelease.gitTag
    })
    .reply(200, { html_url: releaseUrl })

  const result = await addChannel(pluginConfig, {
    branch: { main: true, type: 'release' },
    env: environment,
    logger: t.context.logger,
    nextRelease,
    options
  })

  t.is(result.url, releaseUrl)
  t.deepEqual(t.context.log.args[0], ['There is no release for tag %s, creating a new one', nextRelease.gitTag])
  t.deepEqual(t.context.log.args[1], ['Published GitHub release: %s', releaseUrl])
  t.true(github.isDone())
})

test.serial('Throw error if cannot read current release', async (t) => {
  const owner = 'test_user'
  const repo = 'test_repo'
  const environment = { GITHUB_TOKEN: 'github_token' }
  const pluginConfig = {}
  const nextRelease = { gitTag: 'v1.0.0', name: 'v1.0.0', notes: 'Test release note body' }
  const options = { repositoryUrl: `https://github.com/${owner}/${repo}.git` }

  const github = authenticate(environment)
    .get(`/repos/${owner}/${repo}/releases/tags/${nextRelease.gitTag}`)
    .times(4)
    .reply(500)

  const error = await t.throwsAsync(
    addChannel(pluginConfig, {
      branch: { main: true, type: 'release' },
      env: environment,
      logger: t.context.logger,
      nextRelease,
      options
    })
  )

  t.is(error.status, 500)
  t.true(github.isDone())
})

test.serial('Throw error if cannot create missing current release', async (t) => {
  const owner = 'test_user'
  const repo = 'test_repo'
  const environment = { GITHUB_TOKEN: 'github_token' }
  const pluginConfig = {}
  const nextRelease = { gitTag: 'v1.0.0', name: 'v1.0.0', notes: 'Test release note body' }
  const options = { repositoryUrl: `https://github.com/${owner}/${repo}.git` }

  const github = authenticate(environment)
    .get(`/repos/${owner}/${repo}/releases/tags/${nextRelease.gitTag}`)
    .times(4)
    .reply(404)
    .post(`/repos/${owner}/${repo}/releases`, {
      body: nextRelease.notes,
      name: nextRelease.name,
      prerelease: false,
      tag_name: nextRelease.gitTag
    })
    .times(4)
    .reply(500)

  const error = await t.throwsAsync(
    addChannel(pluginConfig, {
      branch: { main: true, type: 'release' },
      env: environment,
      logger: t.context.logger,
      nextRelease,
      options
    })
  )

  t.is(error.status, 500)
  t.true(github.isDone())
})

test.serial('Throw error if cannot update release', async (t) => {
  const owner = 'test_user'
  const repo = 'test_repo'
  const environment = { GITHUB_TOKEN: 'github_token' }
  const pluginConfig = {}
  const nextRelease = { gitTag: 'v1.0.0', name: 'v1.0.0', notes: 'Test release note body' }
  const options = { repositoryUrl: `https://github.com/${owner}/${repo}.git` }
  const releaseId = 1

  const github = authenticate(environment)
    .get(`/repos/${owner}/${repo}/releases/tags/${nextRelease.gitTag}`)
    .reply(200, { id: releaseId })
    .patch(`/repos/${owner}/${repo}/releases/${releaseId}`, {
      name: nextRelease.name,
      prerelease: false,
      tag_name: nextRelease.gitTag
    })
    .times(4)
    .reply(404)

  const error = await t.throwsAsync(
    addChannel(pluginConfig, {
      branch: { main: true, type: 'release' },
      env: environment,
      logger: t.context.logger,
      nextRelease,
      options
    })
  )

  t.is(error.status, 404)
  t.true(github.isDone())
})
