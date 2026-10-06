
import { JSX } from "react/jsx-runtime";
import { PlacesContext } from "./PlacesContext";
import { useEffect, useReducer } from "react";
import { placesReducer } from "./placesReducer";
import { getUserLocation } from "../../helpers";
import { searchApi } from "../../apis";
import { Place, PlacesResponse, Suggestion } from "../../interfaces/places";
import axios from "axios";

export interface PlacesState {
  isLoading: boolean;
  userLocation?: [number, number];
  isLoadingPlaces: boolean;
  suggestions: Suggestion[];
  places: Place[]
}

const INITIAL_STATE: PlacesState = {
  isLoading: true,
  userLocation: undefined,
  isLoadingPlaces: false,
  suggestions: [],
  places: []
}
interface Props {
  children: JSX.Element | JSX.Element[]
}

export const PlacesProvider = ({ children }: Props) => {
  const [state, dispatch] = useReducer(placesReducer, INITIAL_STATE);
  useEffect(() => {
    getUserLocation().then(
      lngLat => dispatch({ type: 'setUserLocation', payload: lngLat })
    );
  }, []);

  const searchPlacesByTerm = async (query: string): Promise<Suggestion[]> => {
    if (query.length === 0) {
      dispatch({ type: 'setSuggestions', payload: [] })
      dispatch({ type: 'setPlaces', payload: [] })
      return [];
    }
    if (!state.userLocation) throw new Error("No hay ubicacion del usuario");

    dispatch({ type: 'setLoadingPlaces' });

    const resp = await searchApi.get<PlacesResponse>(`/suggest`, {
      params: {
        q: query,
        proximity: state.userLocation.join(','),
        limit: 5
      }
    });

    const suggestions = resp.data.suggestions;


    dispatch({ type: 'setSuggestions', payload: suggestions });

    // Buscar las coordenadas
    const places = await Promise.all(suggestions.map(async (suggest) => {
      const res = await searchApi.get(`/retrieve/${suggest.mapbox_id}`);
      const coordinates = res.data.features[0].geometry.coordinates;

      return {
        ...suggest,
        coordinates
      };
    })
    );

    dispatch({ type: 'setPlaces', payload: places });

    return resp.data.suggestions;
  }

  const selectPlace = async (suggestion: Suggestion): Promise<void> => {
    try {
      const res = await searchApi.get(
        `/retrieve/${suggestion.mapbox_id}`
      );

      console.log("Retrieve", res.data);

      const coordinates = res.data.features[0].geometry.coordinates;
      const place: Place = {
        ...suggestion,
        coordinates
      }
      console.log({ place });

      dispatch({ type: 'setPlaces', payload: [place] });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log('STATUS:', error.response?.status);
        console.log('DATA:', error.response?.data);
      } else {
        console.log(error);
      }
    }
  }

  return (
    <PlacesContext.Provider value={{
      //Props
      ...state,

      //Methods
      searchPlacesByTerm,
      selectPlace
    }}>
      {children}
    </PlacesContext.Provider>
  )
}
