import { get, post } from "./fetch"

class ItemFetch {
	readonly baseUrl = `${import.meta.env.VITE_API_URL}/item`

	buy(id: string) {
		return get<void>(`${this.baseUrl}/${id}/buy`)
	}

	sell(id: string) {
		return get<void>(`${this.baseUrl}/${id}/sell`)
	}

	use(id: string, target: string) {
		return post<void>(`${this.baseUrl}/${id}/use`, { target })
	}

	update(id: string) {
		return post<void>(`${this.baseUrl}/${id}/update`)
	}
}

export const itemFetch = new ItemFetch()
