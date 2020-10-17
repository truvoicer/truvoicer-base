export const singlePageQuery = () => {
    return `
            query SinglePage($id: ID!, $idType: PageIdType!) {
                page(id: $id, idType: $idType) {
                  isFrontPage
                  status
                  id
                  authorId
                  title(format: RENDERED)
                  slug
                  uri
                  content(format: RENDERED)
                  page_options {
                    fieldGroupName
                    footerScripts
                    footerScriptsOverride
                    headerScripts
                    headerScriptsOverride
                    pageType
                  }
                  date
                  dateGmt
                  modified
                  modifiedGmt
                  menuOrder
                }
                sidebars {
                  sidebars_json
                  sidebar_error
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