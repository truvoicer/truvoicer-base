export const allPagesUriQuery = () => {
    return `
        query AllPagesUri {
          pages(first: 10000) {
              nodes {
                slug
                uri
              }
          }
        }
  `;
}