export const singleItemTemplateQuery = () => {
    return `
        query FetcherSingleItemQuery($id: ID!, $idType: FetcherSingleItemIdType!) {
          fetcherSingleItem(id: $id, idType: $idType) {
            databaseId
            date
            slug
            title(format: RENDERED)
            status
            single_item_data_keys
          }
        }
  `;
}