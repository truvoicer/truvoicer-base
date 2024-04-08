import React, {useContext} from 'react';
import {getPostCategoryUrl} from "../../library/helpers/posts";
import Link from "next/link";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";
import {faUser} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const BlogCategoryList = (props) => {
    const {categories = [], classes = ""} = props;
    const templateManager = new TemplateManager(useContext(TemplateContext));

        return (
            <div className={`tags-area clearfix ${classes}`}>
                <div className="post-tags">
                    <span>Tags:</span>
                    {Array.isArray(categories) && categories.map((category, index) => (
                        <React.Fragment key={index}>
                            <Link href={getPostCategoryUrl({category_name: category?.slug})}>
                                # {category?.name}
                            </Link>
                        </React.Fragment>
                    ))}
                </div>
            </div>
        );
};
BlogCategoryList.category = 'widgets';
BlogCategoryList.templateId = 'blogCategoryList';

export default BlogCategoryList;
