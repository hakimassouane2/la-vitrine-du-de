// TODO: dirty

import tmi from "tmi.js"

// Define configuration options
const opts = {
	identity: {
		username: "lavolontedubot",
		password: "oauth:cxfsx0ms0h7oeet2sarozdtsjzi59v"
	},
	channels: ["lavolontedude"]
}

const global = {
	jwtToken: "",
	appAccessToken: "",
	twitchSubSecret: "",
	chatClient: new tmi.client(opts)
}

// Connect to Twitch:
global.chatClient
	.connect()
	.then(() => console.info("Tmi is connected!"))
	.catch(error => console.error("Tmi couldn't connect:", error))

export { global }
