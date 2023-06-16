import React, { useCallback, useEffect } from "react";
import PropTypes from "prop-types";
import { Link, useBeforeUnload, useLocation, useParams } from "react-router-dom";
import BlurpleBackground from "./BlurpleBackground";
import "./stylesheets/GamePage.css";
import { DISPLAY_URL } from "../helpers/util";
import { useDispatch, useSelector } from "react-redux";
import UserSelect from "./UserSelect";
import Center from "./Center";
import Button from "./Button";
import Spacer from "./Spacer";
import { onUserSelect, resetGameState } from "../helpers/slices/gameStateSlice";
import AvatarStack from "./AvatarStack";
import useFirebase from "../hooks/useFirebase";
import { resetChatData } from "../helpers/slices/chatDataSlice";

function GamePage() {
    const dispatch = useDispatch();
    const gameCode = useParams().gameCode.toLowerCase();
    const firebase = useFirebase(gameCode);
    const myDiscordId = useSelector(state => state.gameState.myDiscordId);
    const isLocalClientHost = useSelector(state => state.gameState.isLocalClientHost);
    const activePlayerIds = useSelector(state => state.gameState.activePlayerIds);
    const phase = useSelector(state => state.gameState.gamePhase);
    const members = useSelector(state => state.chatData.members);

    const handleTabClose = useCallback(async (e) => {
        console.log("Handle tab close!")
        if(e) e.preventDefault();
        await firebase.leaveGame(gameCode, myDiscordId, isLocalClientHost);
        dispatch(resetGameState());
        dispatch(resetChatData());
    }, [dispatch, firebase, gameCode, isLocalClientHost, myDiscordId]);

    useEffect(() => {
        window.addEventListener("beforeunload", handleTabClose);
        return () => {
            window.removeEventListener("beforeunload", handleTabClose);
        }
    });

    useEffect(() => {
        if(!isLocalClientHost) return;
        firebase.hostGame(gameCode, members);
    }, [isLocalClientHost]);

    const onPlayerSelect = (id) => {
        dispatch(onUserSelect(id));
        firebase.joinGame(gameCode, id);
    }

    if(phase === "closed") {
        return (
            <div id="game-page">
                <BlurpleBackground>
                    <h1>Discord Roulette</h1>
                    <Spacer height="50px" />
                    <h2>Host has left game. Thanks for playing!</h2>
                    <Spacer height="50px" />
                    <Center>
                        <Link to="/" className="nostyle">
                            <Button content="Back to Home" emoji="🏠" />
                        </Link>
                    </Center>
                </BlurpleBackground>
            </div>
        );
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
