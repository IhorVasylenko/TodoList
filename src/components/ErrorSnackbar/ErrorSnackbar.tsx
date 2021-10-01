import React from "react";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert, {AlertProps} from "@material-ui/lab/Alert";
import {useSelector} from "react-redux";
import {useAppDispatch} from "../../app/store";
import {setAppError} from "../../app/reducer/app-reducer";
import {appSelectors} from "../../app/";


function Alert(props: AlertProps) {
    return (
        <MuiAlert elevation={6} variant="filled" {...props} />
    );
}


export const ErrorSnackbar: React.FC = React.memo(() => {

    const error = useSelector(appSelectors.selectError);
    const dispatch = useAppDispatch();

    const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
        if (reason === "clickaway") {
            return;
        }
        dispatch(setAppError(null));
    }

    const isOpen = error !== null;

    return (
        <Snackbar open={isOpen} autoHideDuration={3000} onClose={handleClose}>
            <Alert onClose={handleClose} severity="error">
                {error}
            </Alert>
        </Snackbar>
    );
});