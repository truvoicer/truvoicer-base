export const allPagesUriQuery = () => {
    return `
        query AllPagesUri {
          pages(first: 1000) {
              nodes {
                slug
                uri
              }
          }
        }
  `;
}