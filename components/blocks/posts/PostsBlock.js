import React, {useEffect, useMemo, useState} from 'react';
import JobNewsItemListPost
    from "../../../../views/Components/Blocks/Listings/ListingsItems/Items/JobNews/JobNewsItemListPost";
import {setPostListDataAction} from "../../../redux/actions/page-actions";
import {useRouter} from "next/router";
import {buildWpApiUrl, publicApiRequest} from "../../../library/api/wp/middleware";
import {wpApiConfig} from "../../../config/wp-api-config";
import {isNotEmpty} from "../../../library/utils";

const PostsBlock = ({data}) => {
    function useQueryParams() {
        const router = useRouter();
        return useMemo(() => {
            let pathStr;
            const delimiterIndex = router.asPath.indexOf('?');
            if (delimiterIndex >= 0) {
                pathStr = router.asPath.substring(delimiterIndex);
            }
            return new URLSearchParams(pathStr);
        }, [router.asPath]);
    }

    const queryParams = useQueryParams();
    const p = queryParams.get('p');
    const [posts, setPosts] = useState([]);
    const [paginationControls, setPaginationControls] = useState(null);

    const postListRequestCallback = (error, data) => {
        if (data?.status === "success" && Array.isArray(data?.data?.posts)) {
            setPosts(data.data.posts);
            setPostListDataAction(data.data.posts);
            setPaginationControls(data.data.controls)
        } else {
            console.log("Post list error")
        }
    }
    const fetchPosts = (pageNumber = null) => {
        publicApiRequest(
            buildWpApiUrl(wpApiConfig.endpoints.postListRequest),
            {
                posts_per_page: data?.posts_per_page,
                show_all_categories: data?.show_all_categories,
                categories: data?.categories,
                page_number: isNotEmpty(pageNumber) ? parseInt(pageNumber) : 1
            },
            postListRequestCallback,
            "post"
        )
    }
    useEffect(() => {
        fetchPosts(p)
    }, [data, p])
    
    return (
        <section className="blog_area section-padding">
            <div className="container">
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
                                    {isNotEmpty(paginationControls?.total_pages)
                                    && Array.from(Array(paginationControls.total_pages)).map((page, index) => (
                                        <li key={index} className={`page-item ${paginationControls.current_page === (index + 1)? "active" : ""}`}>
                                            <a
                                                className="page-link"
                                                onClick={() => {
                                                    fetchPosts(index + 1)
                                                }}
                                            >
                                                {index + 1}
                                            </a>
                                        </li>
                                    ))}
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
