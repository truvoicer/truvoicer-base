export const EventsTabConfig = {
    config: {
        initialTab: 0
    },
    tabs: [
        {
            label: "General",
            tabData: [
                {
                    label: "Event Name:",
                    dataKey: "item_name"
                },
                {
                    type: "date",
                    label: "Event Start Date:",
                    dataKey: "item_start_date"
                },
                {
                    type: "date",
                    label: "Event End Date:",
                    dataKey: "item_stop_date"
                },
                {
                    type: "price",
                    label: "Price:",
                    dataKey: "item_price"
                },
            ]
        },
        {
            label: "More Information",
            tabData: [
                {
                    label: "Category",
                    dataKey: "item_category_name"
                },
                {
                    label: "Genre",
                    dataKey: "item_genre_name"
                },
                {
                    label: "Category",
                    dataKey: "item_category_name"
                },
                {
                    label: "Description",
                    dataKey: "item_info"
                },
            ]
        },
        {
            label: "Location",
            tabData: [
                {
                    label: "City",
                    dataKey: "item_city"
                },
                {
                    label: "City",
                    dataKey: [
                        "item_country",
                        "item_country_abbr",
                    ]
                },
                {
                    label: "Area Code",
                    dataKey: "item_post_code"
                },
            ]
        },
        {
            label: "Venues",
            tabData: [
                {
                    label: "Venue Name",
                    dataKey: "item_venue_name"
                },
                {
                    type: "link",
                    label: "Venue Url",
                    dataKey: "item_venue_url"
                },
                {
                    label: "Venue Address",
                    dataKey: "item_venue_address"
                },
            ]
        },
        {
            label: "Images",
            tabData: [
                {
                    label: "Images",
                    type: "image",
                    dataKey: "item_default_image"
                }
            ]
        },
    ]
}