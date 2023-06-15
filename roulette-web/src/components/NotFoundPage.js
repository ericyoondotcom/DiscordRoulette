import React from "react";
import BlurpleBackground from "./BlurpleBackground";
import Center from "./Center";
import { Link } from "react-router-dom";
import Button from "./Button";
import Spacer from "./Spacer";

function NotFoundPage() {
    return (
        <div id="not-found-page" className="rails">
            <BlurpleBackground>
                <Center>
                    <h1>404: Not Found</h1>
                    <Spacer height="50px" />
                    <Link to="/" className="nostyle">
                        <Button content="Go home" emoji="🏠" />
                    </Link>
                </Center>
            </BlurpleBackground>
        </div>
    );
}

export default NotFoundPage;
