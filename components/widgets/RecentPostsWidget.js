import React, {useEffect, useState} from 'react';
import {buildWpApiUrl, publicApiRequest} from "../../library/api/wp/middleware";
import {wpApiConfig} from "../../config/wp-api-config";
import {formatDate, isNotEmpty} from "../../library/utils";
import Link from "next/link";
import {getPostItemUrl} from "../../library/helpers/posts";

const RecentPostsWidget = ({data}) => {
    const [postData, setPostData] = useState([]);

    useEffect(() => {
        publicApiRequest(
            buildWpApiUrl(wpApiConfig.endpoints.recentPostsListRequest),
            {
                number: data?.number || 5,
            },
            false
        )
            .then(response => {
                if (response?.data?.status === "success") {
                    setPostData(response.data.data);
                }
            })
            .catch(error => {
                console.error(error)
            })
    }, [data])

    return (
        <aside className="single_sidebar_widget popular_post_widget">
            <h3 className="widget_title">{data?.title || "Recent Posts"}</h3>
            {Array.isArray(postData) && postData.map((post, index) => (
                <div key={index} className="media post_item">
                    <img
                        src={post?.thumb}
                        alt="post"
                    />
                    <div className="media-body">
                        <Link
                            href={getPostItemUrl({
                                post_name: post?.slug,
                                category_name: post?.category
                            })}
                        >
                            <a>
                                <h3>{isNotEmpty(post?.name) ? post.name : ""}</h3>
                            </a>
                        </Link>
                        <p>{isNotEmpty(post?.date) ? formatDate(post.date) : ""}</p>

                    </div>
                </div>
            ))}
        </aside>
    );
};

export default RecentPostsWidget;