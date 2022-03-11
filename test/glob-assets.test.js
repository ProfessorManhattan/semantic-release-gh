const path = require('path')
const test = require('ava')
const { copy, ensureDir } = require('fs-extra')
const { isPlainObject, sortBy } = require('lodash')
const tempy = require('tempy')
const globAssets = require('../dist/glob-assets')

const sortAssets = (assets) => sortBy(assets, (asset) => (isPlainObject(asset) ? asset.path : asset))

const fixtures = 'test/fixtures/files'

test('Retrieve file from single path', async (t) => {
  const cwd = tempy.directory()
  await copy(fixtures, cwd)
  const globbedAssets = await globAssets({ cwd }, ['upload.txt'])

  t.deepEqual(globbedAssets, ['upload.txt'])
})

test('Retrieve multiple files from path', async (t) => {
  const cwd = tempy.directory()
  await copy(fixtures, cwd)
  const globbedAssets = await globAssets({ cwd }, ['upload.txt', 'upload_other.txt'])

  t.deepEqual(sortAssets(globbedAssets), sortAssets(['upload_other.txt', 'upload.txt']))
})

test('Include missing files as defined, using Object definition', async (t) => {
  const cwd = tempy.directory()
  await copy(fixtures, cwd)
  const globbedAssets = await globAssets({ cwd }, ['upload.txt', { label: 'Missing', path: 'miss*.txt' }])

  t.deepEqual(sortAssets(globbedAssets), sortAssets(['upload.txt', { label: 'Missing', path: 'miss*.txt' }]))
})

test('Retrieve multiple files from Object', async (t) => {
  const cwd = tempy.directory()
  await copy(fixtures, cwd)
  const globbedAssets = await globAssets({ cwd }, [
    { label: 'Upload label', name: 'upload_name', path: 'upload.txt' },
    'upload_other.txt'
  ])

  t.deepEqual(
    sortAssets(globbedAssets),
    sortAssets([{ label: 'Upload label', name: 'upload_name', path: 'upload.txt' }, 'upload_other.txt'])
  )
})

test('Retrieve multiple files without duplicates', async (t) => {
  const cwd = tempy.directory()
  await copy(fixtures, cwd)
  const globbedAssets = await globAssets({ cwd }, [
    'upload_other.txt',
    'upload.txt',
    'upload_other.txt',
    'upload.txt',
    'upload.txt',
    'upload_other.txt'
  ])

  t.deepEqual(sortAssets(globbedAssets), sortAssets(['upload_other.txt', 'upload.txt']))
})

test('Favor Object over String values when removing duplicates', async (t) => {
  const cwd = tempy.directory()
  await copy(fixtures, cwd)
  const globbedAssets = await globAssets({ cwd }, [
    'upload_other.txt',
    'upload.txt',
    { name: 'upload_name', path: 'upload.txt' },
    'upload.txt',
    { name: 'upload_other_name', path: 'upload_other.txt' },
    'upload.txt',
    'upload_other.txt'
  ])

  t.deepEqual(
    sortAssets(globbedAssets),
    sortAssets([
      { name: 'upload_name', path: 'upload.txt' },
      { name: 'upload_other_name', path: 'upload_other.txt' }
    ])
  )
})

test('Retrieve file from single glob', async (t) => {
  const cwd = tempy.directory()
  await copy(fixtures, cwd)
  const globbedAssets = await globAssets({ cwd }, ['upload.*'])

  t.deepEqual(globbedAssets, ['upload.txt'])
})

test('Retrieve multiple files from single glob', async (t) => {
  const cwd = tempy.directory()
  await copy(fixtures, cwd)
  const globbedAssets = await globAssets({ cwd }, ['*.txt'])

  t.deepEqual(sortAssets(globbedAssets), sortAssets(['upload_other.txt', 'upload.txt']))
})

test('Accept glob array with one value', async (t) => {
  const cwd = tempy.directory()
  await copy(fixtures, cwd)
  const globbedAssets = await globAssets({ cwd }, [['*load.txt'], ['*_other.txt']])

  t.deepEqual(sortAssets(globbedAssets), sortAssets(['upload_other.txt', 'upload.txt']))
})

test('Include globs that resolve to no files as defined', async (t) => {
  const cwd = tempy.directory()
  await copy(fixtures, cwd)
  const globbedAssets = await globAssets({ cwd }, [['upload.txt', '!upload.txt']])

  t.deepEqual(sortAssets(globbedAssets), sortAssets(['!upload.txt', 'upload.txt']))
})

test('Accept glob array with one value for missing files', async (t) => {
  const cwd = tempy.directory()
  await copy(fixtures, cwd)
  const globbedAssets = await globAssets({ cwd }, [['*missing.txt'], ['*_other.txt']])

  t.deepEqual(sortAssets(globbedAssets), sortAssets(['upload_other.txt', '*missing.txt']))
})

test('Replace name by filename for Object that match multiple files', async (t) => {
  const cwd = tempy.directory()
  await copy(fixtures, cwd)
  const globbedAssets = await globAssets({ cwd }, [{ label: 'Upload label', name: 'upload_name', path: '*.txt' }])

  t.deepEqual(
    sortAssets(globbedAssets),
    sortAssets([
      { label: 'Upload label', name: 'upload.txt', path: 'upload.txt' },
      { label: 'Upload label', name: 'upload_other.txt', path: 'upload_other.txt' }
    ])
  )
})

test('Include dotfiles', async (t) => {
  const cwd = tempy.directory()
  await copy(fixtures, cwd)
  const globbedAssets = await globAssets({ cwd }, ['.dot*'])

  t.deepEqual(globbedAssets, ['.dotfile'])
})

test('Ingnore single negated glob', async (t) => {
  const cwd = tempy.directory()
  await copy(fixtures, cwd)
  const globbedAssets = await globAssets({ cwd }, ['!*.txt'])

  t.deepEqual(globbedAssets, [])
})

test('Ingnore single negated glob in Object', async (t) => {
  const cwd = tempy.directory()
  await copy(fixtures, cwd)
  const globbedAssets = await globAssets({ cwd }, [{ path: '!*.txt' }])

  t.deepEqual(globbedAssets, [])
})

test('Accept negated globs', async (t) => {
  const cwd = tempy.directory()
  await copy(fixtures, cwd)
  const globbedAssets = await globAssets({ cwd }, [['*.txt', '!**/*_other.txt']])

  t.deepEqual(globbedAssets, ['upload.txt'])
})

test('Expand directories', async (t) => {
  const cwd = tempy.directory()
  await copy(fixtures, path.resolve(cwd, 'dir'))
  const globbedAssets = await globAssets({ cwd }, [['dir']])

  t.deepEqual(sortAssets(globbedAssets), sortAssets(['dir', 'dir/upload_other.txt', 'dir/upload.txt', 'dir/.dotfile']))
})

test('Include empty directory as defined', async (t) => {
  const cwd = tempy.directory()
  await copy(fixtures, cwd)
  await ensureDir(path.resolve(cwd, 'empty'))
  const globbedAssets = await globAssets({ cwd }, [['empty']])

  t.deepEqual(globbedAssets, ['empty'])
})

test('Deduplicate resulting files path', async (t) => {
  const cwd = tempy.directory()
  await copy(fixtures, cwd)
  const globbedAssets = await globAssets({ cwd }, ['./upload.txt', path.resolve(cwd, 'upload.txt'), 'upload.txt'])

  t.is(globbedAssets.length, 1)
})
