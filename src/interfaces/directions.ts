export interface DirectionsResponse {
    code: string;
    waypoints: Waypoint[];
    routes: Route[];
    uuid: string;
}

export interface Route {
    geometry: Geometry;
    distance: number;
    duration: number;
    weight: number;
    weight_name: string;
    legs: Leg[];
}

export interface Geometry {
    type: string;
    coordinates: Array<number[]>;
}

export interface Leg {
    steps: any[];
    summary: string;
    distance: number;
    duration: number;
    weight: number;
    admins: Admin[];
    via_waypoints: any[];
}

export interface Admin {
    iso_3166_1: string;
    iso_3166_1_alpha3: string;
}

export interface Waypoint {
    location: number[];
    name: string;
    distance: number;
}
