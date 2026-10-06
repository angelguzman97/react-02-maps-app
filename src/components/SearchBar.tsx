import { ChangeEvent, useContext, useRef } from "react"
import { PlacesContext } from "../context";
import { SearchResults } from ".";

export const SearchBar = () => {
    const debounceRef = useRef<NodeJS.Timeout>(null);
    const { searchPlacesByTerm } = useContext(PlacesContext);
    const onQueryChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        debounceRef.current = setTimeout(() => {
            console.log('debounced value:', event.target.value);
            const value = event.target.value;
            searchPlacesByTerm(value)

        }, 350);
    }

    return (
        <div className="search-container">
            <input type="text"
                className="form-control"
                placeholder="Buscar lugar..."
                onChange={onQueryChange}
            />
            <SearchResults />
        </div>
    )
}
