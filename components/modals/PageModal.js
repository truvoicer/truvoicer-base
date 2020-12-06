import React, {useState} from "react";
import Backdrop from "@material-ui/core/Backdrop";
import {connect} from "react-redux";
import {showPageModalMiddleware} from "../../redux/middleware/page-middleware";
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