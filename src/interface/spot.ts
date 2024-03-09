import { ObjectId } from "mongodb";
import weather from "./weather";

export default interface spot {
    id?: ObjectId;
    name: string;
    coordinates: { lat: number; lon: number };
    weather: weather;
}