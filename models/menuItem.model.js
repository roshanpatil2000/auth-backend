import mongoose from "mongoose";

const modifierSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true,
            default: 0
        }
    },
    { _id: true }
)

const meniItemSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        categoryId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: false
        },

        price: {
            type: Number,
            required: true
        },

        taxPercent: {
            type: Number,
            default: 0
        },

        description: {
            type: String,
            trim: true
        },

        imageUrl: {
            type: String
        },

        isAvailable: {
            type: Boolean,
            default: true
        },

        modifiers: [modifierSchema],

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    },
    { timestamps: true }
)

export const Menu = mongoose.model("menuItem", meniItemSchema);
