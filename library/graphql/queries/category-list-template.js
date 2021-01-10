export const categoryTemplateQuery = () => {
    return `
        query CategoryTemplate($slug: String!) {
              categoryTemplateBySlug(slug: $slug) {
                category_template {
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