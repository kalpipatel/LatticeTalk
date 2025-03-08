// Import necessary modules
import { connectToDatabase } from "../../../../BACKEND/lib/mongodb";
import User from "../../../../BACKEND/models/User";
import { NextResponse } from "next/server";

// GET method to search users based on a query
export async function GET(req) {
  await connectToDatabase(); // Ensure database connection
  
  // Get the query parameter from the URL
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query"); // This will hold the search term

  // If no query is provided, return an error message
  if (!query) {
    return NextResponse.json({ error: "Query parameter is required" }, { status: 400 });
  }

  try {
    // Search for users whose username contains the query string
    const users = await User.find({
      username: { $regex: query, $options: "i" }, // Case-insensitive regex search
    });

    // If no users match the query, return a message
    if (users.length === 0) {
      return NextResponse.json({ message: "No users found" }, { status: 404 });
    }

    // Return the users that match the query
    return NextResponse.json({ users });
    
  } catch (error) {
    // Handle any errors that occur during the database operation
    console.error("Error fetching users:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
