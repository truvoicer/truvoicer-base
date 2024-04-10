import React, {useContext, useState} from "react";
import CommentTextForm from "./CommentTextForm";
import {formatDate} from "../../../library/utils";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";
import {faCalendar, faHeart, faThumbsUp} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Image from "next/image";

const CommentItem = (props) => {
    const [showReply, setShowReply] = useState(false);
    const templateManager = new TemplateManager(useContext(TemplateContext));

    const replyClickHandler = (e) => {
        e.preventDefault();
        setShowReply(!showReply);
    }

    return (
        <>
            <div className="comment">
                <img
                    className="comment-avatar"
                    src="https://bootdey.com/img/Content/avatar/avatar1.png"
                    alt=""
                />
                <div className="comment-body">
                    <div className="meta-data">
                        <span className="comment-author">{props.parentComment.comment_author}</span>
                        <span className="comment-date pull-right">{formatDate(props.parentComment.comment_date)}</span>
                    </div>
                    <div className="comment-content">
                        <p>{props.parentComment.comment_content}</p>
                    </div>
                    <div className="text-left">
                        {!props.childItem && <a href="comment-reply" onClick={replyClickHandler}>Reply</a>}
                    </div>
                </div>
            </div>

            <ul className="comments-reply">
                {props.childComments && props.childComments.map((comment, index) => (
                    <li key={index}>
                        <CommentItem key={index} parentComment={comment} childItem={true}/>
                    </li>
                ))}
                {showReply && templateManager.render(
                    <CommentTextForm
                    parentCommentId={props.parentComment.comment_ID}
                    />)}

            </ul>
        </>
    );
}
CommentItem.category = 'comments';
CommentItem.templateId = 'commentItem';
export default CommentItem;
