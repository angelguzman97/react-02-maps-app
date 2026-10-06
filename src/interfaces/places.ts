export interface PlacesResponse {
    suggestions: Suggestion[];
    attribution: string;
    response_id: string;
}

export interface Place extends Suggestion {
    coordinates: [number, number];
}

export interface Suggestion {
    name: string;
    mapbox_id: string;
    feature_type: string;
    place_formatted: string;
    context: Context;
    language: string;
    maki: string;
    metadata: Metadata;
    distance: number;
    address?: string;
    full_address?: string;
    poi_category?: string[];
    poi_category_ids?: string[];
    external_ids?: ExternalIDS;
    name_local?: NameLocal;
}

export interface Context {
    country: Country;
    region?: Region;
    postcode?: ContextPlace;
    place?: ContextPlace;
    street?: Street;
    address?: Address;
}

export interface Address {
    name: string;
    address_number: string;
    street_name: string;
}

export interface Country {
    id?: string;
    name: string;
    country_code: string;
    country_code_alpha_3: string;
}

export interface ContextPlace {
    id: string;
    name: string;
}

export interface Region {
    id: string;
    name: string;
    region_code: string;
    region_code_full: string;
}

export interface Street {
    name: string;
}

export interface ExternalIDS {
    dataplor: string;
}

export interface Metadata {
}

export interface NameLocal {
    es: string;
}
