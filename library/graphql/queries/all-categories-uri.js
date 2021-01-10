export const allCategoriesQuery = () => {
    return `
        query AllCategoriesUri {
            categories {
                nodes {
                  databaseId
                  slug
                  name
                  uri
                }
            }
        }
  `;
}