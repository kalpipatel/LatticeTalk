//change based on how to get to on ur computer
import { connectToDatabase } from "@/../BACKEND/lib/mongodb";
import User from "@/../BACKEND/models/User";
import { NextResponse } from "next/server";


export async function POST(req) {
  try {
    await connectToDatabase();
    const { username, email, password , kyberPub,kyberPriv,signPub,signPriv} = await req.json();

    if (!username || !email || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }


    const newUser = new User({ username, email, password });
    await newUser.save();

    return NextResponse.json({ message: "User created successfully" }, { status: 201 });
  } catch (error) {
    console.error("Error in sign-up:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
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

    
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return NextResponse.json({ message: "Signed In Successfully" }, { status: 201 });
    } else {
      return NextResponse.json({ error: "User not found Sign in Unsuccessful" }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
