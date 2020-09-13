export const allPostsUriQuery = () => {
    return `
        query AllPostsUri {
          posts(first: 10000) {
              nodes {
                slug
                uri
              }
          }
        }
  `;
}