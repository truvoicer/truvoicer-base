export const fetcherApiConfig = {
    apiBaseUrl: process.env.NEXT_PUBLIC_FETCHER_API_URL,
    endpoints: {
        list: "category/%s/%s",
        operation: "operation/%s/",
    },
    queryKey: "query",
    searchLimitKey: "limit",
    defaultSearchLimit: 20,
    pageNumberKey: "page_number",
    pageOffsetKey: "page_offset",
    defaultOperation: "list",
    searchOperation: "list"
}