import { Trip } from './interfaces/trip';

export function checkIATA(code: string): boolean {
    const possibleCodes = [
        "ATL", "PEK", "LAX", "DXB", "HND", "ORD", "LHR", "PVG", "CDG", "DFW",
        "AMS", "FRA", "IST", "CAN", "JFK", "SIN", "DEN", "ICN", "BKK", "SFO",
        "LAS", "CLT", "MIA", "KUL", "SEA", "MUC", "EWR", "MAD", "HKG", "MCO",
        "PHX", "IAH", "SYD", "MEL", "GRU", "YYZ", "LGW", "BCN", "MAN", "BOM",
        "DEL", "ZRH", "SVO", "DME", "JNB", "ARN", "OSL", "CPH", "HEL", "VIE"
    ];
    return possibleCodes.includes(code);
}

export function checkSortType(sortType: string): boolean {
    const possibleSortTypes = ["fastest", "cheapest"];
    return possibleSortTypes.includes(sortType);
}

export function sortByFastest(trips: Trip[]): Trip[] {
    trips.sort((a, b) => a.duration - b.duration);
    return trips;
}

export function sortByCheapest(trips: Trip[]): Trip[] {
    trips.sort((a, b) => a.cost - b.cost);
    return trips;
}