const rarities = [
	"Bronze",
	"Argent",
	"Or",
	"Platine",
	"Diamant"
] as const

const categories = [
	"Bonus",
	"Malus",
	"Neutre",
	"Autre"
] as const

const gameTypes = [
	"Dnd",
	"Mythras",
	"Warhammer",
] as const

type Rarity = typeof rarities[number]

type Category = typeof categories[number]

type GameType = typeof gameTypes[number]

type BaseRollTable = {
	elements: string[]
	weigths: number[]
}

type BaseItem = {
	name: string
	description: string
	imageUrl: string
	price: number
	targettable?: boolean
	globalCooldown: number
	userCooldown: number
	lastUsed?: Date
	rarity: number
	category: number
	isActive: boolean
	gameType: number
	isRollable: boolean
	rollTable: BaseRollTable
}

type BaseInventoryData = {
	stock: number
	lastUsed?: Date
}

type BaseUser = {
	twitchId: string
	name: string
	points: number
	inventory: Map<string, BaseInventoryData>
	lastSeen: Date
	isAdmin: boolean
	subTier: number
	isFollowing: boolean
	maxInventorySize: number
	level: number
	currentXp: number
}

type BaseCharacter = {
	archetypeImgUrl: string
	isActive: boolean
	level: number
	name: string
	portraitImgUrl: string
}

type BaseGlobals = {
	lastUsed?: Date
}

export { categories, rarities, gameTypes }
export type { Rarity, Category, GameType, BaseItem, BaseInventoryData, BaseUser, BaseGlobals, BaseCharacter, BaseRollTable }
