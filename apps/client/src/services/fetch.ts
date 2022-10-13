async function handleResponse<T>(response: Response) {
	const text = await response.text()

	if (response.ok) {
		return text ? JSON.parse(text) as T : undefined
	}

	return Promise.reject(text)
}

async function get<T>(url: string) {
	return fetch(
		url,
		{
			method: "GET",
			headers: { Authorization: `Bearer ${Twitch.ext.viewer.sessionToken}` }
		}
	)
		.then(response => handleResponse<T>(response))
}

async function post<T>(url: string, body?: unknown) {
	return fetch(
		url,
		{
			method: "POST",
			headers: {
				Authorization: `Bearer ${Twitch.ext.viewer.sessionToken}`,
				"Content-Type": 'application/json'
			},
			body: body !== undefined ? JSON.stringify(body) : undefined
		}
	)
		.then(response => handleResponse<T>(response))
}

export { get, post }
