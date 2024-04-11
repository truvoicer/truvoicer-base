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


    return (
        <CommentsContext.Provider value={commentsData}>
            <div id="comments" className="comments-area block">
                <h3 className="block-title"><span>03 Comments</span></h3>
                {isSet(props.items) &&
                    <ul className="comments-list">
                        {Array.isArray(props.items) && props.items.length > 0
                            ?
                            <>
                                {buildComments().map((item, index) => (
                                    <li key={index}>
                                        {templateManager.render(
                                            <CommentItem key={index}
                                                         parentComment={item.parent}
                                                         childComments={item.children}/>
                                        )}
                                    </li>
                                ))}
                                {templateManager.render(<CommentTextForm/>)}
                            </>
                            :
                            <CommentTextForm/>
                        }
                    </ul>
                }
            </div>
        </CommentsContext.Provider>
    );
}
CommentsList.category = 'comments';
CommentsList.templateId = 'commentsList';
export default CommentsList;
