import React, {useContext, useState} from "react";
import {CommentsContext} from "../context/CommentsContext";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";
import Image from "next/image";

const CommentTextForm = (props) => {
    const commentsContext = useContext(CommentsContext)
    const [content, setContent] = useState("");
    const templateManager = new TemplateManager(useContext(TemplateContext));

    const changeHandler = (e) => {
        setContent(e.target.value)
    }

    const submitHandler = (e) => {
        e.preventDefault();
        commentsContext.commentsCallback(content, props.parentCommentId)
        setContent("");
    }


    return (
        <div className="comments-form">
            <h3 className="title-normal">Leave a comment</h3>
            <form onSubmit={submitHandler} role="form">
                <div className="row">
                    <div className="col-md-12">
                        <div className="form-group">
                            <textarea
                                onChange={changeHandler}
                                className="form-control required-field"
                                id="message"
                                placeholder="Your message"
                                required=""
                                value={content}
                            />
                        </div>
                    </div>
                </div>
                <div className="clearfix">
                    <button className="comments-btn btn btn-primary" type="submit">Post Comment</button>
                </div>
            </form>
        </div>
    );
}
CommentTextForm.category = 'comments';
CommentTextForm.templateId = 'commentTextForm';
export default CommentTextForm;
