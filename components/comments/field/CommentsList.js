import React, {useContext, useState} from "react";
import {CommentsContext} from "../context/CommentsContext";
import CommentTextForm from "./CommentTextForm";
import CommentItem from "./CommentItem";
import {isSet} from "../../../library/utils";
import LoaderComponent from "../../widgets/Loader";

const CommentsList = (props) => {
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
        <section className="content-item" id="comments">
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        {isSet(props.items) && Array.isArray(props.items) && props.items.length > 0
                            ?
                            <>
                                <CommentTextForm />
                                {buildComments().map((item, index) => (
                                    <CommentItem key={index} parentComment={item.parent} childComments={item.children}/>
                                ))}
                            </>
                            :
                            <CommentTextForm />
                        }
                    </div>
                </div>
            </div>
        </section>
        </CommentsContext.Provider>
    );
}
export default CommentsList;