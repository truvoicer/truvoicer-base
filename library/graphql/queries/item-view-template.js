export const itemViewTemplateQuery = () => {
    return `
        query ItemViewTemplateQuery($id: ID!, $idType: ListingsCategoryIdType!) {
          listingsCategory(id: $id, idType: $idType) {
            slug
            name
            itemViewTemplates(first: 1) {
              nodes {
                status
                id
                title(format: RENDERED)
                slug
                uri
                content(format: RENDERED)
                blocksJSON
                date
                dateGmt
                modified
                modifiedGmt
                menuOrder
              }
            }
          }
        }
  `;
}