import React from "react";
import PropTypes from "prop-types";
import Twemoji from "react-twemoji";
import "./stylesheets/TwemojiText.css";

function TwemojiText({ children }) {
    return (
        <span className="twemoji-text">
            <Twemoji
                options={{
                    className: "twemoji-text-img"
                }}
            >
                {children}
            </Twemoji>
        </span>
    );
}

TwemojiText.propTypes = {
};

export default TwemojiText;