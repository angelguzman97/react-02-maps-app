import { createContext } from "react";
import { Place, Suggestion } from "../../interfaces/places";

export interface PlacesContextProps {
    isLoading: boolean;
    userLocation?: [number, number];
    isLoadingPlaces: boolean;
    suggestions: Suggestion[];
    places: Place[];

    //Methods
    searchPlacesByTerm: (query: string) => Promise<Suggestion[]>;
    selectPlace: (suggestion: Suggestion) => Promise<void>;
}

export const PlacesContext = createContext<PlacesContextProps>({} as PlacesContextProps);