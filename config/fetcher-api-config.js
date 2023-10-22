export const fetcherApiConfig = {
    apiBaseUrl: process.env.NEXT_PUBLIC_FETCHER_API_URL,
    endpoints: {
        list: "/category/%s/%s",
        operation: "/operation/%s/",
    },
    queryKey: "query",
    searchLimitKey: "post_per_page",
    defaultSearchLimit: 20,
    pageNumberKey: "page_number",
    pageOffsetKey: "page_offset",
    defaultOperation: "list",
    searchOperation: "list"
}
