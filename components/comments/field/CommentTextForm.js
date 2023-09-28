import React, {useContext, useState} from "react";
import {CommentsContext} from "../context/CommentsContext";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";

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

    function defaultView() {
    return (
        <form onSubmit={submitHandler}>
            <h3 className="pull-left">New Comment</h3>
            <button type="submit" className="btn btn-normal pull-right">Submit</button>
            <fieldset>
                <div className="row">
                    <div className="col-sm-3 col-lg-2 hidden-xs">
                        <img className="img-responsive avatar-image"
                             src="https://bootdey.com/img/Content/avatar/avatar1.png"
                             alt=""/>
                    </div>
                    <div className="form-group col-xs-12 col-sm-9 col-lg-10">
                        <textarea
                            onChange={changeHandler}
                            className="form-control"
                            id="message"
                            placeholder="Your message"
                            required=""
                            value={content}
                        />
                    </div>
                </div>
            </fieldset>
        </form>
    );
    }
    return templateManager.getTemplateComponent({
        category: 'comments',
        templateId: 'commentTextForm',
        defaultComponent: defaultView(),
        props: {
            defaultView: defaultView,
            changeHandler: changeHandler,
            submitHandler: submitHandler,
            content: content,
            setContent: setContent,
            ...props
        }
    })
}
export default CommentTextForm;
