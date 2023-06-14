import React from "react";
import BlurpleBackground from "./BlurpleBackground";
import "./stylesheets/LandingPage.css";
import Message from "./Message";
import Button from "./Button";
import Spacer from "./Spacer";

function LandingPage() {
    return (
        <div id="landing-page" className="rails">
            <BlurpleBackground>
                <h1>Discord Roulette</h1>
                <Message
                    // avatarUrl="https://cdn.discordapp.com/avatars/267088700373073920/faa632d2ef5d3b09a625e8bda23663a4.webp?size=240"
                    avatarTwemoji="❓"
                    avatarBackgroundColor="#4f2b2d"
                    username="Guess Who"
                    text="Import your friends' messages. Guess who said what."
                />
                <Spacer height="5vh" />
                <Button content="Host game" emoji="➡️" onClick={() => {}} />
            </BlurpleBackground>
        </div>
    );
}

export default LandingPage;