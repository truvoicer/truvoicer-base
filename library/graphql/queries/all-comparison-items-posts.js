export const allComparisonItemsPostsQuery = () => {
    return `
        query FetchAllComparisonItemsQuery {
          fetcherSingleComparisons(first: 1000) {
              nodes {
                  slug
                  listingsCategories(first: 1) {
                    nodes {
                      slug
                    }
                  }
              }
          }
        }
  `;
}