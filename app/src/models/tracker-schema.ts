import {Schema} from "mongoose";

const trackerSchema = new Schema({
    employer: {type: Schema.Types.ObjectId, ref: 'User'},
    start: Schema.Types.Date,
    end: Schema.Types.Date
});

export default trackerSchema;