export const ParseGitHubURL = (repositoryUrl: string) => {
  // eslint-disable-next-line regexp/no-super-linear-backtracking
  const [match, auth, host, path] = /^(?!.+:\/\/)(?:(?<auth>.*)@)?(?<host>.*?):(?<path>.*)$/.exec(repositoryUrl) || []
  try {
    // eslint-disable-next-line regexp/no-super-linear-backtracking
    const [, owner, repo]: any = /^\/(?<owner>[^/]+)?\/?(?<repo>.+?)(?:\.git)?$/.exec(
      new URL(match ? `ssh://${auth ? `${auth}@` : ''}${host}/${path}` : repositoryUrl).pathname
    )

    return { owner, repo }
  } catch {
    return {}
  }
}
