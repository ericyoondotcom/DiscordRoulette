import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue } from "firebase/database";
import { getFunctions, httpsCallable, connectFunctionsEmulator } from "firebase/functions";
import { FIREBASE_CONFIG } from "../constants";
import { useDispatch } from "react-redux";
import { useCallback, useEffect } from "react";
import { onMembersChanged } from "../helpers/slices/chatDataSlice";
import { onActivePlayerIdsChanged, onGamePhaseChanged } from "../helpers/slices/gameStateSlice";

const firebase = initializeApp(FIREBASE_CONFIG);
const db = getDatabase(firebase);
const functions = getFunctions(firebase);

if(process.env.NODE_ENV === "development") {
    connectFunctionsEmulator(functions, "localhost", 5001);
}

const hostGameFunction = httpsCallable(functions, "hostGame");
const joinGameFunction = httpsCallable(functions, "joinGame");
const leaveGameFunction = httpsCallable(functions, "leaveGame");

function useFirebase(gameCode) {
    const dispatch = useDispatch();
    
    const hostGame = useCallback(async (gameCode, members) => {
        try {
            await hostGameFunction({ gameCode, members });
        } catch(e) {
            console.error(e);
            return;
        }
    }, []);

    const joinGame = useCallback(async (gameCode, myDiscordId) => {
        try {
            await joinGameFunction({ gameCode, myDiscordId });
        } catch(e) {
            console.error(e);
            return;
        }
    }, []);

    const leaveGame = useCallback(async (gameCode, myDiscordId, userWasHost) => {
        try {
            await leaveGameFunction({ gameCode, myDiscordId, userWasHost });
        } catch(e) {
            console.error(e);
            return;
        }
    }, []);

    useEffect(() => {
        const membersRef = ref(db, `/games/${gameCode}/members`);
        onValue(membersRef, snap => {
            const data = snap.val();
            
            if(!data) {
                dispatch(onMembersChanged({}));
                return;
            }

            dispatch(onMembersChanged(data));
        });

        const gamePhaseRef = ref(db, `/games/${gameCode}/gamePhase`);
        onValue(gamePhaseRef, snap => {
            const data = snap.val();
            dispatch(onGamePhaseChanged(data));
        });

        const activePlayersRef = ref(db, `/games/${gameCode}/activePlayerIds`);
        onValue(activePlayersRef, snap => {
            const data = snap.val();

            if(!data) {
                dispatch(onActivePlayerIdsChanged([]));
                return;
            }

            const newActivePlayers = [];
            for(const id of Object.keys(data)) {
                if(data[id] === true) newActivePlayers.push(id);
            }
            dispatch(onActivePlayerIdsChanged(newActivePlayers));
        });
    }, []);

    return { hostGame, joinGame, leaveGame };
}

export default useFirebase;