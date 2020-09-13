export const menuQuery = () => {
    return `
            query Menu($slug: String!) {
              sidebar(slug: $slug) {
                sidebar_name
                widgets_json
                sidebar_error
              }
            }
  `;
}