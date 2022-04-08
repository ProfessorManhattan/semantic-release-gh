export const ParseGitHubURL = (repositoryUrl: string) => {
  // eslint-disable-next-line regexp/no-super-linear-backtracking, security/detect-unsafe-regex
  const [match, auth, host, path] = /^(?!.+:\/\/)(?:(?<auth>.*)@)?(?<host>.*?):(?<path>.*)$/u.exec(repositoryUrl) || []
  try {
    // eslint-disable-next-line regexp/no-super-linear-backtracking, security/detect-unsafe-regex
    const [, owner, repo]: any = /^\/(?<owner>[^/]+)?\/?(?<repo>.+?)(?:\.git)?$/u.exec(
      new URL(match ? `ssh://${auth ? `${auth}@` : ''}${host}/${path}` : repositoryUrl).pathname
    )

    return { owner, repo }
  } catch {
    return {}
  }
}
