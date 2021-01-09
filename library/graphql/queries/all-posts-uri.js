export const allPostsQuery = () => {
    return `
        query AllPostsUri {
          posts {
              nodes {
                slug
                uri
              }
          }
        }
  `;
}