import React from "react";
import PropTypes from "prop-types";
import { useParams } from "react-router-dom";
import BlurpleBackground from "./BlurpleBackground";
import "./stylesheets/GamePage.css";
import { DISPLAY_URL } from "../helpers/util";
import { useDispatch, useSelector } from "react-redux";
import UserSelect from "./UserSelect";
import Spacer from "./Spacer";
import { onUserSelect } from "../helpers/slices/gameStateSlice";
import AvatarStack from "./AvatarStack";

function GamePage() {
    const dispatch = useDispatch();
    const gameCode = useParams().gameCode.toLowerCase();
    const myDiscordId = useSelector(state => state.gameState.myDiscordId);
    const isLocalClientHost = useSelector(state => state.gameState.isLocalClientHost);
    const activePlayerIds = useSelector(state => state.gameState.activePlayerIds);
    const phase = useSelector(state => state.gameState.gamePhase);

    const onPlayerSelect = (id) => {
        dispatch(onUserSelect(id));
    }

    const playerSelect = (phase === "waiting-for-players" && !myDiscordId) && (
        <UserSelect
            title="Which Discord user are you?"
            onlyShowInactiveUsers
            onUserSelect={onPlayerSelect}
        />
    );

    const lobby = (phase === "waiting-for-players" && myDiscordId) && (
        <div className="lobby">
            <h2>Waiting for players to join...</h2>
            <Spacer height="30px" />
            <AvatarStack userIds={activePlayerIds} />
        </div>
    );

    return (
        <div id="game-page">
            <BlurpleBackground>
                <h1>Discord Roulette</h1>
                <h2>Join at <code>{DISPLAY_URL}/game/{gameCode}</code></h2>
                <Spacer height="50px" />
                {playerSelect}
                {lobby}
            </BlurpleBackground>
        </div>
    );
}

export default GamePage;
