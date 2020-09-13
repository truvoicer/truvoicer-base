export const previewPostQuery = () => {
    return `
        query PreviewPost($id: ID!, $idType: PostIdType!) {
          post(id: $id, idType: $idType) {
            databaseId
            slug
            status
          }
        }
  `;
}