import React from 'react';
import {getPostCategoryUrl} from "../../library/helpers/posts";
import Link from "next/link";

const BlogCategoryList = ({categories = [], classes = ""}) => {
    return (
        <ul className={classes}>
            {Array.isArray(categories) &&
            <li>
                {categories.map((category, index) => (
                    <React.Fragment key={index}>
                        <Link href={getPostCategoryUrl({category_name: category?.slug})}>
                                {/*<i className="fa fa-user"/>*/}
                                {category?.name}
                        </Link>
                    </React.Fragment>
                ))}
            </li>
            }
        </ul>
    );
}
;

export default BlogCategoryList;
