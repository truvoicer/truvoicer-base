import React, {useEffect, useState} from 'react';
import {buildWpApiUrl, publicApiRequest} from "../../../library/api/wp/middleware";
import {wpApiConfig} from "../../../config/wp-api-config";

const PostsBlock = ({data}) => {
    const [posts, setPosts] = useState([]);

    const postListRequestCallback = (error, data) => {
        if (data?.status === "success" && Array.isArray(data?.data)) {
            setPosts(data.data)
        } else {
            console.log("Post list error")
        }
    }

    useEffect(() => {
        publicApiRequest(
            buildWpApiUrl(wpApiConfig.endpoints.postListRequest),
            {
                posts_per_page: data?.posts_per_page,
                show_all_categories: data?.show_all_categories,
                categories: data?.categories,
                page_number: 1
            },
            postListRequestCallback,
            "post"
        )
    }, [data])
    console.log(posts)
    return (
        <section className="blog_area section-padding">
            <div className="container">
                <div className="row align-items-center">
                    <div className="col-lg-6">
                        <div className="section_title">
                            <h3>{data?.heading}</h3>
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <div className="brouse_job text-right">
                            {/*<a*/}
                            {/*    href={isNotEmpty(headerButtonUrl) ? headerButtonUrl : defaultHeadingButtonUrl}*/}
                            {/*    className="boxed-btn4">*/}
                            {/*    {isNotEmpty(headerButtonLabel) ? headerButtonLabel : defaultHeadingButtonLabel}*/}
                            {/*</a>*/}
                        </div>
                    </div>
                </div>
                <div className={"row"}>
                    <div className="col-12 col-md-12 col-lg-12">
                        <div className="blog_left_sidebar">

                        </div>
                    </div>
                    {/*<div className="col-lg-4">*/}
                    {/*    <div className="blog_right_sidebar">*/}
                    {/*        <BlogSidebar/>*/}
                    {/*    </div>*/}
                    {/*</div>*/}
                </div>
            </div>
        </section>
    );
};

export default PostsBlock;
