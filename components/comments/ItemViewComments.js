import CommentsList from "./field/CommentsList";
import React, {useContext, useState} from "react";
import {isNotEmpty, isSet} from "../../library/utils";
import {buildWpApiUrl, protectedApiRequest, publicApiRequest} from "../../library/api/wp/middleware";
import {wpApiConfig} from "../../config/wp-api-config";
import {SESSION_USER, SESSION_USER_ID} from "../../redux/constants/session-constants";
import {connect} from "react-redux";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";

const sprintf = require("sprintf").sprintf;
const {useEffect} = require("react");

const ItemViewComments = (props) => {
    const [comments, setComments] = useState([]);
    const templateManager = new TemplateManager(useContext(TemplateContext));

    const commentSubmitCallback = (content, parentCommentId) => {
        let data = {
            provider: props.provider,
            category: props.category,
            item_id: props.item_id,
            user_id: props.user[SESSION_USER_ID],
            comment_content: content
        };
        if (isNotEmpty(parentCommentId)) {
            data.comment_parent = parentCommentId;
        }
        protectedApiRequest(buildWpApiUrl(wpApiConfig.endpoints.createComment), data)
        .then(response => {
            if (response.data.status === "success") {
                setComments(comments => {
                    let list = [...comments];
                    list.unshift(response.data.data)
                    return list;
                })
            }
        })
        .catch(error => {
            if (!isSet(error.response) || !isSet(error.response.data)) {
                console.error(error)
            }
            if (isSet(error.response.data.code)) {
                alert(error.response.data.message)
            }
        })
    }

    function commentsByItemIdRequest() {

        const data = {
            category: props.category,
            provider: props.provider,
            item_id: props.item_id
        };
        publicApiRequest(buildWpApiUrl(wpApiConfig.endpoints.commentsByItemId, data))
            .then(response => {
                if (!isCancelled) {
                    if (response.data.status === "success") {
                        setComments(response.data.data);
                    }
                }
            })
            .catch(error => {
                console.error(error)
            })
    }

    useEffect(() => {
        let isCancelled = false;
        if (isNotEmpty(props.category) && isNotEmpty(props.provider) && isNotEmpty(props.item_id)) {
            commentsByItemIdRequest();
            return () => {
                isCancelled = true
            }
        }

    }, [props.category, props.provider, props.item_id])

    function defaultView() {
    return (
        <CommentsList items={comments} commentSubmitCallback={commentSubmitCallback}/>
    );
    }
    return templateManager.getTemplateComponent({
        category: 'comments',
        templateId: 'itemViewComments',
        defaultComponent: defaultView(),
        props: {
            defaultView: defaultView,
            commentSubmitCallback: commentSubmitCallback,
            commentsByItemIdRequest: commentsByItemIdRequest,
            comments: comments,
            setComments: setComments,
            ...props
        }
    })
}

function mapStateToProps(state) {
    return {
        user: state.session[SESSION_USER]
    };
}

export default connect(
    mapStateToProps,
    null
)(ItemViewComments);
