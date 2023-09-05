import * as mongoose from 'mongoose';
import { EventEmitter } from 'events';

export const dbEvents = new EventEmitter();

let isConnected = false;

const handleCarChange = (change: any) => {
  switch (change.operationType) {
    case 'insert':
      dbEvents.emit('carInserted', change.fullDocument);
      break;
    case 'update':
      dbEvents.emit('carUpdated', change.fullDocument);
      break;
    case 'delete':
      dbEvents.emit('carDeleted', change.documentKey._id);
      break;
    default:
      console.log('Unhandled operation type:', change.operationType);
  }
};

export const connectToDB = async () => {
  mongoose.set('strictQuery', true);

  if (!process.env.MONGODB_URL) {
    return console.log('Missing MongoDB URL');
  }

  if (isConnected) {
    console.log('MongoDB connection already established');
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      dbName: 'TeamAlgoAlliance',
    });
    isConnected = true;

    const carChangeStream = mongoose.connection.collection('cars').watch();

    carChangeStream.on('change', handleCarChange);
    carChangeStream.on('error', (error: any) => {
      console.error('Error with carChangeStream:', error);
    });
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
};
