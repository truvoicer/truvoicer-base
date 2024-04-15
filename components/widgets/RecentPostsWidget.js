import React, {useContext, useEffect, useState} from 'react';
import {buildWpApiUrl, publicApiRequest} from "../../library/api/wp/middleware";
import {wpApiConfig} from "../../config/wp-api-config";
import {formatDate, isNotEmpty, isObjectEmpty} from "../../library/utils";
import Link from "next/link";
import {getPostCategoryUrl, getPostItemUrl} from "../../library/helpers/posts";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";
import Image from "next/image";
import {wpResourceRequest} from "@/truvoicer-base/library/api/wordpress/middleware";
import {siteConfig} from "@/config/site-config";

const RecentPostsWidget = (props) => {
    const {data} = props;
    const [postData, setPostData] = useState([]);
    const templateManager = new TemplateManager(useContext(TemplateContext));

    async function recentPostsListRequest() {
        const response = await wpResourceRequest({
            endpoint: wpApiConfig.endpoints.postListRequest,
            method: 'GET',
            query: {
                pagination_type: 'page',
                per_page: 5,
                order_by: "date_modified",
                order: "desc"
            }
        });
        const responseData = await response.json();
        if (responseData?.status !== 'success') {
            console.warn(responseData?.message);
            return;
        }
        if (Array.isArray(responseData.postList)) {
            setPostData(responseData.postList);
        }
    }

    function getPostCategory(post) {
        if (!Array.isArray(post?.categories)) {
            return null;
        }
        return post.categories[0];
    }

    useEffect(() => {
        recentPostsListRequest();
    }, [data])

    const singlePost = (Array.isArray(postData) && postData.length)? postData[0] : {};
    const singlePostCategory = getPostCategory(singlePost);
    return (
        <>
            {!isObjectEmpty(singlePost) && (
            <div className="post-overaly-style clearfix">
                <div className="post-thumb">
                    <a href="#">
                        <img className="img-fluid" src={singlePost?.featured_image} alt=""/>
                    </a>
                </div>

                <div className="post-content">
                    {isNotEmpty(singlePostCategory) &&
                        <Link
                            className="post-cat"
                            href={getPostCategoryUrl({category_name: singlePostCategory?.slug})}>
                            {singlePostCategory?.name || ''}
                        </Link>
                    }
                    <h2 className="post-title title-small">

                        <Link
                            href={getPostItemUrl({
                                post_name: singlePost?.post_name,
                                category_name: singlePostCategory?.slug
                            })}
                        >
                            {isNotEmpty(singlePost?.post_title) ? singlePost.post_title : ""}
                        </Link>
                    </h2>
                    <div className="post-meta">
                        <span
                            className="post-date">{isNotEmpty(singlePost?.post_modified) ? formatDate(singlePost.post_modified) : ""}</span>
                    </div>
                </div>
            </div>
            )}
            {Array.isArray(postData) &&
                <div className="list-post-block">
                <ul className="list-post">
                    {postData.map((post, index) => {
                        const postCategory = getPostCategory(post);
                        return (
                            <li key={index} className="clearfix">
                                <div className="post-block-style post-float clearfix">
                                    <div className="post-thumb">
                                        <a href="#">
                                            <img className="img-fluid" src={post?.featured_image} alt=""/>
                                        </a>
                                        {isNotEmpty(postCategory) &&
                                            <Link
                                                className="post-cat"
                                                href={getPostCategoryUrl({category_name: postCategory?.slug})}>
                                                {postCategory?.name || ''}
                                            </Link>
                                        }
                                    </div>


                                    <div className="post-content">
                                        <h2 className="post-title title-small">
                                            <Link
                                                href={getPostItemUrl({
                                                    post_name: post?.post_name,
                                                    category_name: postCategory?.slug
                                                })}
                                            >
                                                {isNotEmpty(post?.post_title) ? post.post_title : ""}
                                            </Link>
                                        </h2>
                                        <div className="post-meta">
                                        <span
                                            className="post-date">{isNotEmpty(post?.post_modified) ? formatDate(post.post_modified) : ""}</span>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        )
                    })}
                </ul>
            </div>
            }
        </>
    );
};
RecentPostsWidget.category = 'widgets';
RecentPostsWidget.templateId = 'recentPostsWidget';
export default RecentPostsWidget;
