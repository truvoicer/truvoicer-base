import Modal from "@material-ui/core/Modal";
import Fade from "@material-ui/core/Fade";
import React, {useState} from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Backdrop from "@material-ui/core/Backdrop";
import {connect} from "react-redux";
import {showPageModalMiddleware} from "../../redux/middleware/page-middleware";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import Dialog from "@material-ui/core/Dialog";


const PageModal = (props) => {
    const [show, setShow] = useState(props.show)
    const [fullWidth, setFullWidth] = React.useState(true);
    const [maxWidth, setMaxWidth] = React.useState('xs');

    const handleClose = () => {
        props.showPageModalMiddleware(false);
    }

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
export default connect(
    null,
    {
        showPageModalMiddleware
    }
)(PageModal);