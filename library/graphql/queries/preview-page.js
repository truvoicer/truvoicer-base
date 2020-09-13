export const previewPageQuery = () => {
    return `
        query PreviewPage($id: ID!, $idType: PageIdType!) {
          post(id: $id, idType: $idType) {
            databaseId
            slug
            status
          }
        }
  `;
}