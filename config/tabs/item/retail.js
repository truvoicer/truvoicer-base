export const RetailTabConfig = {
    config: {
        initialTab: 0
    },
    tabs: [
        {
            label: "Overview",
            tabData: [
                {
                    label: "Provider",
                    dataKey: "provider"
                },
                {
                    label: "Title",
                    dataKey: "item_title"
                },
                {
                    label: "Discounts:",
                    dataKey: [
                        "item_discount_percentage",
                        "item_discount_price"
                    ]
                },
                {
                    label: "Price:",
                    dataKey: [
                        "item_currency",
                        "item_price"
                    ]
                },
                {
                    label: "Refund Policy:",
                    dataKey: "item_refund_method"
                },
                {
                    label: "Returns Policy:",
                    dataKey: "item_return_method"
                },
                {
                    label: "Summary:",
                    dataKey: "item_summary"
                },
            ]
        },
        {
            label: "Details",
            tabData: [
                {
                    label: "Title",
                    dataKey: "item_title"
                },
                {
                    label: "Seller",
                    dataKey: "item_seller"
                },
                {
                    label: "Condition",
                    dataKey: "item_condition"
                },
                {
                    label: "Category",
                    dataKey: "item_category"
                },
            ]
        },
        {
            label: "Description",
            tabData: [
                {
                    label: "Description",
                    dataKey: "item_description"
                }
            ]
        },
        {
            label: "Location",
            tabData: [
                {
                    label: "Region",
                    dataKey: "item_region"
                },
                {
                    label: "City",
                    dataKey: "item_city"
                },
                {
                    label: "Area Code",
                    dataKey: "item_post_code"
                },
                {
                    label: "Country",
                    dataKey: "item_country"
                },
            ]
        },
        {
            label: "Images",
            tabData: [
                {
                    label: "",
                    image: true,
                    dataKey: "item_image_url"
                }
            ]
        },
    ]
}