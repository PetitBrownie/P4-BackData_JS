import express, { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { collections } from "../services/database.service";

export const spotRouter = express.Router();

spotRouter.use(express.json());

spotRouter.get("/", async (_req: Request, res: Response) => {
    try {
        // Call find with an empty filter object, meaning it returns all documents in the collection. Saves as Meteo array to take advantage of types
        const spot = await collections.spots.find({}).toArray();

        res.status(200).send(spot);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Example route: http://localhost:8080/spots/610aaf458025d42e7ca9fcd0
spotRouter.get("/:id", async (req: Request, res: Response) => {
    const id = req?.params?.id;

    try {
        // _id in MongoDB is an objectID type so we need to find our specific document by querying
        const query = { _id: new ObjectId(id) };
        const meteo = await collections.spots.findOne(query);

        if (meteo) {
            res.status(200).send(meteo);
        }
    } catch (error) {
        res.status(404).send(`Unable to find matching document with id: ${req.params.id}`);
    }
});

spotRouter.post("/", async (req: Request, res: Response) => {
    try {
        const newSpot = req.body;
        const result = await collections.spots.insertOne(newSpot);

        result
            ? res.status(201).send(`Successfully created a new spot with id ${result.insertedId}`)
            : res.status(500).send("Failed to create a new spot.");
    } catch (error) {
        console.error(error);
        res.status(400).send(error.message);
    }
});

spotRouter.put("/:id", async (req: Request, res: Response) => {
    const id = req?.params?.id;

    try {
        const updatedSpot = req.body;
        const query = { _id: new ObjectId(id) };
        // $set adds or updates all fields
        const result = await collections.spots.updateOne(query, { $set: updatedSpot });

        result
            ? res.status(200).send(`Successfully updated Spot with id ${id}`)
            : res.status(304).send(`Spot with id: ${id} not updated`);
    } catch (error) {
        console.error(error.message);
        res.status(400).send(error.message);
    }
});

spotRouter.delete("/:id", async (req: Request, res: Response) => {
    const id = req?.params?.id;

    try {
        const query = { _id: new ObjectId(id) };
        const result = await collections.spots.deleteOne(query);

        if (result && result.deletedCount) {
            res.status(202).send(`Successfully removed spot with id ${id}`);
        } else if (!result) {
            res.status(400).send(`Failed to remove spot with id ${id}`);
        } else if (!result.deletedCount) {
            res.status(404).send(`Spot with id ${id} does not exist`);
        }
    } catch (error) {
        console.error(error.message);
        res.status(400).send(error.message);
    }
});
