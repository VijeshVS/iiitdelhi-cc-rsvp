import mongoose from 'mongoose';

interface MongooseConnection {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseConnection | undefined;
}

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

class MongoDBConnection {
  private static instance: MongoDBConnection;
  private connection: MongooseConnection;

  private constructor() {
    this.connection = global.mongoose || { conn: null, promise: null };

    if (!global.mongoose) {
      global.mongoose = this.connection;
    }
  }

  public static getInstance(): MongoDBConnection {
    if (!MongoDBConnection.instance) {
      MongoDBConnection.instance = new MongoDBConnection();
    }
    return MongoDBConnection.instance;
  }

  public async connect(): Promise<typeof mongoose> {
    if (this.connection.conn) {
      return this.connection.conn;
    }

    if (!this.connection.promise) {
      const opts = {
        bufferCommands: false,
      };

      this.connection.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
        console.log('MongoDB connected successfully');
        return mongoose;
      });
    }

    try {
      this.connection.conn = await this.connection.promise;
    } catch (e) {
      this.connection.promise = null;
      throw e;
    }

    return this.connection.conn;
  }
}

export default MongoDBConnection;
