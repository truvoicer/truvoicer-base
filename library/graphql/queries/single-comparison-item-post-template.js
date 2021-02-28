export const comparisonItemTemplateQuery = () => {
    return `
        query FetcherComparisonItemQuery($id: ID!, $idType: FetcherSingleComparisonIdType!) {
          fetcherSingleComparison(id: $id, idType: $idType) {
            databaseId
            date
            slug
            title(format: RENDERED)
            status
            single_item_data_keys
          listingsCategories(first: 1) {
            nodes {
              slug
            }
          }
          }
        }
  `;
}