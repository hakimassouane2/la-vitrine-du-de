import { Schema, model } from "mongoose"
import type { Document, Model } from "mongoose"

import type { BaseCharacter } from "@la-vitrine-du-de/db-typings"

interface CharacterDocument extends BaseCharacter, Document {}

type CharacterModel = Model<CharacterDocument>

const characterSchema = new Schema<
	CharacterDocument,
	CharacterModel,
	BaseCharacter
>(
	{
		name: {
			type: String,
			required: true
		},
		isActive: {
			type: Boolean,
			required: true,
			default: false
		},
		archetypeImgUrl: {
			type: String,
			required: true
		},
		portraitImgUrl: {
			type: String,
			required: true
		},
		level: {
			type: Number,
			required: false,
			min: 1
		}
	},
	{ timestamps: true }
)

const characterModel = model<CharacterDocument, CharacterModel>(
	"character",
	characterSchema
)

export { characterModel }

export type { CharacterDocument, CharacterModel }
