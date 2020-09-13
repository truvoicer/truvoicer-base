export const sidebarQuery = () => {
    return `
            query SinglePage($slug: String!) {
              sidebar(slug: $slug) {
                sidebar_name
                widgets_json
                sidebar_error
              }
            }
  `;
}