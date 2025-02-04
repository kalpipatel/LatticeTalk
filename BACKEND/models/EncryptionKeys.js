import mongoose from "mongoose";

const KeySchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    kyberPublicKey: { type: String, required: true },
    kyberPrivateKey: { type: String, required: true }, 
    signingPublicKey: { type: String, required: true }, 
    signingPrivateKey: { type: String, required: true },
  });


export default mongoose.models.Key || mongoose.model("Key", KeySchema);
