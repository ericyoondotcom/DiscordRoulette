import React from "react";
import PropTypes from "prop-types";
import Twemoji from "react-twemoji";
import "./stylesheets/Message.css";
import TwemojiText from "./TwemojiText";

function Message({
    avatarUrl,
    avatarTwemoji,
    avatarBackgroundColor,
    username,
    text
}) {
    const avatar = avatarUrl ? (
        <img className="message-avatar" alt={`${username}'s avatar`} src={avatarUrl} />
    ) : (
        <div className="message-avatar twemoji" style={{ backgroundColor: avatarBackgroundColor }}>
            <Twemoji>{avatarTwemoji}</Twemoji>
        </div>
    );

    return (
        <div className="message">
            {avatar}
            <div className="right-content">
                <p className="message-username discord-font">{username}</p>
                <TwemojiText>
                    <p className="message-text discord-font">{text}</p>
                </TwemojiText>
            </div>
        </div>
    );
}

Message.propTypes = {
    avatarUrl: PropTypes.string,
    avatarTwemoji: PropTypes.string,
    avatarBackgroundColor: PropTypes.string,
    username: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
};

export default Message;