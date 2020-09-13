export const RealEstateTabConfig = {
    config: {
        initialTab: 0
    },
    tabs: [
        {
            label: "Images",
            tabData: [
                {
                    label: "",
                    image: true,
                    dataKey: "item_default_image"
                }
            ]
        },
        {
            label: "Overview",
            tabData: [
                {
                    label: "Status:",
                    dataKey: "item_status"
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
                    label: "Property Type:",
                    dataKey: "item_property_type"
                },
                {
                    label: "Bedrooms:",
                    dataKey: "item_bedrooms"
                },
                {
                    label: "Bathrooms:",
                    dataKey: "item_bathrooms"
                },
                {
                    label: "Receptions:",
                    dataKey: "item_receptions"
                },
                {
                    label: "Floors:",
                    dataKey: "item_floors"
                },
                {
                    label: "Description:",
                    dataKey: "item_description"
                },
            ]
        },
        {
            label: "Location",
            tabData: [
                {
                    label: "location:",
                    dataKey: [
                        "item_city",
                        "item_country",
                        "item_post_code",
                    ]
                },
            ]
        },
        {
            label: "Price",
            tabData: [
                {
                    label: "Total Price:",
                    dataKey: "item_price_total"
                },
            ]
        },
        {
            label: "Agent",
            tabData: [
                {
                    label: "Agent Name:",
                    dataKey: "item_agent_name"
                },
                {
                    label: "Agent Logo:",
                    image: true,
                    dataKey: "item_agent_logo"
                },
                {
                    label: "Agent Contact:",
                    dataKey: "item_agent_contact"
                },
            ]
        },
    ]
}