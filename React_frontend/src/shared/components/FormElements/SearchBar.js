import React, { useState, useEffect } from "react";
import './SearchBar.css';
import Avatar from "../UIElements/Avatar";
import AverageRating from "../UIElements/AverageRating";
import Aos from "aos";

const SearchBar = ({ onSelect }) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        Aos.init({
        duration: 500 
        });
    }, []);

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
        if (query.trim() !== "") {
            fetch(
            `${process.env.REACT_APP_BACKEND_URL}/places/search?q=${query}`
            )
            .then((res) => res.json())
            .then((data) => {
                setSuggestions(Array.isArray(data.places) ? data.places : []);
                setShowDropdown(true);
            });
        } else {
            setSuggestions([]);
            setShowDropdown(false);
        }
        }, 300);

        return () => clearTimeout(delayDebounce);
    }, [query]);

    const handleSelect = (place) => {
        onSelect(place);
        setQuery("");
        setSuggestions([]);
        setShowDropdown(false);
    };

    return (
        <div className="search-bar" data-aos="fade-left">
            <input
                type="text"
                placeholder="Search destinations..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => query && setShowDropdown(true)}
                onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
            />
            {showDropdown && suggestions?.length > 0 && (
                <ul className="dropdown" data-aos="slide-down">
                {suggestions.map((place) => (
                    <li key={place.id} onMouseDown={() => handleSelect(place)}>
                        <div className="search-item flex">
                            <Avatar image={`${process.env.REACT_APP_ASSETS_URL}${place.images[0]}`} alt={place.title}></Avatar>
                            <div className="place-details">
                                <h5>{place.title}</h5>
                                <AverageRating averageRating={place.averageRating}></AverageRating>
                            </div>
                        </div>
                    </li>
                ))}
                </ul>
            )}
        </div>
    );
};

export default SearchBar;
