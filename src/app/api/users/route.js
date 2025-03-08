import { connectToDatabase } from "@/../BACKEND/lib/mongodb";
import User from "@/../BACKEND/models/User";
import { generateKeys } from "@/../BACKEND/encryption.js";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const requestData = await req.json();
    console.log("Incoming request data:", requestData);

    await connectToDatabase();

    const { username, email, password } = requestData;

    // Validate required fields
    if (!username || !email || !password) {
      console.log("Missing required fields:", { username, email, password });
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    console.log("Existing user found:", existingUser);
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    // Destructure the incoming data. Use "let" so we can modify if needed.
    //let { username, email, password, kyberPriv, kyberPub, signPriv, signPub } = requestData;

    // generate key pairs before storing
    const {kyberPub, kyberPriv, signPub, signPriv} = generateKeys();  

    // Convert to Base64
    const kyberPub64 = Buffer.from(kyberPub).toString('base64');
    const kyberPriv64 = Buffer.from(kyberPriv).toString('base64');
    const signPub64 = Buffer.from(signPub).toString('base64');
    const signPriv64 = Buffer.from(signPriv).toString('base64');

    // Create and save the new user
    const newUser = new User({
      username,
      email,
      password,
      kyberPub : kyberPub64,
      kyberPriv : kyberPriv64,
      signPub : signPub64,
      signPriv : signPriv64
    });

    await newUser.save();
    console.log("New user created:", newUser);

    return NextResponse.json({ message: "User created successfully" }, { status: 201 });
  } catch (error) {
    console.error("Error in sign-up:", error);
    return NextResponse.json({ error: "Server error", details: error.message }, { status: 500 });
  }
}


export async function GET(req) {
  try {
    // start of GET 
    console.log("Incoming GET request:", req.url);

    const { searchParams } = new URL(req.url);
    const username = searchParams.get("username");
    const password = searchParams.get("password");

    console.log("Searching for user:", username);
    await connectToDatabase();

    // check log in
    if (!username || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    // check if MongoDB connection is working
    if (!User) {
      console.error("MongoDB UserModel is not defined.");
      return NextResponse.json({ error: "Database connection error" }, { status: 500 });
    }
    
    // find user in MongoDB
    const user = await User.findOne({ username }); // exclude password from response
    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // verify password: check directly for now
    if (password !== user.password) {
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    console.log("User found, sending full user object:", username);

    return NextResponse.json({
      username: user.username,
      email : user.email,
      password: user.password,
      //kyberPub: user.username+"----"+user.kyberPub, 
      kyberPub : user.kyberPub,
      kyberPriv: user.kyberPriv, 
      //signPub : user.username+"----"+user.signPub,
      signPub : user.signPub,
      signPriv : user.signPriv
  });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
