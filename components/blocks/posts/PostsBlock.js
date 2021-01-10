import React, {useEffect, useState} from 'react';
import {buildWpApiUrl, publicApiRequest} from "../../../library/api/wp/middleware";
import {wpApiConfig} from "../../../config/wp-api-config";
import JobNewsItemListPost
    from "../../../../views/Components/Blocks/Listings/ListingsItems/Items/JobNews/JobNewsItemListPost";
import {setPostListDataAction} from "../../../redux/actions/page-actions";

const PostsBlock = ({data}) => {
    const [posts, setPosts] = useState([]);

    const postListRequestCallback = (error, data) => {
        if (data?.status === "success" && Array.isArray(data?.data?.posts))
        {
            setPosts(data.data.posts);
            setPostListDataAction(data.data.posts);
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
                            {posts.map((post, index) => {
                                return (
                                    <JobNewsItemListPost
                                        key={index}
                                        postIndex={index}
                                        data={post}
                                    />
                                )
                            })}
                            <nav className="blog-pagination justify-content-center d-flex">
                                <ul className="pagination">
                                    <li className="page-item">
                                        <a href="#" className="page-link" aria-label="Previous">
                                            <i className="ti-angle-left"/>
                                        </a>
                                    </li>
                                    <li className="page-item">
                                        <a href="#" className="page-link">1</a>
                                    </li>
                                    <li className="page-item active">
                                        <a href="#" className="page-link">2</a>
                                    </li>
                                    <li className="page-item">
                                        <a href="#" className="page-link" aria-label="Next">
                                            <i className="ti-angle-right"/>
                                        </a>
                                    </li>
                                </ul>
                            </nav>
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
