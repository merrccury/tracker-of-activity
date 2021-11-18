"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    username: mongoose_1.Schema.Types.String,
    password: mongoose_1.Schema.Types.String
});
exports.default = userSchema;
