function setupWebsocket(path: string, onMessage: (event: MessageEvent) => void) {
	const socket = new WebSocket(
		`${import.meta.env.VITE_WEBSOCKETS_URL}/${path}?twitchId=${Twitch.ext.viewer.id}&twitchJwt=${Twitch.ext.viewer.sessionToken}`
	)

	socket.addEventListener("message", onMessage)

	return socket
}

export { setupWebsocket }
