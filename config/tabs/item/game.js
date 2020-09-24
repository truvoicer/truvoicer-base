export const GameTabConfig = {
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
                    label: "Summary:",
                    dataKey: "item_summary"
                },
            ]
        },
        // {
        //     label: "Platform/s",
        //     tabData: "item_platforms"
        // },
        {
            label: "Description",
            tabData: [
                {
                    label: "Description",
                    dataKey: "item_summary"
                }
            ]
        },
        // {
        //     label: "Stores",
        //     tabData: "stores"
        // },
        {
            label: "Genres & Tags",
            tabData: [
                {
                    label: "Genres",
                    dataKey: "item_genres"
                },
                {
                    type: "list",
                    config: {
                        keys: [
                            {
                                name: "name"
                            },
                            {
                                type: "link",
                                name: "url"
                            }
                        ]
                    },
                    label: "Tags",
                    dataKey: "item_tags"
                },
            ]
        },
        {
            label: "Images",
            tabData: [
                {
                    label: "",
                    type: "image",
                    dataKey: "item_default_image"
                }
            ]
        },
    ]
}