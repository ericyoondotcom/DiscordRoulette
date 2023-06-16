const {onCall, HttpsError} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const admin = require("firebase-admin");
const firebaseDatabase = require("firebase-admin/database");

const GAME_CODE_LENGTH = 6;
const REWARD_CORRECT_ANSWER = 100;

const DEFAULT_GAME_STATE = {
    gamePhase: "waiting-for-players", // idle, waiting-for-players, voting, results, closed
    activePlayerIds: {},
    votes: {}, // ( player id : id of player they voted for )
    points: {}, // ( player id : number of points )
    currentMessageRun: {},
};

admin.initializeApp();

const db = admin.database();

exports.hostGame = onCall(async request => {
    const gameCode = request.data.gameCode;
    const members = request.data.members;
    
    if(typeof(gameCode) !== "string" || gameCode.length !== GAME_CODE_LENGTH) {
        throw new HttpsError("invalid-argument", "gameCode must be a string of length 6");
    }
    if(typeof(members) !== "object") {
        throw new HttpsError("invalid-argument", "members must be an object");
    }
    for(const [id, member] of Object.entries(members)) {
        const keys = Object.keys(member);
        if(!keys.includes("displayName") || !keys.includes("avatarUrl") || keys.length !== 2) {
            throw new HttpsError("invalid-argument", "each member must only have 2 keys: displayName and avatarUrl");
        }
    }

    const newGameState = {...DEFAULT_GAME_STATE};
    newGameState.startedAt = Date.now();
    newGameState.members = members;
    await db.ref(`/games/${gameCode}`).set(newGameState);

    console.log("host game");
    return {success: true};
});

exports.joinGame = onCall(async request => {
    const gameCode = request.data.gameCode;
    const myDiscordId = request.data.myDiscordId;
    
    if(typeof(gameCode) !== "string" || gameCode.length !== GAME_CODE_LENGTH) {
        throw new HttpsError("invalid-argument", "gameCode must be a string of length 6");
    }
    if(typeof(myDiscordId) !== "string") {
        throw new HttpsError("invalid-argument", "myDiscordId must be a string");
    }

    await db.ref(`/games/${gameCode}/activePlayerIds/${myDiscordId}`).set(true);
    console.log("join game")
    return {success: true};
});

exports.leaveGame = onCall(async request => {
    const gameCode = request.data.gameCode;
    const myDiscordId = request.data.myDiscordId;
    const userWasHost = request.data.userWasHost;
    
    if(typeof(gameCode) !== "string" || gameCode.length !== GAME_CODE_LENGTH) {
        throw new HttpsError("invalid-argument", "gameCode must be a string of length 6");
    }
    if(typeof(myDiscordId) !== "string") {
        throw new HttpsError("invalid-argument", "myDiscordId must be a string");
    }

    if(userWasHost) {
        await db.ref(`/games/${gameCode}/gamePhase`).set("closed");
    } else {
        await db.ref(`/games/${gameCode}/activePlayerIds/${myDiscordId}`).set(false);
    }
    console.log("leave game! host: " + userWasHost);
    return {success: true};
});

exports.startRound = onCall(async request => {
    const gameCode = request.data.gameCode;
    const messageRun = request.data.messageRun;

    if(typeof(gameCode) !== "string" || gameCode.length !== GAME_CODE_LENGTH) {
        throw new HttpsError("invalid-argument", "gameCode must be a string of length 6");
    }
    if(typeof(messageRun) !== "object" || !("authorId" in messageRun) || !("content" in messageRun)) {
        throw new HttpsError("invalid-argument", "messageRun must be an object with authorId and content");
    }

    await db.ref(`/games/${gameCode}`).update({
        gamePhase: "voting",
        currentMessageRun: {
            authorId: messageRun.authorId,
            content: messageRun.content,
        },
        votes: {},
    });
    console.log("started round!");
    return {success: true};
});

exports.vote = onCall(async request => {
    const gameCode = request.data.gameCode;
    const myDiscordId = request.data.myDiscordId;
    const voteFor = request.data.voteFor;

    if(typeof(gameCode) !== "string" || gameCode.length !== GAME_CODE_LENGTH) {
        throw new HttpsError("invalid-argument", "gameCode must be a string of length 6");
    }
    if(typeof(myDiscordId) !== "string") {
        throw new HttpsError("invalid-argument", "myDiscordId must be a string");
    }
    if(typeof(voteFor) !== "string") {
        throw new HttpsError("invalid-argument", "voteFor must be a string");
    }

    await db.ref(`/games/${gameCode}/votes/${myDiscordId}`).set(voteFor);
    console.log("voted!");
    return {success: true};
});

exports.showResults = onCall(async request => {
    const gameCode = request.data.gameCode;

    if(typeof(gameCode) !== "string" || gameCode.length !== GAME_CODE_LENGTH) {
        throw new HttpsError("invalid-argument", "gameCode must be a string of length 6");
    }

    const snap = await db.ref(`/games/${gameCode}`).get();
    if(!snap.exists()) throw new HttpsError("internal", "data was empty");
    const oldData = snap.val();

    const points = {...oldData.points};
    for(const [voterId, voteeId] of Object.entries(oldData.votes)) {
        if(voteeId === oldData.currentMessageRun.authorId) {
            if(!(voterId in points)) points[voterId] = 0;
            points[voterId] += REWARD_CORRECT_ANSWER;
        }
    }

    await db.ref(`/games/${gameCode}`).update({
        gamePhase: "results",
        points,
    });
    console.log("show results");
    return {success: true};
});
