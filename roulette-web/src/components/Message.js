import React, { useEffect } from "react";
import PropTypes from "prop-types";
import twemoji from "twemoji";
import Twemoji from "react-twemoji";
import "./stylesheets/Message.css";
import TwemojiText from "./TwemojiText";
import ReactMarkdown from "react-markdown";

function Message({
    avatarUrl,
    avatarTwemoji,
    avatarBackgroundColor,
    username,
    text,
    animated
}) {
    const avatar = avatarUrl ? (
        <img className="message-avatar" alt={`${username}'s avatar`} src={avatarUrl} />
    ) : (
        <div className="message-avatar twemoji" style={{ backgroundColor: avatarBackgroundColor }}>
            <Twemoji>{avatarTwemoji}</Twemoji>
        </div>
    );

    // const twemojiRef = React.useRef(null);

    // useEffect(() => {
    //     if (twemojiRef.current) {
    //         twemoji.parse(twemojiRef.current, {
    //             className: "twemoji-text-img"
    //         });
    //     }
    // }, [twemojiRef, text]);

    return (
        <div className={`message ${animated ? "animated" : ""}`}>
            {avatar}
            <div className="right-content">
                <p className="message-username discord-font">{username}</p>
                {/* <TwemojiText> TODO: BUG WHERE TWEMOJI DOESNT PLAY NICE WITH MARKDOWN, CAUSING IT TO NOT UPDATE PROPERLY */}
                    <p className="message-text discord-font">
                        <ReactMarkdown>{text}</ReactMarkdown>
                    </p>
                {/* </TwemojiText> */}
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
    animated: PropTypes.bool,
};

export default Message;