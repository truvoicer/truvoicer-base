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
                    dataKey: "genres"
                },
                {
                    label: "Tags",
                    dataKey: "Tags"
                },
            ]
        },
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
    ]
}