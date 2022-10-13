import { Schema, model } from "mongoose"
import type { Document, Model } from "mongoose"

import type { BaseGlobals } from "@la-vitrine-du-de/db-typings"

interface GlobalsDocument extends BaseGlobals, Document {}

type GlobalsModel = Model<GlobalsDocument>

const globalsSchema = new Schema<GlobalsDocument, GlobalsModel, BaseGlobals>(
	{
		lastUsed: Date
	},
	{ timestamps: true }
)

const globalsModel = model<GlobalsDocument, GlobalsModel>(
	"globals",
	globalsSchema
)

export { globalsModel }

export type { GlobalsDocument, GlobalsModel }
