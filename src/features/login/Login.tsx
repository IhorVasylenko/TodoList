import React from "react";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import FormLabel from "@material-ui/core/FormLabel";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import FormControl from "@material-ui/core/FormControl";
import {FormikHelpers, useFormik} from "formik";
import {useSelector} from "react-redux";
import {AppRootStateType, useAppDispatch} from "../../app/store";
import {Redirect} from "react-router-dom";
import {login} from "./reducer/authReducer";

export const Login: React.FC = React.memo(() => {

    const isLoggedIn = useSelector<AppRootStateType, boolean>(state => state.auth.isLoggedIn);
    const dispatch = useAppDispatch();

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
            rememberMe: false,
        },
        validate: (values) => {
            const errors: FormikErrorType = {};
            if (!values.email) {
                errors.email = "Required";
            } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
                errors.email = "Invalid email address";
            }
            if (!values.password) {
                errors.password = "Required";
            } else if (values.password.length < 4) {
                errors.password = "Invalid password, minimum length 4 characters";
            } else if (values.password.length > 20) {
                errors.password = "Invalid password, maximum length 20 characters";
            }
            return errors;
        },
        onSubmit: async (values: FormikValueType, formikHelpers: FormikHelpers<FormikValueType>) => {
            const action = await dispatch(login(values));
            if (login.rejected.match(action)) {
                if (action.payload?.fieldsErrors?.length) {
                    const error = action.payload.fieldsErrors[0];
                    formikHelpers.setFieldError(error.field, error.error);
                }
            }
            // formik.resetForm();
        },
    });

    if (isLoggedIn) {
        return <Redirect to={'/'}/>
    }

    return (
        <Grid container justify="center">
            <Grid item xs={4}>
                <form onSubmit={formik.handleSubmit}>
                    <FormControl>
                        <FormLabel>
                            <p>To log in get registered
                                <a href={"https://social-network.samuraijs.com/"} target={"_blank"} rel="noreferrer">
                                    here
                                </a>
                            </p>
                            <p>or use common test account credentials:</p>
                            <p>Email: free@samuraijs.com</p>
                            <p>Password: free</p>
                        </FormLabel>
                        <FormGroup>
                            <TextField
                                label="Email"
                                margin="normal"
                                type="email"
                                {...formik.getFieldProps("email")}
                            />
                            {formik.touched.email && formik.errors.email
                            && <div style={{color: "red"}}>{formik.errors.email}</div>}
                            <TextField
                                label="Password"
                                margin="normal"
                                type="password"
                                {...formik.getFieldProps("password")}
                            />
                            {formik.touched.password && formik.errors.password
                            && <div style={{color: "red"}}>{formik.errors.password}</div>}
                            <FormControlLabel label={"Remember me"} control={
                                <Checkbox
                                    {...formik.getFieldProps("rememberMe")}
                                    value={formik.values.rememberMe}
                                />
                            }/>
                            <Button type={"submit"} variant={"contained"} color={"primary"}>Login</Button>
                        </FormGroup>
                    </FormControl>
                </form>
            </Grid>
        </Grid>
    );
});


// types
type FormikErrorType = {
    email?: string
    password?: string
    rememberMe?: boolean
};
type FormikValueType = {
    email: string
    password: string
    rememberMe: boolean
};


