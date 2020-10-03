export const siteSettingsQuery = () => {
    return `
      query AllSettings {
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