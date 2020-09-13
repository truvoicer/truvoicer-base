export const singlePageQuery = () => {
    return `
            query SinglePage($id: ID!, $idType: PageIdType!) {
                page(id: $id, idType: $idType) {
                  isFrontPage
                  status
                  id
                  authorId
                  title(format: RENDERED)
                  slug
                  uri
                  content(format: RENDERED)
                  blocksJSON
                  date
                  dateGmt
                  modified
                  modifiedGmt
                  menuOrder
                }
            }
  `;
}