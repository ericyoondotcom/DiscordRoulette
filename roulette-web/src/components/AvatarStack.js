import React from "react";
import PropTypes from "prop-types";
import "./stylesheets/AvatarStack.css";
import { useSelector } from "react-redux";

function AvatarStack({ userIds }) {
    const members = useSelector(state => state.chatData.members);
    
    const entries = userIds.map(id => {
        const member = members[id];
        if(!member) return null;
        return (
            <img src={member.avatarUrl} alt={member.displayName} key={id} />
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
};

export default AvatarStack;
