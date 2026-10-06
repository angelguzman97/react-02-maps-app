import { useContext, useLayoutEffect, useRef } from "react"
import { PlacesContext, MapContext } from "../context";
import { Loading } from "./";
import { Map } from "mapbox-gl";
export const MapView = () => {
    const { isLoading, userLocation } = useContext(PlacesContext);
    const { setMap } = useContext(MapContext);
    const mapDiv = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        if (!isLoading) {
            const map = new Map({
                container: mapDiv.current!, // Container ID
                style: 'mapbox://styles/mapbox/dark-v10', // style URL
                center: userLocation, // starting position [lng, lat]. Note that lat must be set between -90 and 90
                zoom: 14 // starting zoom
            });

            setMap(map);
        }

    }, [isLoading]);


    if (isLoading) {
        return (<Loading />)
    }
    return (
        <div ref={mapDiv}
            style={{
                height: '100vh',
                left: 0,
                top: 0,
                width: '100vw',
            }}
        >
            {userLocation?.join(',')}
        </div>
    )
}
