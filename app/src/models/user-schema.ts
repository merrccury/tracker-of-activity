import { Schema } from "mongoose";

const userSchema = new Schema({
    username: Schema.Types.String,
    password: Schema.Types.String
});

export default userSchema;