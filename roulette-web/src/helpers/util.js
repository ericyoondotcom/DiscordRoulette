export const DISPLAY_URL = "discord-roulette-game.web.app"

const GAME_CODE_LENGTH = 6;
const GAME_CODE_CHARACTERS = "abcdefghijklmnopqrstuvwxyz";
export function generateGameCode() {
	let result = "";
	for(let counter = 0; counter < GAME_CODE_LENGTH; counter++) {
		result += GAME_CODE_CHARACTERS.charAt(Math.floor(Math.random() * GAME_CODE_CHARACTERS.length));
	}
	return result;
}
