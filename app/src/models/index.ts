import userSchema from "./user-schema";
import trackerSchema from "./tracker-schema";
import mongoose from "mongoose";

(async () => {
    await mongoose.connect(`mongodb://${process.env.mongo}:${process.env.mongoPort}/trackerOfActivity`);
})();

export const User = mongoose.model('User', userSchema);
export const Tracker = mongoose.model('Tracker', trackerSchema);

