import mongoose from "mongoose";

// structure for how user data will be stored in the database
const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },  
  publicKey: { type: String, required: true },  // Store public key for encryption
});

// checks if the User already exists in mongoose.models, otherwise creates one
export default mongoose.models.User || mongoose.model("User", UserSchema);
