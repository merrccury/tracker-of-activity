"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const trackerSchema = new mongoose_1.Schema({
    employer: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
    start: mongoose_1.Schema.Types.Date,
    end: mongoose_1.Schema.Types.Date
});
exports.default = trackerSchema;
