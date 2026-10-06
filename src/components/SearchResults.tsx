import { useContext, useState } from 'react'
import { MapContext, PlacesContext } from '../context';
import { LoadingPlaces } from './LoadingPlaces';
import { Place } from '../interfaces/places';

export const SearchResults = () => {
    const { isLoadingPlaces, places, userLocation } = useContext(PlacesContext);
    const { map, getRouteBetweenPoints } = useContext(MapContext);
    const [activeId, setActiveId] = useState('');

    const getRoute = (place: Place) =>{
        if(!userLocation) return;
        const [lng, lat] = place.coordinates;

        getRouteBetweenPoints(userLocation, [lng, lat]);
    }

    if (isLoadingPlaces) {

        return <LoadingPlaces />;
    }
    if (places.length === 0) return <></>

    const onPlaceClicked = (place: Place) => {
        setActiveId(place.mapbox_id);
        const [lng, lat] = place.coordinates;

        map?.flyTo({
            zoom: 14,
            center: [lng, lat],
        })
    }

    return (
        <ul className='list-group mt-3'>

            {
                places.map(place => (

                    <li
                        key={place.mapbox_id}
                        className={`list-group-item list-group-item-action pointer ${(activeId === place.mapbox_id) && 'active'}`}
                        onClick={() => onPlaceClicked(place)}>
                        <h6>{place.name}</h6>
                        <p
                            style={{
                                fontSize: '12px'
                            }}
                        >
                            {place.place_formatted}
                        </p>
                        <button onClick={()=> getRoute(place)} className={`btn ${activeId === place.mapbox_id ? 'btn-outline-light' : 'btn-outline-primary'} btn-sm`}>
                            Direcciones
                        </button>
                    </li>
                ))
            }

        </ul>
    )
}
