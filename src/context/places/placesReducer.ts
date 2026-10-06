import { Place, Suggestion } from "../../interfaces/places";
import { PlacesState } from "./PlacesProvider";

type PlacesAction = { type: 'setUserLocation', payload: [number, number] }
    | { type: 'setPlaces', payload: Place[] }
    | { type: 'setSuggestions', payload: Suggestion[] }
    | { type: 'setLoadingPlaces' };

export const placesReducer = (state: PlacesState, action: PlacesAction): PlacesState => {
    switch (action.type) {
        case 'setUserLocation':

            return {
                ...state,
                isLoading: false,
                userLocation: action.payload
            };

        case 'setLoadingPlaces':
            return {
                ...state,
                isLoadingPlaces: true,
                places: []
            }
        case 'setSuggestions':
            return {
                ...state,
                isLoadingPlaces: false,
                suggestions: action.payload,
            }
        case 'setPlaces':
            return {
                ...state,
                isLoadingPlaces: false,
                places: action.payload,
            }

        default:
            return state;
    }
}