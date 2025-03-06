import mongoose from "mongoose";

const FileSchema = new mongoose.Schema({
    sender: { type: String, required: true },
    receiver: { type: String, required: true },
    filename: {type: String,required: false},
    filetype: {type: String,required: false},
    size: {type: Number,required: false},
    file: {type: Buffer,required: false},
    ciphertextKem: {type: Buffer,required: false},
    encSharedSecret: {type: String,required: false},
    Timestamp: {type: Date, default: Date.now}
});

export default mongoose.models.File || mongoose.model("File", FileSchema);
