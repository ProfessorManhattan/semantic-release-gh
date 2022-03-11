/* eslint require-atomic-updates: off */

import { castArray, defaultTo } from 'lodash'
import { AddChannelGitHub } from './add-channel'
import { FailGitHub } from './fail'
import { PublishGitHub } from './publish'
import { SuccessGitHub } from './success'
import { VerifyGitHub } from './verify'

let verified = false

/**
 * @param pluginConfig - Plugin configuration
 * @param context - Semantic Release context
 */
async function verifyConditions(pluginConfig: any, context: any) {
  const { options } = context
  // If the GitHub publish plugin is used and has `assets`, `successComment`, `failComment`, `failTitle`, `labels` or `assignees` configured, validate it now in order to prevent any release if the configuration is wrong
  if (options.publish) {
    const publishPlugin =
      castArray(options.publish).find((config) => config.path && config.path === 'semantic-release-gh') || {}

    pluginConfig.assets = defaultTo(pluginConfig.assets, publishPlugin.assets)
    pluginConfig.successComment = defaultTo(pluginConfig.successComment, publishPlugin.successComment)
    pluginConfig.failComment = defaultTo(pluginConfig.failComment, publishPlugin.failComment)
    pluginConfig.failTitle = defaultTo(pluginConfig.failTitle, publishPlugin.failTitle)
    pluginConfig.labels = defaultTo(pluginConfig.labels, publishPlugin.labels)
    pluginConfig.assignees = defaultTo(pluginConfig.assignees, publishPlugin.assignees)
  }

  await VerifyGitHub(pluginConfig, context)
  verified = true
}

/**
 * @param pluginConfig - Plugin configuration
 * @param context - Semantic Release context
 */
async function publish(pluginConfig: any, context: any) {
  if (!verified) {
    await VerifyGitHub(pluginConfig, context)
    verified = true
  }

  return PublishGitHub(pluginConfig, context)
}

/**
 * @param pluginConfig - Plugin configuration
 * @param context - Semantic Release context
 */
async function addChannel(pluginConfig: any, context: any) {
  if (!verified) {
    await VerifyGitHub(pluginConfig, context)
    verified = true
  }

  return AddChannelGitHub(pluginConfig, context)
}

/**
 * @param pluginConfig - Plugin configuration
 * @param context - Semantic Release context
 */
async function success(pluginConfig: any, context: any) {
  if (!verified) {
    await VerifyGitHub(pluginConfig, context)
    verified = true
  }

  await SuccessGitHub(pluginConfig, context)
}

/**
 * @param pluginConfig - Plugin configuration
 * @param context - Semantic Release context
 */
async function fail(pluginConfig: any, context: any) {
  if (!verified) {
    await VerifyGitHub(pluginConfig, context)
    verified = true
  }

  await FailGitHub(pluginConfig, context)
}

// eslint-disable-next-line unicorn/prefer-module
module.exports = { addChannel, fail, publish, success, verifyConditions }
