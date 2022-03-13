<!-- ⚠️ This README has been generated from the file(s) ".config/docs/blueprint-readme-plugin.md" ⚠️--><div align="center">
  <center>
    <a href="https://github.com/ProfessorManhattan/semantic-release-gh">
      <img width="148" height="148" alt="Semantic Release GitHub logo" src="https://gitlab.com/megabyte-labs/npm/plugin/semantic-release-gh/-/raw/master/logo.png" />
    </a>
  </center>
</div>
<div align="center">
  <center><h1 align="center"><i></i>Semantic Release GitHub<i></i></h1></center>
  <center><h4 style="color: #18c3d1;">A plugin created by <a href="https://megabyte.space" target="_blank">Megabyte Labs</a></h4><i></i></center>
</div>

<div align="center">
  <a href="https://megabyte.space" title="Megabyte Labs homepage" target="_blank">
    <img alt="Homepage" src="https://img.shields.io/website?down_color=%23FF4136&down_message=Down&label=Homepage&logo=home-assistant&logoColor=white&up_color=%232ECC40&up_message=Up&url=https%3A%2F%2Fmegabyte.space&style=for-the-badge" />
  </a>
  <a href="https://github.com/ProfessorManhattan/semantic-release-gh/blob/master/docs/CONTRIBUTING.md" title="Learn about contributing" target="_blank">
    <img alt="Contributing" src="https://img.shields.io/badge/Contributing-Guide-0074D9?logo=github-sponsors&logoColor=white&style=for-the-badge" />
  </a>
  <a href="https://app.slack.com/client/T01ABCG4NK1/C01NN74H0LW/details/" title="Chat with us on Slack" target="_blank">
    <img alt="Slack" src="https://img.shields.io/badge/Slack-Chat-e01e5a?logo=slack&logoColor=white&style=for-the-badge" />
  </a>
  <a href="https://github.com/ProfessorManhattan/semantic-release-gh" title="GitHub mirror" target="_blank">
    <img alt="GitHub" src="https://img.shields.io/badge/Mirror-GitHub-333333?logo=github&style=for-the-badge" />
  </a>
  <a href="https://gitlab.com/megabyte-labs/npm/plugin/semantic-release-gh" title="GitLab repository" target="_blank">
    <img alt="GitLab" src="https://img.shields.io/badge/Repo-GitLab-fc6d26?logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgAQMAAABJtOi3AAAABlBMVEUAAAD///+l2Z/dAAAAAXRSTlMAQObYZgAAAHJJREFUCNdNxKENwzAQQNEfWU1ZPUF1cxR5lYxQqQMkLEsUdIxCM7PMkMgLGB6wopxkYvAeI0xdHkqXgCLL0Beiqy2CmUIdeYs+WioqVF9C6/RlZvblRNZD8etRuKe843KKkBPw2azX13r+rdvPctEaFi4NVzAN2FhJMQAAAABJRU5ErkJggg==&style=for-the-badge" />
  </a>
</div>
<br/>
<div align="center">
  <a href="https://www.npmjs.com/package/semantic-release-gh" title="Version 1.0.23" target="_blank">
    <img alt="Version: 1.0.23" src="https://img.shields.io/badge/version-1.0.23-blue.svg?cacheSeconds=2592000&logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgAQMAAABJtOi3AAAABlBMVEUAAAD///+l2Z/dAAAAAXRSTlMAQObYZgAAACNJREFUCNdjIACY//+BEp9hhM3hAzYQwoBIAqEDYQrCZLwAAGlFKxU1nF9cAAAAAElFTkSuQmCC&style=flat-square" />
  </a>
  <a href="https://gitlab.com/megabyte-labs/npm/plugin/semantic-release-gh/-/commits/master" title="GitLab CI build status" target="_blank">
    <img alt="Build status" src="https://img.shields.io/gitlab/pipeline-status/megabyte-labs/npm/plugin/semantic-release-gh?branch=master&label=build&logo=gitlab&logoColor=white&style=flat-square">
  </a>
  <a href="https://www.npmjs.com/package/semantic-release-gh" title="Dependency status reported by Depfu" target="_blank">
    <img alt="Dependency status reported by Depfu" src="https://img.shields.io/depfu/megabyte-labs/semantic-release-gh?logo=codeforces&logoColor=white&style=flat-square&logo=npm" />
  </a>
  <a href="https://www.npmjs.com/package/semantic-release-gh" title="Zip file size" target="_blank">
    <img alt="Zip file size" src="https://img.shields.io/bundlephobia/minzip/semantic-release-gh?style=flat-square&logo=npm&logoColor=white" />
  </a>
  <a href="https://www.npmjs.com/package/semantic-release-gh" title="Total downloads of semantic-release-gh on npmjs.org" target="_blank">
    <img alt="Total downloads of semantic-release-gh on npmjs.org" src="https://img.shields.io/npm/dt/semantic-release-gh?style=flat-square&logo=npm&logoColor=white" />
  </a>
  <a href="https://snyk.io/advisor/npm-package/semantic-release-gh" title="Number of vulnerabilities from Snyk scan on semantic-release-gh" target="_blank">
    <img alt="Number of vulnerabilities from Snyk scan on semantic-release-gh" src="https://img.shields.io/snyk/vulnerabilities/npm/semantic-release-gh?style=flat-square&logo=snyk&logoColor=white" />
  </a>
  <a href="website.documentation/npm" target="_blank">
    <img alt="Documentation" src="https://img.shields.io/badge/documentation-yes-brightgreen.svg?logo=readthedocs&logoColor=white&style=flat-square" />
  </a>
  <a href="https://github.com/ProfessorManhattan/semantic-release-gh/blob/master/LICENSE" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/badge/license-MIT-yellow.svg?logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgAQMAAABJtOi3AAAABlBMVEUAAAD///+l2Z/dAAAAAXRSTlMAQObYZgAAAHpJREFUCNdjYOD/wMDAUP+PgYHxhzwDA/MB5gMM7AwMDxj4GBgKGGQYGCyAEEgbMDDwAAWAwmk8958xpIOI5zKH2RmOyhxmZjguAiKmgIgtQOIYmFgCIp4AlaQ9OczGkJYCJEAGgI0CGwo2HmwR2Eqw5SBnNIAdBHYaAJb6KLM15W/CAAAAAElFTkSuQmCC&style=flat-square" />
  </a>
</div>

> </br><h4 align="center">**The official GitHub plugin, modified to accept repositoryUrl as a parameter**</h4></br>

<a href="#table-of-contents" style="width:100%"><img style="width:100%" src="https://gitlab.com/megabyte-labs/assets/-/raw/master/png/aqua-divider.png" /></a>

## Table of Contents

- [Overview](#overview)
- [Requirements](#requirements)
  - [Developer Requirements](#developer-requirements)
- [Summary](#summary)
- [Install](#install)
- [Usage](#usage)
- [Configuration](#configuration)
  - [GitHub authentication](#github-authentication)
  - [Environment variables](#environment-variables)
  - [Options](#options)
    - [`proxy`](#proxy)
    - [`proxy` Examples](#proxy-examples)
    - [`assets`](#assets)
    - [`assets` Examples](#assets-examples)
    - [`successComment`](#successcomment)
    - [`successComment` Example](#successcomment-example)
    - [`failComment`](#failcomment)
    - [`failComment` Example](#failcomment-example)
    - [`releasedLabels`](#releasedlabels)
    - [`releasedLabels` Example](#releasedlabels-example)
    - [`addReleases`](#addreleases)
    - [`addReleases` example](#addreleases-example)
- [Contributing](#contributing)
- [License](#license)

<a href="#overview" style="width:100%"><img style="width:100%" src="https://gitlab.com/megabyte-labs/assets/-/raw/master/png/aqua-divider.png" /></a>

## Overview

This [semantic-release](https://github.com/semantic-release/semantic-release) plugin is a fork of the official [@semantic-release/github](https://www.npmjs.com/package/@semantic-release/github) plugin. It allows you to specify the `repositoryUrl` (normally inferred from `package.json`) as a configuration parameter. This opens the door to being able to publish with multiple plugins that rely on different values for `repositoryUrl`. [semantic-release-config](https://github.com/ProfessorManhattan/semantic-release-config) uses this plugin to publish to GitLab Releases and GitHub Releases from within the same flow.

<a href="#requirements" style="width:100%"><img style="width:100%" src="https://gitlab.com/megabyte-labs/assets/-/raw/master/png/aqua-divider.png" /></a>

## Requirements

If you are simply including this library in your project, all you need is a recent version of Node.js. **[Node.js >14.18.0](repository.project.node)** is sometimes required and is the only version range we actively support. Albeit, it is highly probable that lower versions will work as well depending on the requirements that this project imports.

### Developer Requirements

The following versions of Node.js and Python are required for development:

- **[Node.js >14.18.0](repository.project.node)**
- **[Python >3.10.0](repository.project.python)**

Other versions may work, but only the above versions are supported. Most development dependencies are installed automatically by our `Taskfile.yml` set-up (even Node.js and Python). Run `bash start.sh` to install **[Bodega](https://github.com/ProfessorManhattan/Bodega)** (an improved fork of [go-task](https://github.com/go-task/task)) and run the initialization sequence. The taskfiles will automatically install dependencies as they are needed, based on what development tasks you are running. For more information, check out the [CONTRIBUTING.md](https://github.com/ProfessorManhattan/semantic-release-gh/blob/main/docs/CONTRIBUTING.md) or simply run:

```shell
npm run help
```

`npm run help` will ensure Bodega is installed and then open an interactive dialog where you can explore and learn about various developer commands.

<a href="#summary" style="width:100%"><img style="width:100%" src="https://gitlab.com/megabyte-labs/assets/-/raw/master/png/aqua-divider.png" /></a>

## Summary

**[semantic-release](https://github.com/semantic-release/semantic-release)** plugin to publish a
[GitHub release](https://help.github.com/articles/about-releases) and comment on released Pull Requests/Issues.

| Step               | Description                                                                                                                                                                                                                              |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `verifyConditions` | Verify the presence and the validity of the authentication (set via [environment variables](#environment-variables)) and the [assets](#assets) option configuration.                                                                     |
| `publish`          | Publish a [GitHub release](https://help.github.com/articles/about-releases), optionally uploading file assets.                                                                                                                           |
| `addChannel`       | Update a [GitHub release](https://help.github.com/articles/about-releases)'s `pre-release` field.                                                                                                                                        |
| `success`          | Add a comment to each [GitHub Issue](https://help.github.com/articles/about-issues) or [Pull Request](https://help.github.com/articles/about-pull-requests) resolved by the release and close issues previously open by the `fail` step. |
| `fail`             | Open or update a [GitHub Issue](https://help.github.com/articles/about-issues) with information about the errors that caused the release to fail.                                                                                        |

<a href="#install" style="width:100%"><img style="width:100%" src="https://gitlab.com/megabyte-labs/assets/-/raw/master/png/aqua-divider.png" /></a>

## Install

```bash
$ npm install --save-dev semantic-release-gh
```

<a href="#usage" style="width:100%"><img style="width:100%" src="https://gitlab.com/megabyte-labs/assets/-/raw/master/png/aqua-divider.png" /></a>

## Usage

The plugin can be configured in the [**semantic-release** configuration file](https://github.com/semantic-release/semantic-release/blob/master/docs/usage/configuration.md#configuration):

```json
{
  "plugins": [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    [
      "semantic-release-github",
      {
        "repositoryUrl": "https://github.com/professormanhattan/semantic-release-github",
        "assets": [
          { "path": "dist/asset.min.css", "label": "CSS distribution" },
          { "path": "dist/asset.min.js", "label": "JS distribution" }
        ]
      }
    ]
  ]
}
```

With this example [GitHub releases](https://help.github.com/articles/about-releases) will be published with the file `dist/asset.min.css` and `dist/asset.min.js`.

<a href="#configuration" style="width:100%"><img style="width:100%" src="https://gitlab.com/megabyte-labs/assets/-/raw/master/png/aqua-divider.png" /></a>

## Configuration

### GitHub authentication

The GitHub authentication configuration is **required** and can be set via [environment variables](#environment-variables).

Follow the [Creating a personal access token for the command line](https://help.github.com/articles/creating-a-personal-access-token-for-the-command-line) documentation to obtain an authentication token. The token has to be made available in your CI environment via the `GH_TOKEN` environment variable. The user associated with the token must have push permission to the repository.

When creating the token, the **minimum required scopes** are:

- [`repo`](https://github.com/settings/tokens/new?scopes=repo) for a private repository
- [`public_repo`](https://github.com/settings/tokens/new?scopes=public_repo) for a public repository

_Notes on GitHub Actions:_ You can use the default token which is provided in the secret _GITHUB_TOKEN_. However releases done with this token will NOT trigger release events to start other workflows.
If you have actions that trigger on newly created releases, please use a generated token for that and store it in your repository's secrets (any other name than GITHUB_TOKEN is fine).

When using the _GITHUB_TOKEN_, the **minimum required permissions** are:

- `contents: write` to be able to publish a GitHub release
- `issues: write` to be able to comment on released issues
- `pull-requests: write` to be able to comment on released pull requests

### Environment variables

| Variable                                     | Description                                               |
| -------------------------------------------- | --------------------------------------------------------- |
| `GH_TOKEN` or `GITHUB_TOKEN`                 | **Required.** The token used to authenticate with GitHub. |
| `GITHUB_API_URL` or `GH_URL` or `GITHUB_URL` | The GitHub Enterprise endpoint.                           |
| `GH_PREFIX` or `GITHUB_PREFIX`               | The GitHub Enterprise API prefix.                         |

### Options

| Option                | Description                                                                                                                                                                                            | Default                                                                                                                                              |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `githubUrl`           | The GitHub Enterprise endpoint.                                                                                                                                                                        | `GH_URL` or `GITHUB_URL` environment variable.                                                                                                       |
| `githubApiPathPrefix` | The GitHub Enterprise API prefix.                                                                                                                                                                      | `GH_PREFIX` or `GITHUB_PREFIX` environment variable.                                                                                                 |
| `proxy`               | The proxy to use to access the GitHub API. Set to `false` to disable usage of proxy. See [proxy](#proxy).                                                                                              | `HTTP_PROXY` environment variable.                                                                                                                   |
| `assets`              | An array of files to upload to the release. See [assets](#assets).                                                                                                                                     | -                                                                                                                                                    |
| `successComment`      | The comment to add to each issue and pull request resolved by the release. Set to `false` to disable commenting on issues and pull requests. See [successComment](#successcomment).                    | `:tada: This issue has been resolved in version ${nextRelease.version} :tada:\n\nThe release is available on [GitHub release](<github_release_url>)` |
| `failComment`         | The content of the issue created when a release fails. Set to `false` to disable opening an issue when a release fails. See [failComment](#failcomment).                                               | Friendly message with links to **semantic-release** documentation and support, with the list of errors that caused the release to fail.              |
| `failTitle`           | The title of the issue created when a release fails. Set to `false` to disable opening an issue when a release fails.                                                                                  | `The automated release is failing 🚨`                                                                                                                |
| `labels`              | The [labels](https://help.github.com/articles/about-labels) to add to the issue created when a release fails. Set to `false` to not add any label.                                                     | `['semantic-release']`                                                                                                                               |
| `assignees`           | The [assignees](https://help.github.com/articles/assigning-issues-and-pull-requests-to-other-github-users) to add to the issue created when a release fails.                                           | -                                                                                                                                                    |
| `releasedLabels`      | The [labels](https://help.github.com/articles/about-labels) to add to each issue and pull request resolved by the release. Set to `false` to not add any label. See [releasedLabels](#releasedlabels). | `['released<%= nextRelease.channel ? \` on @\${nextRelease.channel}\` : "" %>']-                                                                     |
| `addReleases`         | Will add release links to the GitHub Release. Can be `false`, `"bottom"` or `"top"`. See [addReleases](#addReleases).                                                                                  | `false`                                                                                                                                              |

#### `proxy`

Can be `false`, a proxy URL or an `Object` with the following properties:

| Property      | Description                                                    | Default                              |
| ------------- | -------------------------------------------------------------- | ------------------------------------ |
| `host`        | **Required.** Proxy host to connect to.                        | -                                    |
| `port`        | **Required.** Proxy port to connect to.                        | File name extracted from the `path`. |
| `secureProxy` | If `true`, then use TLS to connect to the proxy.               | `false`                              |
| `headers`     | Additional HTTP headers to be sent on the HTTP CONNECT method. | -                                    |

See [node-https-proxy-agent](https://github.com/TooTallNate/node-https-proxy-agent#new-httpsproxyagentobject-options) and [node-http-proxy-agent](https://github.com/TooTallNate/node-http-proxy-agent) for additional details.

#### `proxy` Examples

`'http://168.63.76.32:3128'`: use the proxy running on host `168.63.76.32` and port `3128` for each GitHub API request.
`{host: '168.63.76.32', port: 3128, headers: {Foo: 'bar'}}`: use the proxy running on host `168.63.76.32` and port `3128` for each GitHub API request, setting the `Foo` header value to `bar`.

#### `assets`

Can be a [glob](https://github.com/isaacs/node-glob#glob-primer) or and `Array` of
[globs](https://github.com/isaacs/node-glob#glob-primer) and `Object`s with the following properties:

| Property | Description                                                                                              | Default                              |
| -------- | -------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| `path`   | **Required.** A [glob](https://github.com/isaacs/node-glob#glob-primer) to identify the files to upload. | -                                    |
| `name`   | The name of the downloadable file on the GitHub release.                                                 | File name extracted from the `path`. |
| `label`  | Short description of the file displayed on the GitHub release.                                           | -                                    |

Each entry in the `assets` `Array` is globbed individually. A [glob](https://github.com/isaacs/node-glob#glob-primer)
can be a `String` (`"dist/**/*.js"` or `"dist/mylib.js"`) or an `Array` of `String`s that will be globbed together
(`["dist/**", "!**/*.css"]`).

If a directory is configured, all the files under this directory and its children will be included.

The `name` and `label` for each assets are generated with [Lodash template](https://lodash.com/docs#template). The following variables are available:

| Parameter     | Description                                                                         |
| ------------- | ----------------------------------------------------------------------------------- |
| `branch`      | The branch from which the release is done.                                          |
| `lastRelease` | `Object` with `version`, `gitTag` and `gitHead` of the last release.                |
| `nextRelease` | `Object` with `version`, `gitTag`, `gitHead` and `notes` of the release being done. |
| `commits`     | `Array` of commit `Object`s with `hash`, `subject`, `body` `message` and `author`.  |

**Note**: If a file has a match in `assets` it will be included even if it also has a match in `.gitignore`.

#### `assets` Examples

`'dist/*.js'`: include all the `js` files in the `dist` directory, but not in its sub-directories.

`[['dist', '!**/*.css']]`: include all the files in the `dist` directory and its sub-directories excluding the `css`
files.

`[{path: 'dist/MyLibrary.js', label: 'MyLibrary JS distribution'}, {path: 'dist/MyLibrary.css', label: 'MyLibrary CSS distribution'}]`: include the `dist/MyLibrary.js` and `dist/MyLibrary.css` files, and label them `MyLibrary JS distribution` and `MyLibrary CSS distribution` in the GitHub release.

`[['dist/**/*.{js,css}', '!**/*.min.*'], {path: 'build/MyLibrary.zip', label: 'MyLibrary'}]`: include all the `js` and
`css` files in the `dist` directory and its sub-directories excluding the minified version, plus the
`build/MyLibrary.zip` file and label it `MyLibrary` in the GitHub release.

`[{path: 'dist/MyLibrary.js', name: 'MyLibrary-${nextRelease.gitTag}.js', label: 'MyLibrary JS (${nextRelease.gitTag}) distribution'}]`: include the file `dist/MyLibrary.js` and upload it to the GitHub release with name `MyLibrary-v1.0.0.js` and label `MyLibrary JS (v1.0.0) distribution` which will generate the link:

> `[MyLibrary JS (v1.0.0) distribution](MyLibrary-v1.0.0.js)`

#### `successComment`

The message for the issue comments is generated with [Lodash template](https://lodash.com/docs#template). The following variables are available:

| Parameter     | Description                                                                                                                                                                                                                                                                   |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `branch`      | `Object` with `name`, `type`, `channel`, `range` and `prerelease` properties of the branch from which the release is done.                                                                                                                                                    |
| `lastRelease` | `Object` with `version`, `channel`, `gitTag` and `gitHead` of the last release.                                                                                                                                                                                               |
| `nextRelease` | `Object` with `version`, `channel`, `gitTag`, `gitHead` and `notes` of the release being done.                                                                                                                                                                                |
| `commits`     | `Array` of commit `Object`s with `hash`, `subject`, `body` `message` and `author`.                                                                                                                                                                                            |
| `releases`    | `Array` with a release `Object`s for each release published, with optional release data such as `name` and `url`.                                                                                                                                                             |
| `issue`       | A [GitHub API pull request object](https://developer.github.com/v3/search/#search-issues) for pull requests related to a commit, or an `Object` with the `number` property for issues resolved via [keywords](https://help.github.com/articles/closing-issues-using-keywords) |

#### `successComment` Example

The `successComment` `This ${issue.pull_request ? 'pull request' : 'issue'} is included in version ${nextRelease.version}` will generate the comment:

> This pull request is included in version 1.0.0

#### `failComment`

The message for the issue content is generated with [Lodash template](https://lodash.com/docs#template). The following variables are available:

| Parameter | Description                                                                                                                                                                                                                                                                                                            |
| --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `branch`  | The branch from which the release had failed.                                                                                                                                                                                                                                                                          |
| `errors`  | An `Array` of [SemanticReleaseError](https://github.com/semantic-release/error). Each error has the `message`, `code`, `pluginName` and `details` properties.<br>`pluginName` contains the package name of the plugin that threw the error.<br>`details` contains a information about the error formatted in markdown. |

#### `failComment` Example

The `failComment` `This release from branch ${branch.name} had failed due to the following errors:\n- ${errors.map(err => err.message).join('\\n- ')}` will generate the comment:

> This release from branch master had failed due to the following errors:
>
> - Error message 1
> - Error message 2

#### `releasedLabels`

Each label name is generated with [Lodash template](https://lodash.com/docs#template). The following variables are available:

| Parameter     | Description                                                                                                                                                                                                                                                                   |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `branch`      | `Object` with `name`, `type`, `channel`, `range` and `prerelease` properties of the branch from which the release is done.                                                                                                                                                    |
| `lastRelease` | `Object` with `version`, `channel`, `gitTag` and `gitHead` of the last release.                                                                                                                                                                                               |
| `nextRelease` | `Object` with `version`, `channel`, `gitTag`, `gitHead` and `notes` of the release being done.                                                                                                                                                                                |
| `commits`     | `Array` of commit `Object`s with `hash`, `subject`, `body` `message` and `author`.                                                                                                                                                                                            |
| `releases`    | `Array` with a release `Object`s for each release published, with optional release data such as `name` and `url`.                                                                                                                                                             |
| `issue`       | A [GitHub API pull request object](https://developer.github.com/v3/search/#search-issues) for pull requests related to a commit, or an `Object` with the `number` property for issues resolved via [keywords](https://help.github.com/articles/closing-issues-using-keywords) |

#### `releasedLabels` Example

The `releasedLabels` `` ['released<%= nextRelease.channel ? ` on @\${nextRelease.channel}` : "" %> from <%= branch.name %>'] `` will generate the label:

> released on @next from branch next

#### `addReleases`

Add links to other releases to the GitHub release body.

Valid values for this option are `false`, `"top"` or `"bottom"`.

#### `addReleases` example

See [The introducing PR](https://github.com/semantic-release/github/pull/282) for an example on how it will look.

<a href="#contributing" style="width:100%"><img style="width:100%" src="https://gitlab.com/megabyte-labs/assets/-/raw/master/png/aqua-divider.png" /></a>

## Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/ProfessorManhattan/semantic-release-gh/issues). If you would like to contribute, please take a look at the [contributing guide](https://github.com/ProfessorManhattan/semantic-release-gh/blob/master/docs/CONTRIBUTING.md).

<details>
<summary><b>Sponsorship</b></summary>
<br/>
<blockquote>
<br/>
Dear Awesome Person,<br/><br/>
I create open source projects out of love. Although I have a job, shelter, and as much fast food as I can handle, it would still be pretty cool to be appreciated by the community for something I have spent a lot of time and money on. Please consider sponsoring me! Who knows? Maybe I will be able to quit my job and publish open source full time.
<br/><br/>Sincerely,<br/><br/>

**_Brian Zalewski_**<br/><br/>

</blockquote>

<a title="Support us on Open Collective" href="https://opencollective.com/megabytelabs" target="_blank">
  <img alt="Open Collective sponsors" src="https://img.shields.io/opencollective/sponsors/megabytelabs?logo=opencollective&label=OpenCollective&logoColor=white&style=for-the-badge" />
</a>
<a title="Support us on GitHub" href="https://github.com/ProfessorManhattan" target="_blank">
  <img alt="GitHub sponsors" src="https://img.shields.io/github/sponsors/ProfessorManhattan?label=GitHub%20sponsors&logo=github&style=for-the-badge" />
</a>
<a href="https://www.patreon.com/ProfessorManhattan" title="Support us on Patreon" target="_blank">
  <img alt="Patreon" src="https://img.shields.io/badge/Patreon-Support-052d49?logo=patreon&logoColor=white&style=for-the-badge" />
</a>

</details>

<a href="#license" style="width:100%"><img style="width:100%" src="https://gitlab.com/megabyte-labs/assets/-/raw/master/png/aqua-divider.png" /></a>

## License

Copyright © 2020-2021 [Megabyte LLC](https://megabyte.space). This project is [MIT](https://gitlab.com/megabyte-labs/npm/plugin/semantic-release-gh/-/blob/master/LICENSE) licensed.
