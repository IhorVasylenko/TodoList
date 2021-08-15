import React from "react";
import error404 from "../../image/error404.png"

export const Error404: React.FC = React.memo(() => {
    return (
        <div style={{display: "flex", justifyContent: "center", alignItems: "center", marginTop: "50px"}}>
            <img
                src={error404}
                alt="error 404"
                style={{height: "100%", width: "auto"}}
            />
        </div>
    );
});