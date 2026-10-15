/* eslint import/no-webpack-loader-syntax: off */

//@ts-ignore
import { AnySourceData, LngLatBounds, Map, Marker, Popup } from "!mapbox-gl";

import { directionsApi } from "../../apis";
import { DirectionsResponse } from "../../interfaces/directions";
import { JSX, useContext, useEffect, useReducer } from "react";
import { MapContext } from "./MapContext";
import { mapReducer } from "./mapReducer";
import { PlacesContext } from "../";

export interface MapState {
    isMapReady: boolean;
    map?: Map;
    markers: Marker[];
}

interface Props {
    children?: JSX.Element | JSX.Element[];
}

const INITIAL_STATE: MapState = {
    isMapReady: false,
    map: undefined,
    markers: []
}

export const MapProvider = ({ children }: Props) => {
    const [state, dispatch] = useReducer(mapReducer, INITIAL_STATE);
    const { places } = useContext(PlacesContext);

    useEffect(() => {

        if (places.length === 0) {
            if (state.map?.getLayer("RouteString")) {
                state.map?.removeLayer("RouteString");
            }
            if (state.map?.getSource("RouteString")) {
                state.map.removeSource("RouteString");
            }

            dispatch({ type: "setMarkers", payload: [] });
            return;
        }

        state.markers.forEach(marker => marker.remove()); // Eliminar markers
        const newMarkers: Marker[] = [];

        for (const place of places) {
            console.log('place:', place);
            console.log('coordinates:', place.coordinates);
            const [lng, lat] = place.coordinates;
            const popup = new Popup()
                .setHTML(`
                <h6>${place.name}</h6>
                <p>${place.place_formatted}</p>
                `);

            const newMarker = new Marker()
                .setPopup(popup)
                .setLngLat([lng, lat])
                .addTo(state.map!);

            newMarkers.push(newMarker);

        }
        // todo: limpiar polyne
        dispatch({ type: 'setMarkers', payload: newMarkers });

        // todo
    }, [places]);

    const setMap = (map: Map) => {

        // popup
        const myLocationPopup = new Popup()
            .setHTML(`
            <h4>$Aquí estoy</h4>
            <p>En algún lugar del mundo</p>
            `);

        // Marcador
        new Marker({
            color: '#61DAFB'
        })
            .setLngLat(map.getCenter())
            .setPopup(myLocationPopup)
            .addTo(map);

        dispatch({ type: 'setMap', payload: map })
    };

    //
    const getRouteBetweenPoints = async (start: [number, number], end: [number, number]) => {
        if (
            !Array.isArray(start) ||
            !Array.isArray(end) ||
            start.length !== 2 ||
            end.length !== 2 ||
            ![...start, ...end].every(
                coord => typeof coord === "number" && Number.isFinite(coord)
            )
        ) {
            console.error("Coordenadas de inicio o destino inválidas", {
                start,
                end
            });
            return;
        }
        const resp = await directionsApi.get<DirectionsResponse>(`/${start.join(',')};${end.join(',')}`);
        const { distance, duration, geometry } = resp.data.routes[0];
        const { coordinates: coords } = geometry;
        let kms = distance / 1000;
        kms = Math.round(kms * 100);
        kms /= 100;

        Math.floor(duration / 60);

        const bounds = new LngLatBounds();
        bounds.extend(start);
        bounds.extend(end);
        for (const coord of coords) {
            if (Array.isArray(coord) && coord.length >= 2 && Number.isFinite(coord[0]) && Number.isFinite(coord[1])) {
                bounds.extend([coord[0], coord[1]]);
            } else {
                console.error("Coordenadas inválida de Directions:", coord);

            }
        }

        if (!bounds.isEmpty() && state.map) {
            const boundsArray = bounds.toArray();

            state.map.fitBounds(boundsArray, {
                padding: 200
            })
        }


        // Definicion de Polyline
        const sourceData: AnySourceData = {
            type: 'geojson',
            data: {
                type: 'FeatureCollection',
                features: [
                    {
                        type: 'Feature',
                        properties: {},
                        geometry: {
                            type: 'LineString',
                            coordinates: coords

                        }
                    }
                ]
            }
        };
        // todo:remover polyline si existe
        if (state.map?.getLayer('RouteString')) {
            state.map.removeLayer('RouteString');
            state.map.removeSource('RouteString');
        }

        state.map?.addSource('RouteString', sourceData);
        state.map?.addLayer({
            id: 'RouteString',
            type: 'line',
            source: 'RouteString',
            layout: {
                'line-cap': 'round',
                'line-join': 'round'
            },
            paint: {
                'line-color': 'black',
                'line-width': 3
            }
        });
    }


    return (
        <MapContext.Provider value={{
            ...state,
            //method
            setMap,
            getRouteBetweenPoints,
        }}>
            {children}
        </MapContext.Provider>
    )
}
