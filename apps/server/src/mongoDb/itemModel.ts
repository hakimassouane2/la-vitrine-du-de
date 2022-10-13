import { Schema, Types, model } from "mongoose"
import type { Document, Model } from "mongoose"

import { rarities, categories, gameTypes } from "@la-vitrine-du-de/db-typings"
import type { BaseItem } from "@la-vitrine-du-de/db-typings"

interface ItemDocument extends BaseItem, Document {}

type ItemModel = Model<ItemDocument>

const itemSchema = new Schema<ItemDocument, ItemModel, BaseItem>(
	{
		name: {
			type: String,
			unique: true,
			required: true
		},
		description: {
			type: String,
			required: true
		},
		imageUrl: {
			type: String,
			required: true
		},
		price: {
			type: Number,
			required: true,
			min: 1
		},
		targettable: Boolean,
		globalCooldown: {
			type: Number,
			required: true,
			default: 0,
			min: 0
		},
		userCooldown: {
			type: Number,
			required: true,
			default: 0,
			min: 0
		},
		lastUsed: Date,
		rarity: {
			type: Number,
			default: 0,
			min: 0,
			max: rarities.length - 1
		},
		category: {
			type: Number,
			default: 0,
			min: 0,
			max: categories.length - 1
		},
		isActive: Boolean,
		gameType: {
			type: Number,
			default: 0,
			min: 0,
			max: gameTypes.length - 1
		},
		isRollable: Boolean,
		rollTable: {
			type: Types.ObjectId,
			ref: 'RollTable'
		}
	},
	{ timestamps: true }
)

const itemModel = model<ItemDocument, ItemModel>("item", itemSchema)

export { itemModel }

export type { ItemDocument, ItemModel }
