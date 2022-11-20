import { ChangeEvent, FormEvent, useState } from "react";
import { SearchData } from "../../interfaces/home";
import fetchApiData from "../../utils";
import { resultIsError } from "../../utils";
import ErrorMessage from "../errorMessage";

import Card from "../card/card"
import Spinner from "../spinner/spinner";

import SearchIllustration from "../searchIllustration";
import SearchIcon from '../../assets/1.Icons/icon-magnifier-grey.svg';

import './home.css'

export default function Home() {
    const [searchVal, setSearchVal] = useState('');
    const [results, setResults] = useState<SearchData[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showIllustration, setShowIllustration] = useState(true);

    async function searchApi(search: string) {
        if (search.trim() === '') {
            alert('Search cannot be empty!');
            return;
        }
        setShowIllustration(false);
        setError('');
        setResults([]);
        setLoading(true);
        const url = `http://www.omdbapi.com/?apikey=b02d2b50&s=${search}`;
        const { data, error: fetchError } = await fetchApiData<SearchData[]>(url);
        setLoading(false);

        if (fetchError) {
            setError(fetchError);
        } else if (resultIsError(data)) {
            setError(data.Error);
        } else {
            setResults(data);
        }
    }

    const onSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSearchVal(event.target.value);
    }
    
    const onSearchHandler = (event: FormEvent) => {
        event.preventDefault();
        searchApi(searchVal)
    }

    return (
        <>
            <form id="search-form" className="search-form" onSubmit={e => onSearchHandler(e)}>
                <span className="search-icon">
                    <img src={SearchIcon} alt="icon" />
                </span>
                <input className="search-input" type="text" placeholder="Search movies..." value={searchVal} onChange={e => onSearchChange(e)} />
            </form>

            {showIllustration ?
            <SearchIllustration />
            : null}
            
            {loading ?
                <Spinner />
            : null}
            
            {error ?
                <ErrorMessage message={`There was an error with your search: ${error}`} />
            : null}
            
            {!loading && !error ?
                <div className="results-wrapper">
                    {results?.map((item: SearchData, index) => {
                        return <Card key={index} imdbID={item.imdbID} title={item.Title} year={item.Year} poster={item.Poster}  />
                    })}
                </div>
            : null}
        </>
    )
}