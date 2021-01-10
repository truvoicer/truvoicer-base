export const allPostsQuery = () => {
    return `
        query AllPostsUri {
          posts {
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