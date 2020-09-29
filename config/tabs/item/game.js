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
                    label: "Name",
                    dataKey: "item_name"
                },
                {
                    type: "date",
                    label: "Release Date",
                    dataKey: "item_release_date"
                },
                {
                    label: "Rating",
                    dataKey: "item_rating"
                },
                {
                    label: "Users Rated",
                    dataKey: "item_rating_count"
                },
            ]
        },
        {
            label: "Description",
            tabData: [
                {
                    label: "Description",
                    dataKey: "item_summary"
                }
            ]
        },
        {
            label: "Platform/s",
            tabData: [
                {
                    type: "list",
                    label: "Platforms",
                    dataKey: "item_platforms",
                    config: {
                        keys: [
                            {
                                name: "name"
                            },
                            // {
                            //     type: "link",
                            //     name: "url",
                            //     label: "name"
                            // }
                        ]
                    }
                },
            ]
        },
        {
            label: "Genres & Tags",
            tabData: [
                {
                    type: "list",
                    label: "Genres",
                    dataKey: "item_genres",
                    config: {
                        keys: [
                            {
                                name: "name"
                            },
                            // {
                            //     type: "link",
                            //     name: "url",
                            //     label: "name"
                            // }
                        ]
                    }
                },
                {
                    type: "list",
                    label: "Tags",
                    dataKey: "item_tags",
                    config: {
                        keys: [
                            {
                                name: "name"
                            },
                            // {
                            //     type: "link",
                            //     name: "url",
                            //     label: "name"
                            // }
                        ]
                    },
                }
            ]
        },
        {
            label: "Developers & Publishers",
            tabData: [
                {
                    type: "list",
                    label: "Developers",
                    dataKey: "item_developers",
                    config: {
                        keys: [
                            {
                                name: "name"
                            },
                            // {
                            //     type: "image",
                            //     name: "image_url"
                            // }
                        ]
                    }
                },
                {
                    type: "list",
                    label: "Publishers",
                    dataKey: "item_publishers",
                    config: {
                        keys: [
                            {
                                name: "name"
                            },
                            // {
                            //     type: "image",
                            //     name: "image_url"
                            // }
                        ]
                    },
                }
            ]
        },
        {
            label: "Screenshots",
            tabData: [
                {
                    label: "",
                    type: "list",
                    dataKey: "item_screenshots",
                    config: {
                        keys: [
                            {
                                type: "image",
                                name: "url"
                            }
                        ]
                    },
                }
            ]
        },
    ]
}