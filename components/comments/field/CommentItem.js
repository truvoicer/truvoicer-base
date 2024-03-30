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
        <div className="media">
            <a className="pull-left" href="#">
                <Image
                    className="media-object avatar-image"
                    src="https://bootdey.com/img/Content/avatar/avatar1.png"
                    alt=""
                />
            </a>
            <div className="media-body">
                <h4 className="media-heading">{props.parentComment.comment_author}</h4>
                <p>{props.parentComment.comment_content}</p>
                <div className={"media-controls d-flex align-items-center justify-content-between"}>
                <ul className="list-unstyled list-inline media-detail d-flex pull-left">
                    <li>
                        <FontAwesomeIcon icon={faCalendar} />
                        {formatDate(props.parentComment.comment_date)}
                    </li>
                    <li>
                        <FontAwesomeIcon icon={faThumbsUp} />
                        13
                    </li>
                </ul>
                <ul className="list-unstyled list-inline media-detail d-flex pull-right">
                    <li className=""><a href="">Like</a></li>
                    {!props.childItem && <li className=""><a href="" onClick={replyClickHandler}>Reply</a></li>}
                </ul>
                </div>
                {props.childComments && props.childComments.map((comment, index) => (
                    <CommentItem key={index} parentComment={comment} childItem={true} />
                ))}
                {showReply && templateManager.render(<CommentTextForm parentCommentId={props.parentComment.comment_ID} />)}
            </div>
        </div>

    );
}
CommentItem.category = 'comments';
CommentItem.templateId = 'commentItem';
export default CommentItem;
