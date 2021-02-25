export const allCategoriesQuery = () => {
    return `
        query AllCategoriesUri {
            categories(first: 1000) {
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