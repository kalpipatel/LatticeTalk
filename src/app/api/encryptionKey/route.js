import { connectToDatabase } from "@/lib/mongodb";
import EncryptionKey from "@/models/EncryptionKey";
import { NextResponse } from "next/server";

export async function POST(req) {
  await connectToDatabase();
  try {
    const { user, kyberPublicKey, kyberPrivateKey, signingPublicKey, signingPrivateKey } = await req.json();

    const keyExists = await EncryptionKey.findOne({ user });
    if (keyExists) {
      return NextResponse.json({ error: "Key already exists" }, { status: 400 });
    }

    const newKey = new EncryptionKey({ user, kyberPublicKey, kyberPrivateKey, signingPublicKey, signingPrivateKey });
    await newKey.save();

    return NextResponse.json({ message: "Keys stored successfully", key: newKey });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  await connectToDatabase();
  const keys = await EncryptionKey.find();
  return NextResponse.json(keys);
}
