import mongoose from "mongoose";

const modifierSchema = new mongoose.Schema({
    name: { type: String, require: true },
    price: { type: Number, require: true, default: 0 },
})

const meniItemSchema = new mongoose.Schema({
    name: { type: String, require: true },
    price: { type: Number, required: true },
    description: { type: String },
    imageUrl: { type: String },
    isAvailable: { type: Boolean, default: true },
    modifiers: [modifierSchema],  // add-ons (extra cheese, toppings)
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, {
    timestamps: true
})

export const Menu = mongoose.model("menuItem", meniItemSchema);
