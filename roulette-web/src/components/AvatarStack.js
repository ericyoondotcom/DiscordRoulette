import React from "react";
import PropTypes from "prop-types";
import "./stylesheets/AvatarStack.css";
import { useSelector } from "react-redux";
import Twemoji from "react-twemoji";

function AvatarStack({ userIds, onUserKick }) {
    const members = useSelector(state => state.chatData.members);
    
    const entries = userIds.map(id => {
        const member = members[id];
        if(!member) return null;
        const onKick = () => {
            if(onUserKick) onUserKick(id);
        }
        return (
            <div onClick={onKick}>
                <img src={member.avatarUrl} alt={member.displayName} key={id} />
                {
                    onUserKick && (
                        <div className="avatar-shade">
                            <Twemoji>❌</Twemoji>
                        </div>
                    )
                }
            </div>
        );
    });

    return (
        <div className="avatar-stack">
            {entries}
        </div>
    );
}

AvatarStack.propTypes = {
    userIds: PropTypes.arrayOf(PropTypes.string),
    onUserKick: PropTypes.func,
};

export default AvatarStack;
