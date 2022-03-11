export const GetSearchQueries = (base: any, commits: any, separator = '+') => {
  // eslint-disable-next-line unicorn/no-array-reduce
  return commits.reduce((searches: any, commit: any) => {
    const lastSearch = searches[searches.length - 1]
    const MAX_COMMIT_LENGTH = 256
    if (lastSearch && lastSearch.length + commit.length <= MAX_COMMIT_LENGTH - separator.length) {
      searches[searches.length - 1] = `${lastSearch}${separator}${commit}`
    } else {
      searches.push(`${base}${separator}${commit}`)
    }

    return searches
  }, [])
}
