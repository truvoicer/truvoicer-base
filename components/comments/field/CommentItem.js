import React, {useState} from "react";
import CommentTextForm from "./CommentTextForm";
import {formatDate} from "../../../library/utils";

const CommentItem = (props) => {
    const [showReply, setShowReply] = useState(false);

    const replyClickHandler = (e) => {
        e.preventDefault();
        setShowReply(!showReply);
    }
    return (
        <div className="media">
            <a className="pull-left" href="#">
                <img
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
                        <i className="fa fa-calendar"/>
                        {formatDate(props.parentComment.comment_date)}
                    </li>
                    <li>
                        <i className="fa fa-thumbs-up"/>
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
                {showReply && <CommentTextForm parentCommentId={props.parentComment.comment_ID} />}
            </div>
        </div>

    );
}
export default CommentItem;