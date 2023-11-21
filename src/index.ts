// alt1 base libs, provides all the commonly used methods for image matching and capture
// also gives your editor info about the window.alt1 api
import * as a1lib from 'alt1';
import * as ChatReader from 'alt1/chatbox';
import * as sauce from './a1sauce';
import { keys } from 'lodash';

// tell webpack that this file relies index.html, appconfig.json and icon.png, this makes webpack
// add these files to the output directory
// this works because in /webpack.config.js we told webpack to treat all html, json and imageimports
// as assets
import './index.html';
import './appconfig.json';
import './icon.png';
import './css/styles.css';

let chatReader = new ChatReader.default();
chatReader.diffRead = true;
chatReader.diffReadUseTimestamps = true;
chatReader.readargs = {
	colors: [
		a1lib.mixColor(255, 255, 255),
		a1lib.mixColor(127, 169, 255),
		a1lib.mixColor(132, 212, 119),
	],
};

let getChat = () => {
	if (chatReader) {
		if (!chatReader.pos) {
			chatReader.find();
		}
	}
};

const TELOS_DIALOGUE = {
	'Your anima will return to the source':
		'Your anima will return to the source',
	'Gielinor, give me strength!': 'Gielinor, give me strength!',
	'Hold still, invader.': 'Hold still, invader',
	'SO. MUCH. POWER!': 'SO. MUCH. POWER!',
	'Let the anima consume you!': 'Let the anima consume you!',
	'You dare to defy me?': 'You dare to defy me?',
	'You dare to use my power against me?':
		'You dare to use my power against me?',
};

function getByID(id: string) {
	return document.getElementById(id);
}

let helperItems = {
	Output: getByID('output'),
	settings: getByID('Settings'),
};

var dialogueImages = a1lib.webpackImages({
	fight_start: require('./asset/data/fight_start.data.png'),
});

function tryFindDialogue() {
	let client_screen = a1lib.captureHoldFullRs();

	let telosDialogue = {
		fight_start: client_screen.findSubimage(dialogueImages.fight_start),
	}

	let foundDialogue = {
		fight_start: telosDialogue.fight_start[0]
	};

	Object.keys(foundDialogue).forEach((key) =>
		foundDialogue[key] === undefined ? delete foundDialogue[key] : {}
	);

	// Only returns a value if we found one
	return foundDialogue;
}

let played_audio = {
	lastTimestamp: 0,
	lastFiveLines: [],
	volume: 100,
	fight_start: false,
	anima: false,
	uppercut: false,
	stun: false,
	soMuchPower: false,
	weakAnimaBomb: false,
	instantKillBomb: false,
	activatingAFont: false,
}
async function getBossStartDialogue() {
	let foundBossStart = Object.entries(tryFindDialogue());

	if (Object.keys(foundBossStart).length == 0) {
		return;
	}

	if (foundBossStart[0][0] == "fight_start") {
		let fight_start_audio = new Audio('./asset/resource/telos_lines/start_of_fight.wav');
		fight_start_audio.volume = played_audio.volume;
		if (!played_audio.fight_start) {
			played_audio.fight_start = true;
			fight_start_audio.play();
			setTimeout(() => {
				fight_start_audio.pause();
				fight_start_audio.currentTime = 0;
				played_audio.fight_start = false;
				played_audio.anima = false;
				played_audio.uppercut = false;
				played_audio.stun = false;
				played_audio.soMuchPower = false;
				played_audio.weakAnimaBomb = false;
				played_audio.instantKillBomb = false;
				played_audio.activatingAFont = false;
			}, 60000);
		}
	}
}

async function scanForDialogue() {
	getBossStartDialogue();
	new Promise((resolve) => setTimeout(resolve, 50));
}

async function readChatbox() {
	if (chatReader && chatReader.pos && chatReader.pos.boxes[0] !== undefined) {
		let chatLines = chatReader.read();
		let telosMsg = keys(TELOS_DIALOGUE);
		chatLines?.forEach((line) => {
			let match = telosMsg.find((message) =>
				line.text.includes(message)
			);
			if (played_audio.lastFiveLines.includes(line)) {
				return;
			}
			played_audio.lastFiveLines.push(line);
			if (match?.indexOf('Your anima will return to the source') > -1) {
				let anima_audio = new Audio(
					'./asset/resource/telos_lines/Tendril_attack.wav'
				);
				anima_audio.volume = played_audio.volume;
				if (!played_audio.anima) {
					played_audio.anima = true;
					anima_audio.play();
					setTimeout(() => {
						anima_audio.pause();
						anima_audio.currentTime = 0;
						played_audio.anima = false;
					}, 60000);
				}
			}
			if (match?.indexOf('Gielinor, give me strength') > -1) {
				let uppercut_audio = new Audio(
					'./asset/resource/telos_lines/Uppercut.wav'
				);
				uppercut_audio.volume = played_audio.volume;
				if (!played_audio.uppercut) {
					played_audio.uppercut = true;
					uppercut_audio.play();
					setTimeout(() => {
						uppercut_audio.pause();
						uppercut_audio.currentTime = 0;
						played_audio.uppercut = false;
					}, 60000);
				}
			}
			if (match?.indexOf('Hold still, invader') > -1) {
				let stun_audio = new Audio(
					'./asset/resource/telos_lines/Stun.wav'
				);
				stun_audio.volume = played_audio.volume;
				if (!played_audio.stun) {
					played_audio.stun = true;
					stun_audio.play();
					setTimeout(() => {
						stun_audio.pause();
						stun_audio.currentTime = 0;
						played_audio.stun = false;
					}, 60000);
				}
			}
			if (match?.indexOf('SO. MUCH. POWER!') > -1) {
				let soMuchPower_audio = new Audio(
					'./asset/resource/telos_lines/So_Much_Power.wav'
				);
				soMuchPower_audio.volume = played_audio.volume;
				if (!played_audio.soMuchPower) {
					played_audio.soMuchPower = true;
					soMuchPower_audio.play();
					setTimeout(() => {
						soMuchPower_audio.pause();
						soMuchPower_audio.currentTime = 0;
						played_audio.soMuchPower = false;
					}, 60000);
				}
			}
			if (match?.indexOf('Let the anima consume you') > -1) {
				let weakAnimaBomb_audio = new Audio(
					'./asset/resource/telos_lines/Weak_anima_bomb.wav'
				);
				weakAnimaBomb_audio.volume = played_audio.volume;
				if (!played_audio.weakAnimaBomb) {
					played_audio.weakAnimaBomb = true;
					weakAnimaBomb_audio.play();
					setTimeout(() => {
						weakAnimaBomb_audio.pause();
						weakAnimaBomb_audio.currentTime = 0;
						played_audio.weakAnimaBomb = false;
					}, 60000);
				}
			}
			if (match?.indexOf('You dare to defy me?') > -1) {
				let instantKillBomb_audio = new Audio(
					'./asset/resource/telos_lines/Instant_kill_bomb.wav'
				);
				instantKillBomb_audio.volume = played_audio.volume;
				if (!played_audio.instantKillBomb) {
					played_audio.instantKillBomb = true;
					instantKillBomb_audio.play();
					setTimeout(() => {
						instantKillBomb_audio.pause();
						instantKillBomb_audio.currentTime = 0;
						played_audio.instantKillBomb = false;
					}, 20000);
				}
			}
			if (match?.indexOf('You dare to use my power against me?') > -1) {
				let activatingAFont_audio = new Audio(
					'./asset/resource/telos_lines/Activating_a_font.wav'
				);
				activatingAFont_audio.volume = played_audio.volume;
				if (!played_audio.activatingAFont) {
					played_audio.activatingAFont = true;
					activatingAFont_audio.play();
					setTimeout(() => {
						activatingAFont_audio.pause();
						activatingAFont_audio.currentTime = 0;
						played_audio.activatingAFont = false;
					}, 60000);
				}
			}
		});
	}
}

export function startApp() {
	if (!window.alt1) {
		helperItems.Output.insertAdjacentHTML(
			'beforeend',
			`<div>You need to run this page in alt1 to capture the screen</div>`
		);
		return;
	}
	if (!alt1.permissionPixel) {
		helperItems.Output.insertAdjacentHTML(
			'beforeend',
			`<div><p>Page is not installed as app or capture permission is not enabled</p></div>`
		);
		return;
	}
	if (!alt1.permissionOverlay) {
		helperItems.Output.insertAdjacentHTML(
			'beforeend',
			`<div><p>Attempted to use Overlay but app overlay permission is not enabled. Please enable "Show Overlay" permission in Alt1 settinsg (wrench icon in corner).</p></div>`
		);
		return;
	}

	setInterval(scanForDialogue, 300);
	setInterval(getChat, 200);
	setInterval(readChatbox, 200);
}

const settingsObject = {
	settingsHeader: sauce.createHeading('h2', 'Settings'),
	volume: sauce.createRangeSetting('volume', 'Volume', {
		defaultValue: 100,
		min: 0,
		max: 100,
		unit: '%',
	}),
};

settingsObject.volume.querySelector('input').addEventListener('change', (e) => {
	played_audio.volume = parseInt(settingsObject.volume.querySelector('input').value, 10) / 100;
});

window.onload = function () {
	//check if we are running inside alt1 by checking if the alt1 global exists
	if (window.alt1) {
		//tell alt1 about the app
		//this makes alt1 show the add app button when running inside the embedded browser
		//also updates app settings if they are changed

		alt1.identifyAppUrl('./appconfig.json');
		Object.values(settingsObject).forEach((val) => {
			helperItems.settings.before(val);
		});
		played_audio.volume = parseInt(
			settingsObject.volume.querySelector('input').value,
			10
		) / 100;
		startApp();
	} else {
		let addappurl = `alt1://addapp/${
			new URL('./appconfig.json', document.location.href).href
		}`;
		helperItems.Output.insertAdjacentHTML(
			'beforeend',
			`
			Alt1 not detected, click <a href='${addappurl}'>here</a> to add this app to Alt1
		`
		);
	}
};
