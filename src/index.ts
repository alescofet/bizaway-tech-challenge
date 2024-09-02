import express, { Request, Response } from 'express';

import { Trip } from './interfaces/trip';

require('dotenv').config()
const app = express();
const port = 3000;

function checkIATA(code: string): boolean {
    const possibleCodes = [
        "ATL", "PEK", "LAX", "DXB", "HND", "ORD", "LHR", "PVG", "CDG", "DFW",
        "AMS", "FRA", "IST", "CAN", "JFK", "SIN", "DEN", "ICN", "BKK", "SFO",
        "LAS", "CLT", "MIA", "KUL", "SEA", "MUC", "EWR", "MAD", "HKG", "MCO",
        "PHX", "IAH", "SYD", "MEL", "GRU", "YYZ", "LGW", "BCN", "MAN", "BOM",
        "DEL", "ZRH", "SVO", "DME", "JNB", "ARN", "OSL", "CPH", "HEL", "VIE"
    ]
    return possibleCodes.includes(code)
}

function checkSortType(sortType: string): boolean {
    const possibleSortTypes = ["fastest", "cheapest"]
    return possibleSortTypes.includes(sortType)
}

function sortByFastest(trips: Trip[]): Trip[]{
    trips.sort((a,b) => a.duration - b.duration)
    return trips
}

function sortByCheapest(trips: Trip[]): Trip[]{
    trips.sort((a,b) => a.cost - b.cost)
    return trips
}


app.get('/trips', async (req: Request, res: Response): Promise<void>  => {
    const queryParams: {destination: string, origin: string, sort_by:string} = {
        destination: typeof req.query.destination === 'string' ? req.query.destination : "",
        origin: typeof req.query.origin === 'string' ? req.query.origin : "",
        sort_by: typeof req.query.sort_by === 'string' ? req.query.sort_by : ""
    }

    //Check for invalid or faulting params
    if(!queryParams.destination || queryParams.destination === "" || !checkIATA(queryParams.destination)){
        res.send("You must provide a valid destination")
        return
    }
    if(!queryParams.origin || queryParams.origin === "" || !checkIATA(queryParams.origin)){
        res.send("You must provide a valid origin")
        return
    }
    if(!queryParams.sort_by || queryParams.sort_by === "" || !checkSortType(queryParams.sort_by)){
        res.send("You must provide a valid sort order")
        return
    }

    //API call
    const response = await fetch(`https://z0qw1e7jpd.execute-api.eu-west-1.amazonaws.com/default/trips?destination=${queryParams.destination}&origin=${queryParams.origin}`, {
        method: 'GET',
        headers: {
            'x-api-key': process.env.API_KEY ?? "",
            'Content-Type': "application/json"
        }
    })
    try {
        if (!response.ok) {
            throw new Error(`Error while fetching: ${response.statusText}`);
        }
        const data: Trip[] = await response.json();
        if(queryParams.sort_by === "fastest"){
            res.send(sortByFastest(data)) //sort by fastest
        }
        if(queryParams.sort_by === "cheapest"){
            res.send(sortByCheapest(data)) //sort by cheapest
        }
    } catch (error: any) {
        console.error(error);
        res.send(error.toString())
    }
});

/* app.post('/tripManager/save', async (req: Request, res: Response): Promise<void>  => {

}) */

/* app.get('/tripManager/list', async (req: Request, res: Response): Promise<void>  => {

}) */

/* app.delete('/tripManager/delete', async (req: Request, res: Response): Promise<void>  => {

}) */

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
