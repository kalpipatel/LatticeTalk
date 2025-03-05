import mongoose from "mongoose";

// structure for how user data will be stored in the database
const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },  
  kyberPubKey: { type: String, required: true },
  kyberPrivKey: { type: String, required: true },
  signPubKey: { type: String, required: true },
  signPrivKey: { type: String, required: true },
});

// checks if the User already exists in mongoose.models, otherwise creates one
export default mongoose.models.User || mongoose.model("User", UserSchema);
