import React from "react";
import BlurpleBackground from "./BlurpleBackground";
import { Link } from "react-router-dom";
import "./stylesheets/LandingPage.css";
import Message from "./Message";
import Button from "./Button";
import Spacer from "./Spacer";
import Center from "./Center";

function LandingPage() {
    return (
        <div id="landing-page" className="rails">
            <BlurpleBackground>
                <h1>Discord Roulette</h1>
                <Message
                    avatarTwemoji="❓"
                    avatarBackgroundColor="#4f2b2d"
                    username="Guess Who"
                    text="Import your friends' messages. Guess who said what."
                />
                <Spacer height="5vh" />
                <Center>
                    <Link to="/upload" className="nostyle">
                        <Button content="Host game" emoji="➡️" />
                    </Link>
                </Center>
            </BlurpleBackground>
        </div>
    );
}

export default LandingPage;