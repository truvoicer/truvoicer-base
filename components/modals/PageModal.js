import React, {useContext, useState} from "react";
import Backdrop from "@mui/material/Backdrop";
import {connect} from "react-redux";
import {showPageModalMiddleware} from "../../redux/middleware/page-middleware";
import DialogContent from "@mui/material/DialogContent";
import Dialog from "@mui/material/Dialog";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";


const PageModal = (props) => {
    const [show, setShow] = useState(props.show)
    const [fullWidth, setFullWidth] = React.useState(true);
    const [maxWidth, setMaxWidth] = React.useState('xs');
    const templateManager = new TemplateManager(useContext(TemplateContext));

    const handleClose = () => {
        props.showPageModalMiddleware(false);
    }

    function defaultView() {
        return (
            <Dialog
                open={show}
                onClose={handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
                aria-labelledby="form-dialog-title"
                fullWidth={fullWidth}
                maxWidth={maxWidth}
            >
                {/*<DialogTitle id="form-dialog-title">Subscribe</DialogTitle>*/}
                <DialogContent>
                    {props.children}
                </DialogContent>

            </Dialog>
        )
    }

    return templateManager.getTemplateComponent({
        category: 'modals',
        templateId: 'pageModal',
        defaultComponent: defaultView(),
        props: {
            defaultView: defaultView,
            show: show,
            fullWidth: fullWidth,
            maxWidth: maxWidth,
            setMaxWidth: setMaxWidth,
            setFullWidth: setFullWidth,
            setShow: setShow,
            handleClose: handleClose,
            ...props
        }
    })
}
export default connect(
    null,
    {
        showPageModalMiddleware
    }
)(PageModal);
