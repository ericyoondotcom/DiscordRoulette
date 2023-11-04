import React, { useCallback, useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { Link, useBeforeUnload, useLocation, useParams } from "react-router-dom";
import BlurpleBackground from "./BlurpleBackground";
import "./stylesheets/GamePage.css";
import { DISPLAY_URL } from "../helpers/util";
import { useDispatch, useSelector } from "react-redux";
import UserSelect from "./UserSelect";
import Center from "./Center";
import Button from "./Button";
import Message from "./Message";
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
    const inactivePlayerIds = useSelector(state => state.gameState.inactivePlayerIds);
    const phase = useSelector(state => state.gameState.gamePhase);
    const members = useSelector(state => state.chatData.members);
    const mergedMessageRuns = useSelector(state => state.chatData.mergedMessageRuns);
    const votes = useSelector(state => state.gameState.votes) || {};
    const points = useSelector(state => state.gameState.points) || {};
    const currentMessageRun = useSelector(state => state.gameState.currentMessageRun);

    const getRandomMessage = useCallback(() => {
        return mergedMessageRuns[Math.floor(Math.random() * mergedMessageRuns.length)];
    }, [mergedMessageRuns]);

    useEffect(() => {
        if(!isLocalClientHost) return;
        firebase.hostGame(gameCode, members);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLocalClientHost]);

    const isKicked = useMemo(() => myDiscordId && inactivePlayerIds.includes(myDiscordId), [myDiscordId, inactivePlayerIds]);

    const onPlayerSelect = useCallback((id) => {
        dispatch(onUserSelect(id));
        firebase.joinGame(gameCode, id);
    }, [dispatch, firebase, gameCode]);

    const nextRound = useCallback(() => {
        const messageRun = getRandomMessage();
        firebase.startRound(gameCode, messageRun);
    }, [firebase, gameCode, getRandomMessage]);

    const showResults = useCallback(() => {
        firebase.showResults(gameCode);
    }, [firebase, gameCode]);

    const castVote = useCallback((id) => {
        firebase.vote(gameCode, myDiscordId, id);
    }, [firebase, gameCode, myDiscordId]);

    const onUserKick = isLocalClientHost ? (id) => {
    firebase.leaveGame(gameCode, id, id === myDiscordId && isLocalClientHost);
    } : null;

    if(isKicked) {
        return (
            <div id="game-page">
                <BlurpleBackground>
                    <h1>Discord Roulette</h1>
                    <Spacer height="50px" />
                    <h2>You have been kicked from the game.</h2>
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

    const playerSelect = !myDiscordId && (
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
            <AvatarStack userIds={activePlayerIds} onUserKick={onUserKick} />
            <Spacer height="50px" />
            {
                isLocalClientHost && (
                    <Center>
                        <Button content="Start game" emoji="🎉" onClick={nextRound} />
                    </Center>
                )
            }
        </div>
    );

    const voting = (phase === "voting" && myDiscordId && votes && currentMessageRun) && (
        <div className="voting">
            <Message
                avatarTwemoji="❓"
                avatarBackgroundColor="#4f2b2d"
                username="???"
                text={currentMessageRun.content}
            />
            <Spacer height="50px" />
            {
                myDiscordId in votes ? (
                    <>
                        <h3>Voted:</h3>
                        <Spacer height="20px" />
                        <AvatarStack
                            userIds={Object.keys(votes).filter(i => activePlayerIds.includes(i))}
                            onUserKick={onUserKick}
                        />
                        <Spacer height="20px" />
                        <h3>Waiting for:</h3>
                        <Spacer height="20px" />
                        <AvatarStack
                            userIds={activePlayerIds.filter(id => !(id in votes))}
                            onUserKick={onUserKick}
                        />
                        <Spacer height="20px" />
                        {
                            isLocalClientHost && (
                                <Center>
                                    <Button content="Show results" emoji="👀" onClick={showResults} />
                                </Center>
                            )
                        }
                    </>
                ) : (
                    <UserSelect
                        title="Who sent this message?"
                        onUserSelect={castVote}
                    />
                )
            }
        </div>
    );

    const winners = (votes && currentMessageRun) && Object.keys(votes).filter(id => votes[id] === currentMessageRun.authorId);
    const leaderboard = (phase === "results" && myDiscordId && points) &&
        [...activePlayerIds].sort((a, b) => (points[b] || 0) - (points[a] || 0))
        .map(id => (
            <div className="leaderboard-entry" key={id}>
                <AvatarStack userIds={[id]} onUserKick={onUserKick} />
                <p><b>{members[id].displayName}</b></p>
                <p>{points[id] || 0} points</p>
            </div>
        ));

    const results = (phase === "results" && myDiscordId) && (
        <div className="results">
            <Message
                avatarUrl={members[currentMessageRun.authorId].avatarUrl}
                username={members[currentMessageRun.authorId].displayName}
                text={currentMessageRun.content}
                animated
            />
            <Spacer height="20px" />
            <h2>Winners</h2>
            <Spacer height="20px" />
            <AvatarStack
                userIds={winners.filter(i => activePlayerIds.includes(i))}
                onUserKick={onUserKick}
            />
            {
                isLocalClientHost && (
                    <Center>
                        <Spacer height="50px" />
                        <Button content="Next round" emoji="💯" onClick={nextRound} />
                    </Center>
                )
            }
            <Spacer height="50px" />
            <h2>Leaderboard</h2>
            <Spacer height="20px" />
            <Center>
                <div id="leaderboard">
                    {leaderboard}
                </div>
            </Center>
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
                {voting}
                {results}
            </BlurpleBackground>
        </div>
    );
}

export default GamePage;
