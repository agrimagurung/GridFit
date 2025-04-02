import { MongoClient, ServerApiVersion } from "mongodb";
import dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: './config.env' });

const uri = process.env.ATLAS_URI;
if (!uri) {
  throw new Error("Missing ATLAS_URI. Check your .env file.");
}

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let db; // Global variable to store the database instance

// Function to connect to the database
async function connectToDatabase() {
  try {
    // Connect to MongoDB
    await client.connect();
    await client.db("admin").command({ ping: 1 }); // Ping the admin database to verify connection
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    // Set the database to GridFit
    db = client.db("GridFit");
    console.log("Connected to the GridFit database.");
    return db; // Return the database instance
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1); // Exit the process if the connection fails
  }
}

// Function to get the database instance
function getDb() {
  if (!db) {
    throw new Error("Database not initialized. Call connectToDatabase first.");
  }
  return db;
}

export { connectToDatabase, getDb };
