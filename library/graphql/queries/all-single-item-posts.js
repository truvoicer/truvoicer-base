export const allSingleItemPostsQuery = () => {
    return `
        query FetchAllSingleItemsQuery {
          fetcherSingleItems(first: 1000) {
              nodes {
                databaseId
              }
          }
        }
  `;
}