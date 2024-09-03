import mongoose, { Document, Schema } from 'mongoose';

import { Trip } from '../interfaces/trip'; // Import the Trip interface

export interface IFavorites extends Document {
    username: string;
    trips: Trip[]; // Use the Trip interface for the trips array
}

const TripSchema: Schema = new Schema({
    type: { type: String, required: true },
    id: { type: String, required: true, unique: true },
    display_name: { type: String, required: true },
    destination: { type: String, required: true },
    origin: { type: String, required: true },
    duration: { type: Number, required: true },
    cost: { type: Number, required: true },
});

const FavoritesSchema: Schema = new Schema({
    username: { type: String, required: true, unique: true },
    trips: [TripSchema]
});

export const Favorites = mongoose.model<IFavorites>('Favorites', FavoritesSchema);
