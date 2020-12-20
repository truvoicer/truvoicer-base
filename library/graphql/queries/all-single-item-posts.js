export const allSingleItemPostsQuery = () => {
    return `
        query FetchAllSingleItemsQuery {
          fetcherSingleItems {
              nodes {
                databaseId
              }
          }
        }
  `;
}