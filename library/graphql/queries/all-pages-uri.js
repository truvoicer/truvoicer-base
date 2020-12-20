export const allPagesUriQuery = () => {
    return `
        query AllPagesUri {
          pages {
              nodes {
                slug
                uri
              }
          }
        }
  `;
}