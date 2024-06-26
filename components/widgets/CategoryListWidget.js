import React, {useContext, useEffect, useState} from 'react';
import {buildWpApiUrl, publicApiRequest} from "../../library/api/wp/middleware";
import {wpApiConfig} from "../../config/wp-api-config";
import Link from "next/link";
import {getPostCategoryUrl} from "../../library/helpers/posts";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";

const CategoryListWidget = (props) => {
    const {data} = props;
    const [categoryData, setCategoryData] = useState([]);
    const templateManager = new TemplateManager(useContext(TemplateContext));

    async function categoryListRequest() {
        const response = await publicApiRequest(
            'GET',
            buildWpApiUrl(wpApiConfig.endpoints.categoryListRequest),
            {},
        );
        if (response.status === "success") {
            setCategoryData(response.data);
        }
    }

    useEffect(() => {
        categoryListRequest();
    }, [data])


        return (
            <aside className="single_sidebar_widget post_category_widget">
                <h4 className="widget_title">{data?.title || "Categories"}</h4>
                {Array.isArray(categoryData) &&
                    <ul className="list cat-list">
                        {categoryData.map((category, index) => (
                            <li key={index}>
                                <Link href={getPostCategoryUrl({category_name: category?.category_slug})}>
                                    <a className="d-flex">
                                        <p>{category.category_name}</p>
                                        {data?.count === 1 &&
                                            <p>{`(${category.total_posts})`}</p>
                                        }
                                    </a>
                                </Link>
                            </li>
                        ))}
                    </ul>
                }
            </aside>
        );
};
CategoryListWidget.category = 'widgets';
CategoryListWidget.templateId = 'categoryListWidget';
export default CategoryListWidget;
