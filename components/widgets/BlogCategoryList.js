import React, {useContext} from 'react';
import {getPostCategoryUrl} from "../../library/helpers/posts";
import Link from "next/link";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";

const BlogCategoryList = (props) => {
    const {categories = [], classes = ""} = props;
    const templateManager = new TemplateManager(useContext(TemplateContext));
    function defaultView() {
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

    return templateManager.getTemplateComponent({
        category: 'public',
        templateId: 'blogCategoryList',
        defaultComponent: defaultView(),
        props: {
            ...props
        }
    })
}
;

export default BlogCategoryList;
