import React from "react";
import PropTypes from "prop-types";
import "./stylesheets/UserSelect.css";
import { useSelector } from "react-redux";

function UserSelect({
    title,
    onlyShowActiveUsers,
    onlyShowInactiveUsers,
    onUserSelect,
}) {
    const members = useSelector(state => state.chatData.members);
    const activePlayerIds = useSelector(state => state.gameState.activePlayerIds);
    if(!members || !activePlayerIds) return null;
    const entries = Object.keys(members).map(id => {
        if(activePlayerIds.includes(id)) {
            if(onlyShowInactiveUsers) return null;
        } else {
            if(onlyShowActiveUsers) return null;
        }
        const member = members[id];
        return (
            <div className="user-entry" key={id} onClick={() => {
                if(onUserSelect) onUserSelect(id);
            }}>
                <img src={member.avatarUrl} alt={member.displayName} />
                <p>{member.displayName}</p>
            </div>
        );
    })

    return (
        <div className="user-select">
            <h2>{title}</h2>
            <div className="users-container">
                {entries}
            </div>
        </div>
    );
}

UserSelect.propTypes = {
    title: PropTypes.string,
    onlyShowActiveUsers: PropTypes.bool,
    onlyShowInactiveUsers: PropTypes.bool,
    onUserSelect: PropTypes.func,
};

export default UserSelect;
