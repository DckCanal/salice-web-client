import mongoose from "mongoose";

const connString = process.env.DATABASE_URI.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

if (!connString) {
  throw new Error(
    "Database connection params are not defined as environment variables. Please define DATABASE_URI and DATABASE_PASSOWRD"
  );
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    const opts = {
      useNewUrlParser: true,
    };
    cached.promise = mongoose.connect(connString, opts).then((mongoose) => {
      return mongoose;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;
