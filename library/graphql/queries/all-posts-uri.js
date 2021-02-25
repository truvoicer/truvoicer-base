export const allPostsQuery = () => {
    return `
        query AllPostsUri {
          posts(first: 1000) {
              nodes {
                slug
                uri
                post_options {
                  postTemplateCategory {
                    databaseId
                    slug
                    uri
                    name
                  }
                }
              }
          }
        }
  `;
}