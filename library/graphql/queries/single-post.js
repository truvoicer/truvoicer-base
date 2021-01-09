export const singlePostQuery = () => {
    return `
        query SinglePost($id: ID!, $idType: PostIdType!) {
              post(id: $id, idType: $idType) {
                    databaseId
                    slug
                    date
                    title(format: RENDERED)
                    excerpt(format: RENDERED)
                    content(format: RENDERED)
                    commentCount
                    commentStatus
                    author {
                      node {
                        databaseId
                        nicename
                        nickname
                      }
                    }
                    categories {
                      nodes {
                        slug
                        name
                        databaseId
                      }
                    }
                    featuredImage {
                      node {
                        mediaItemUrl
                        altText
                      }
                    }
              }
        }
  `;
}