import React, { useEffect, useState } from "react";
import FilterDropdown from "../filter/FilterDropdown";
import MovieSection from "../movie-section/MovieSection";
import styles from "./Index.scss";
import apis from "../../../utils/movie";
import { Dropdown, Spinner } from "react-bootstrap";
import DropdownItem from "react-bootstrap/esm/DropdownItem";

function Index() {
  const [popularMovies, setPopularMovies] = useState({});
  const [topMovies, setTopMovies] = useState({});
  const [genreList, setGenreList] = useState({});
  const [isLoading, setLoading] = useState(true);


  useEffect(() => {
    const fetchMovies = async () => {
      const popular = await apis.getMovie("popular");
      const top = await apis.getMovie("top_rated");
      const allGenres = await apis.getListOfGenres();
      setPopularMovies(popular);
      setTopMovies(top);
      setGenreList(allGenres);
      setLoading(false);
    };
    
    fetchMovies();
  }, []);

  console.log("Loading Status:", isLoading)

  return (
    <div className="section">

      <h1>Browse Movies</h1>
      <div className="filter">
        {genreList.data && (
          <FilterDropdown dropdownGenres={genreList}/>
        )}
      </div>

      <div className="section">
        {popularMovies.data && (
          <MovieSection section={popularMovies.data.results} title="Popular" isLoading={isLoading} />
        )}
      </div>
      <div className="section">
        {topMovies.data && <MovieSection section={topMovies.data.results} title="Top Rated" isLoading={isLoading}/>}
      </div>
    </div>
  );
}

export default Index;
