import React, {useEffect, useState} from 'react';
import {buildWpApiUrl, publicApiRequest} from "../../library/api/wp/middleware";
import {wpApiConfig} from "../../config/wp-api-config";
import Link from "next/link";
import {getPostCategoryUrl} from "../../library/helpers/posts";

const CategoryListWidget = ({data}) => {
    const [categoryData, setCategoryData] = useState([]);

    useEffect(() => {
        publicApiRequest(
            buildWpApiUrl(wpApiConfig.endpoints.categoryListRequest),
            {},
            false
        )
            .then(response => {
                if (response?.data.status === "success") {
                    setCategoryData(response.data.data);
                }
            })
            .catch(error => {
                console.error(error)
            })
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

export default CategoryListWidget;
