const path = require('path')
const { escape } = require('querystring')
const test = require('ava')
const { stat } = require('fs-extra')
const nock = require('nock')
const { stub } = require('sinon')
const proxyquire = require('proxyquire')
const tempy = require('tempy')
const { authenticate, upload } = require('./helpers/mock-github')
const rateLimit = require('./helpers/rate-limit')

/* eslint camelcase: ["error", {properties: "never"}] */

const cwd = 'test/fixtures/files'
const publish = proxyquire('../dist/publish', {
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

test.serial('Publish a release', async (t) => {
  const owner = 'test_user'
  const repo = 'test_repo'
  const environment = { GITHUB_TOKEN: 'github_token' }
  const pluginConfig = {}
  const nextRelease = { gitTag: 'v1.0.0', name: 'v1.0.0', notes: 'Test release note body' }
  const options = { repositoryUrl: `https://github.com/${owner}/${repo}.git` }
  const releaseUrl = `https://github.com/${owner}/${repo}/releases/${nextRelease.version}`
  const releaseId = 1
  const uploadUri = `/api/uploads/repos/${owner}/${repo}/releases/${releaseId}/assets`
  const uploadUrl = `https://github.com${uploadUri}{?name,label}`
  const branch = 'test_branch'

  const github = authenticate(environment)
    .post(`/repos/${owner}/${repo}/releases`, {
      body: nextRelease.notes,
      name: nextRelease.name,
      prerelease: false,
      tag_name: nextRelease.gitTag,
      target_commitish: branch
    })
    .reply(200, { html_url: releaseUrl, upload_url: uploadUrl })

  const result = await publish(pluginConfig, {
    branch: { main: true, name: branch, type: 'release' },
    cwd,
    env: environment,
    logger: t.context.logger,
    nextRelease,
    options
  })

  t.is(result.url, releaseUrl)
  t.deepEqual(t.context.log.args[0], ['Published GitHub release: %s', releaseUrl])
  t.true(github.isDone())
})

test.serial('Publish a release on a channel', async (t) => {
  const owner = 'test_user'
  const repo = 'test_repo'
  const environment = { GITHUB_TOKEN: 'github_token' }
  const pluginConfig = {}
  const nextRelease = { gitTag: 'v1.0.0', name: 'v1.0.0', notes: 'Test release note body' }
  const options = { repositoryUrl: `https://github.com/${owner}/${repo}.git` }
  const releaseUrl = `https://github.com/${owner}/${repo}/releases/${nextRelease.version}`
  const releaseId = 1
  const uploadUri = `/api/uploads/repos/${owner}/${repo}/releases/${releaseId}/assets`
  const uploadUrl = `https://github.com${uploadUri}{?name,label}`
  const branch = 'test_branch'

  const github = authenticate(environment)
    .post(`/repos/${owner}/${repo}/releases`, {
      body: nextRelease.notes,
      name: nextRelease.name,
      prerelease: true,
      tag_name: nextRelease.gitTag,
      target_commitish: branch
    })
    .reply(200, { html_url: releaseUrl, upload_url: uploadUrl })

  const result = await publish(pluginConfig, {
    branch: { channel: 'next', main: false, name: branch, type: 'release' },
    cwd,
    env: environment,
    logger: t.context.logger,
    nextRelease,
    options
  })

  t.is(result.url, releaseUrl)
  t.deepEqual(t.context.log.args[0], ['Published GitHub release: %s', releaseUrl])
  t.true(github.isDone())
})

test.serial('Publish a prerelease', async (t) => {
  const owner = 'test_user'
  const repo = 'test_repo'
  const environment = { GITHUB_TOKEN: 'github_token' }
  const pluginConfig = {}
  const nextRelease = { gitTag: 'v1.0.0', name: 'v1.0.0', notes: 'Test release note body' }
  const options = { repositoryUrl: `https://github.com/${owner}/${repo}.git` }
  const releaseUrl = `https://github.com/${owner}/${repo}/releases/${nextRelease.version}`
  const releaseId = 1
  const uploadUri = `/api/uploads/repos/${owner}/${repo}/releases/${releaseId}/assets`
  const uploadUrl = `https://github.com${uploadUri}{?name,label}`
  const branch = 'test_branch'

  const github = authenticate(environment)
    .post(`/repos/${owner}/${repo}/releases`, {
      body: nextRelease.notes,
      name: nextRelease.name,
      prerelease: true,
      tag_name: nextRelease.gitTag,
      target_commitish: branch
    })
    .reply(200, { html_url: releaseUrl, upload_url: uploadUrl })

  const result = await publish(pluginConfig, {
    branch: { channel: 'beta', name: branch, type: 'prerelease' },
    cwd,
    env: environment,
    logger: t.context.logger,
    nextRelease,
    options
  })

  t.is(result.url, releaseUrl)
  t.deepEqual(t.context.log.args[0], ['Published GitHub release: %s', releaseUrl])
  t.true(github.isDone())
})

test.serial('Publish a maintenance release', async (t) => {
  const owner = 'test_user'
  const repo = 'test_repo'
  const environment = { GITHUB_TOKEN: 'github_token' }
  const pluginConfig = {}
  const nextRelease = { gitTag: 'v1.0.0', name: 'v1.0.0', notes: 'Test release note body' }
  const options = { repositoryUrl: `https://github.com/${owner}/${repo}.git` }
  const releaseUrl = `https://github.com/${owner}/${repo}/releases/${nextRelease.version}`
  const releaseId = 1
  const uploadUri = `/api/uploads/repos/${owner}/${repo}/releases/${releaseId}/assets`
  const uploadUrl = `https://github.com${uploadUri}{?name,label}`
  const branch = 'test_branch'

  const github = authenticate(environment)
    .post(`/repos/${owner}/${repo}/releases`, {
      body: nextRelease.notes,
      name: nextRelease.name,
      prerelease: false,
      tag_name: nextRelease.gitTag,
      target_commitish: branch
    })
    .reply(200, { html_url: releaseUrl, id: releaseId, upload_url: uploadUrl })

  const result = await publish(pluginConfig, {
    branch: { channel: '1.x', main: false, name: 'test_branch', type: 'maintenance' },
    cwd,
    env: environment,
    logger: t.context.logger,
    nextRelease,
    options
  })

  t.is(result.url, releaseUrl)
  t.deepEqual(t.context.log.args[0], ['Published GitHub release: %s', releaseUrl])
  t.true(github.isDone())
})

test.serial('Publish a release, retrying 4 times', async (t) => {
  const owner = 'test_user'
  const repo = 'test_repo'
  const environment = { GITHUB_TOKEN: 'github_token' }
  const pluginConfig = {}
  const nextRelease = { gitTag: 'v1.0.0', name: 'v1.0.0', notes: 'Test release note body' }
  const options = { repositoryUrl: `https://github.com/${owner}/${repo}.git` }
  const releaseUrl = `https://github.com/${owner}/${repo}/releases/${nextRelease.version}`
  const releaseId = 1
  const uploadUri = `/api/uploads/repos/${owner}/${repo}/releases/${releaseId}/assets`
  const uploadUrl = `https://github.com${uploadUri}{?name,label}`
  const branch = 'test_branch'

  const github = authenticate(environment)
    .post(`/repos/${owner}/${repo}/releases`, {
      body: nextRelease.notes,
      name: nextRelease.gitTag,
      prerelease: false,
      tag_name: nextRelease.gitTag,
      target_commitish: branch
    })
    .times(3)
    .reply(404)
    .post(`/repos/${owner}/${repo}/releases`, {
      body: nextRelease.notes,
      name: nextRelease.name,
      prerelease: false,
      tag_name: nextRelease.gitTag,
      target_commitish: branch
    })
    .reply(200, { html_url: releaseUrl, id: releaseId, upload_url: uploadUrl })

  const result = await publish(pluginConfig, {
    branch: { main: true, name: branch, type: 'release' },
    cwd,
    env: environment,
    logger: t.context.logger,
    nextRelease,
    options
  })

  t.is(result.url, releaseUrl)
  t.deepEqual(t.context.log.args[0], ['Published GitHub release: %s', releaseUrl])
  t.true(github.isDone())
})

test.serial('Publish a release with one asset', async (t) => {
  const owner = 'test_user'
  const repo = 'test_repo'
  const environment = { GITHUB_TOKEN: 'github_token' }
  const pluginConfig = {
    assets: [['**', '!**/*.txt'], { label: 'A dotfile with no ext', path: '.dotfile' }]
  }
  const nextRelease = { gitTag: 'v1.0.0', name: 'v1.0.0', notes: 'Test release note body' }
  const options = { repositoryUrl: `https://github.com/${owner}/${repo}.git` }
  const untaggedReleaseUrl = `https://github.com/${owner}/${repo}/releases/untagged-123`
  const releaseUrl = `https://github.com/${owner}/${repo}/releases/${nextRelease.version}`
  const assetUrl = `https://github.com/${owner}/${repo}/releases/download/${nextRelease.version}/.dotfile`
  const releaseId = 1
  const uploadUri = `/api/uploads/repos/${owner}/${repo}/releases/${releaseId}/assets`
  const uploadUrl = `https://github.com${uploadUri}{?name,label}`
  const branch = 'test_branch'

  const github = authenticate(environment)
    .post(`/repos/${owner}/${repo}/releases`, {
      body: nextRelease.notes,
      draft: true,
      name: nextRelease.name,
      prerelease: false,
      tag_name: nextRelease.gitTag,
      target_commitish: branch
    })
    .reply(200, { html_url: untaggedReleaseUrl, id: releaseId, upload_url: uploadUrl })
    .patch(`/repos/${owner}/${repo}/releases/${releaseId}`, { draft: false })
    .reply(200, { html_url: releaseUrl, upload_url: uploadUrl })

  const githubUpload = upload(environment, {
    contentLength: (await stat(path.resolve(cwd, '.dotfile'))).size,
    uploadUrl: 'https://github.com'
  })
    .post(`${uploadUri}?name=${escape('.dotfile')}&label=${escape('A dotfile with no ext')}`)
    .reply(200, { browser_download_url: assetUrl })

  const result = await publish(pluginConfig, {
    branch: { main: true, name: branch, type: 'release' },
    cwd,
    env: environment,
    logger: t.context.logger,
    nextRelease,
    options
  })

  t.is(result.url, releaseUrl)
  t.true(t.context.log.calledWith('Published GitHub release: %s', releaseUrl))
  t.true(t.context.log.calledWith('Published file %s', assetUrl))
  t.true(github.isDone())
  t.true(githubUpload.isDone())
})

test.serial('Publish a release with one asset and custom github url', async (t) => {
  const owner = 'test_user'
  const repo = 'test_repo'
  const environment = { GH_PREFIX: 'prefix', GH_TOKEN: 'github_token', GH_URL: 'https://othertesturl.com:443' }
  const pluginConfig = {
    assets: [['*.txt', '!**/*_other.txt'], { label: 'A text file', path: ['*.txt', '!**/*_other.txt'] }, 'upload.txt']
  }
  const nextRelease = { gitTag: 'v1.0.0', name: 'v1.0.0', notes: 'Test release note body' }
  const options = { repositoryUrl: `https://github.com/${owner}/${repo}.git` }
  const untaggedReleaseUrl = `${environment.GH_URL}/${owner}/${repo}/releases/untagged-123`
  const releaseUrl = `${environment.GH_URL}/${owner}/${repo}/releases/${nextRelease.version}`
  const assetUrl = `${environment.GH_URL}/${owner}/${repo}/releases/download/${nextRelease.version}/upload.txt`
  const releaseId = 1
  const uploadUri = `/api/uploads/repos/${owner}/${repo}/releases/${releaseId}/assets`
  const uploadUrl = `${environment.GH_URL}${uploadUri}{?name,label}`
  const branch = 'test_branch'

  const github = authenticate(environment, {})
    .post(`/repos/${owner}/${repo}/releases`, {
      body: nextRelease.notes,
      draft: true,
      name: nextRelease.name,
      prerelease: false,
      tag_name: nextRelease.gitTag,
      target_commitish: branch
    })
    .reply(200, { html_url: untaggedReleaseUrl, id: releaseId, upload_url: uploadUrl })
    .patch(`/repos/${owner}/${repo}/releases/${releaseId}`, { draft: false })
    .reply(200, { html_url: releaseUrl, upload_url: uploadUrl })

  const githubUpload = upload(environment, {
    contentLength: (await stat(path.resolve(cwd, 'upload.txt'))).size,
    uploadUrl: environment.GH_URL
  })
    .post(`${uploadUri}?name=${escape('upload.txt')}&label=${escape('A text file')}`)
    .reply(200, { browser_download_url: assetUrl })

  const result = await publish(pluginConfig, {
    branch: { main: true, name: branch, type: 'release' },
    cwd,
    env: environment,
    logger: t.context.logger,
    nextRelease,
    options
  })

  t.is(result.url, releaseUrl)
  t.true(t.context.log.calledWith('Published GitHub release: %s', releaseUrl))
  t.true(t.context.log.calledWith('Published file %s', assetUrl))
  t.true(github.isDone())
  t.true(githubUpload.isDone())
})

test.serial('Publish a release with an array of missing assets', async (t) => {
  const owner = 'test_user'
  const repo = 'test_repo'
  const environment = { GITHUB_TOKEN: 'github_token' }
  const emptyDirectory = tempy.directory()
  const pluginConfig = { assets: [emptyDirectory, { name: 'missing.txt', path: 'missing.txt' }] }
  const nextRelease = { gitTag: 'v1.0.0', name: 'v1.0.0', notes: 'Test release note body' }
  const options = { repositoryUrl: `https://github.com/${owner}/${repo}.git` }
  const untaggedReleaseUrl = `https://github.com/${owner}/${repo}/releases/untagged-123`
  const releaseUrl = `https://github.com/${owner}/${repo}/releases/${nextRelease.version}`
  const releaseId = 1
  const uploadUri = `/api/uploads/repos/${owner}/${repo}/releases/${releaseId}/assets`
  const uploadUrl = `https://github.com${uploadUri}{?name,label}`
  const branch = 'test_branch'

  const github = authenticate(environment)
    .post(`/repos/${owner}/${repo}/releases`, {
      body: nextRelease.notes,
      draft: true,
      name: nextRelease.name,
      prerelease: false,
      tag_name: nextRelease.gitTag,
      target_commitish: branch
    })
    .reply(200, { html_url: untaggedReleaseUrl, id: releaseId, upload_url: uploadUrl })
    .patch(`/repos/${owner}/${repo}/releases/${releaseId}`, { draft: false })
    .reply(200, { html_url: releaseUrl })

  const result = await publish(pluginConfig, {
    branch: { main: true, name: branch, type: 'release' },
    cwd,
    env: environment,
    logger: t.context.logger,
    nextRelease,
    options
  })

  t.is(result.url, releaseUrl)
  t.true(t.context.log.calledWith('Published GitHub release: %s', releaseUrl))
  t.true(t.context.error.calledWith('The asset %s cannot be read, and will be ignored.', 'missing.txt'))
  t.true(t.context.error.calledWith('The asset %s is not a file, and will be ignored.', emptyDirectory))
  t.true(github.isDone())
})

test.serial('Throw error without retries for 400 error', async (t) => {
  const owner = 'test_user'
  const repo = 'test_repo'
  const environment = { GITHUB_TOKEN: 'github_token' }
  const pluginConfig = {}
  const nextRelease = { gitTag: 'v1.0.0', name: 'v1.0.0', notes: 'Test release note body' }
  const options = { repositoryUrl: `https://github.com/${owner}/${repo}.git` }
  const branch = 'test_branch'

  const github = authenticate(environment)
    .post(`/repos/${owner}/${repo}/releases`, {
      body: nextRelease.notes,
      name: nextRelease.name,
      prerelease: false,
      tag_name: nextRelease.gitTag,
      target_commitish: branch
    })
    .reply(404)
    .post(`/repos/${owner}/${repo}/releases`, {
      body: nextRelease.notes,
      name: nextRelease.gitTag,
      prerelease: false,
      tag_name: nextRelease.gitTag,
      target_commitish: branch
    })
    .reply(400)

  const error = await t.throwsAsync(
    publish(pluginConfig, {
      branch: { main: true, name: branch, type: 'release' },
      cwd,
      env: environment,
      logger: t.context.logger,
      nextRelease,
      options
    })
  )

  t.is(error.status, 400)
  t.true(github.isDone())
})

test.serial(
  'Publish a release when env.GITHUB_URL is set to https://github.com (Default in GitHub Actions, #268)',
  async (t) => {
    const owner = 'test_user'
    const repo = 'test_repo'
    const environment = {
      GITHUB_API_URL: 'https://api.github.com',
      GITHUB_TOKEN: 'github_token',
      GITHUB_URL: 'https://github.com'
    }
    const pluginConfig = {}
    const nextRelease = { gitTag: 'v1.0.0', name: 'v1.0.0', notes: 'Test release note body' }
    const options = { repositoryUrl: `https://github.com/${owner}/${repo}.git` }
    const releaseUrl = `https://github.com/${owner}/${repo}/releases/${nextRelease.version}`
    const releaseId = 1
    const uploadUri = `/api/uploads/repos/${owner}/${repo}/releases/${releaseId}/assets`
    const uploadUrl = `https://github.com${uploadUri}{?name,label}`
    const branch = 'test_branch'

    const github = authenticate(environment)
      .post(`/repos/${owner}/${repo}/releases`, {
        body: nextRelease.notes,
        name: nextRelease.name,
        prerelease: false,
        tag_name: nextRelease.gitTag,
        target_commitish: branch
      })
      .reply(200, { html_url: releaseUrl, upload_url: uploadUrl })

    const result = await publish(pluginConfig, {
      branch: { main: true, name: branch, type: 'release' },
      cwd,
      env: environment,
      logger: t.context.logger,
      nextRelease,
      options
    })

    t.is(result.url, releaseUrl)
    t.deepEqual(t.context.log.args[0], ['Published GitHub release: %s', releaseUrl])
    t.true(github.isDone())
  }
)
