import React, {useContext, useState} from "react";
import {CommentsContext} from "../context/CommentsContext";
import CommentTextForm from "./CommentTextForm";
import CommentItem from "./CommentItem";
import {isSet} from "../../../library/utils";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";

const CommentsList = (props) => {
    const templateManager = new TemplateManager(useContext(TemplateContext));
    const commentSubmitCallback = (content, parentCommentId) => {
        props.commentSubmitCallback(content, parentCommentId)
    }

    const [commentsData, setCommentsData] = useState({
        commentsCallback: commentSubmitCallback
    })

    const buildComments = () => {
        let commentList = [];
        props.items.map((item) => {
            if (parseInt(item.comment_parent) === 0) {
                commentList.push({
                    parent: item,
                    children: getChildComments(item.comment_ID)
                })
            }
        })
        return commentList;
    }

    const getChildComments = (id) => {
        return props.items.filter(item => parseInt(item.comment_parent) === parseInt(id));
    }

    function defaultView() {
        return (

            <CommentsContext.Provider value={commentsData}>
                <section className="content-item" id="comments">
                    <div className="container">
                        <div className="row">
                            <div className="col-12">
                                {isSet(props.items) && Array.isArray(props.items) && props.items.length > 0
                                    ?
                                    <>
                                        <CommentTextForm/>
                                        {buildComments().map((item, index) => (
                                            <CommentItem key={index} parentComment={item.parent}
                                                         childComments={item.children}/>
                                        ))}
                                    </>
                                    :
                                    <CommentTextForm/>
                                }
                            </div>
                        </div>
                    </div>
                </section>
            </CommentsContext.Provider>
        );
    }

    return templateManager.getTemplateComponent({
        category: 'comments',
        templateId: 'commentsList',
        defaultComponent: defaultView(),
        props: {
            defaultView: defaultView,
            commentSubmitCallback: commentSubmitCallback,
            commentsData: commentsData,
            setCommentsData: setCommentsData,
            buildComments: buildComments,
            getChildComments: getChildComments
        }
    })
}
export default CommentsList;
