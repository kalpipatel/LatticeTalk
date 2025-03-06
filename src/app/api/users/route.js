import { connectToDatabase } from "@/../BACKEND/lib/mongodb";
import User from "@/../BACKEND/models/User";
import { generateKeys } from "@/../BACKEND/encryption.js";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const requestData = await req.json();
    console.log("Incoming request data:", requestData);

    await connectToDatabase();

    // Destructure the incoming data. Use "let" so we can modify if needed.
    let { username, email, password, kyberPriv, kyberPub, signPriv, signPub } = requestData;
    
    // If keys are not provided in the request, set default values.
    if (!kyberPub) kyberPub = "1";
    if (!kyberPriv) kyberPriv = "2";
    if (!signPub) signPub = "3";
    if (!signPriv) signPriv = "4";

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

    // Create and save the new user
    const newUser = new User({
      username,
      email,
      password,
      kyberPub,
      kyberPriv,
      signPub,
      signPriv
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
    await connectToDatabase();
    const url = new URL(req.url);
    console.log(url)
    const username = url.searchParams.get("username");
    const password = url.searchParams.get("password");

    if (!username || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    
    const existingUser = await User.findOne({ username , password });
    if (existingUser) {
      return NextResponse.json({ message: "Signed In Successfully" }, { status: 201 });
    } else {
      return NextResponse.json({ error: "User not found Sign in Unsuccessful" }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
