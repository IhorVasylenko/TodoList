import React from "react";
import {useSelector} from "react-redux";
import {Redirect} from "react-router-dom";
import {loginSelectors} from "../login";

export const Error404: React.FC = React.memo(() => {

    const isLoggedIn = useSelector(loginSelectors.selectIsLoggedIn);

    debugger

    if(isLoggedIn) {
        return <Redirect from={"/404"} to={"/"}/>
    }

    return (
        <div style={{display: "flex", justifyContent: "center", alignItems: "center", marginTop: "50px"}}>
            <div style={{height: "80vh", width: "80vm", textAlign: "center"}}>
                <h1 style={{fontSize: "20vh", fontWeight: 700, color: "red", textTransform: "uppercase"}}>
                    error 404
                </h1>
                <p style={{fontSize: "2vh", fontWeight: 500}}>
                    Oops, something went wrong. We are already looking for a solution to your problem.
                </p>
            </div>
        </div>
    );
});