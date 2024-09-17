// Filename: log.model.js
import mongoose from "mongoose";

const { Schema } = mongoose;

// Define the main log schema
const logSchema = new Schema({
    timestamp: { type: Date, default: Date.now },
    level: { type: String, enum: ['INFO', 'ERROR', 'SECURITY', 'DEBUG'], required: true },
    source: { type: String, enum: ['USER', 'SELLER', 'SYSTEM', 'PRODUCT', 'PAYMENT','ORDER'], required: true },
    message: { type: String, required: true },
    userId: { type: String, default: null },
    sellerId: { type: String, default: null },
    orderId: { type: String, default: null },
    ipAddress: { type: String, default: null },
    requestId: { type: String, default: null },
    additionalData: { type: Schema.Types.Mixed, default: null },
    action: { type: String, default: null },
    endpoint: { type: String, default: null },
    status: { type: String, default: null }
});

// Create the model from the schema
export const Log = mongoose.model('Log', logSchema);
