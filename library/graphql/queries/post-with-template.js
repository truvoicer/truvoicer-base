export const postWithTemplateQuery = () => {
    return `
        query PostWithTemplate($id: ID!, $idType: PostIdType!, $slug: String!) {
              postWithTemplate(where: {name: $slug}) {
                nodes {
                    status
                    databaseId
                    authorId
                    title(format: RENDERED)
                    slug
                    uri
                    content(format: RENDERED)
                    date
                    dateGmt
                    modified
                    modifiedGmt
                    categories(first: 1) {
                        nodes {
                          name
                          slug
                          databaseId
                        }
                    }
                }
              }
              post(id: $id, idType: $idType) {
                    databaseId
                    slug
                    date
                    title(format: RENDERED)
                    excerpt(format: RENDERED)
                    content(format: RENDERED)
                    commentCount
                    commentStatus
                    author {
                      node {
                        databaseId
                        nicename
                        nickname
                      }
                    }
                    categories {
                      nodes {
                        slug
                        name
                        databaseId
                      }
                    }
                    featuredImage {
                      node {
                        mediaItemUrl
                        altText
                      }
                    }
              }
                postNavigation(name: $slug) {
                    next_post {
                      slug
                      title(format: RENDERED)
                      link
                      featuredImage {
                        node {
                          mediaItemUrl
                        }
                      }
                      databaseId
                      date
                      modified
                    }
                    prev_post {
                      slug
                      title(format: RENDERED)
                      link
                      featuredImage {
                        node {
                          mediaItemUrl
                        }
                      }
                      databaseId
                      date
                      modified
                    }
                }              
                allSettings {
                  generalSettingsTitle
                  generalSettingsUrl
                  readingSettingsPostsPerPage
                  generalSettingsDescription
                  generalSettingsDateFormat
                  generalSettingsLanguage
                  generalSettingsStartOfWeek
                  generalSettingsTimeFormat
                  generalSettingsTimezone
                }
                truFetcherSettings {
                    settings_json
                }
        }
  `;
}