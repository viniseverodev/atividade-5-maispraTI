import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { HiStar } from "react-icons/hi2";
import axios from "axios";
import "../styles/styles.css";

const RequestAPI = ({ favorites, toggleFavoritesProp }) => {
  const [inputUser, setInputUser] = useState("");
  const [moovies, setMoovies] = useState([]);
  const [page, setPage] = useState(1);
  const [pageAtt, setPageAtt] = useState("");
  const [totalPages, setTotalPAges] = useState(0);
  const [SelectedMoovie, setSelectedMoovie] = useState(null);
  const [details, setDetails] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const getMoovies = async (page, currentPage) => {
    if (!page) return;

    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(
        `https://api.themoviedb.org/3/search/movie?query=${page}&language=pt-br&page=${currentPage}`,
        {
          headers: {
            accept: "application/json",
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3ODZhMjY5MGQ2NTQ0MzgzZjJjOGY0OThjMjQ3MjJmZiIsIm5iZiI6MTc1MjAxODkyMS4zNDYsInN1YiI6IjY4NmRhZmU5MzNkYzdiZjNmYjZlOGFlMCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.0rU0YVgFNtoZiFR6LpL1gE7vlzDC0nFQkKVja287hNQ",
          },
        }
      );

      setMoovies(response.data.results);
      setTotalPAges(response.data.total_pages || 0);
      setLoading(false);
      setInputUser("");

      console.log(response.data.results);
    } catch (error) {
      setError(`Erro ao buscar filme: ${error}.`);
      setMoovies([]);
      setTotalPAges(0);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (pageAtt) {
      getMoovies(pageAtt, page);
    }
  }, [page, pageAtt]);

  const handleBuscar = () => {
    const page = inputUser.trim();
    setPage(1);
    setPageAtt(page);
  };

  const toggleFavorite = (movie) => {
    const isFavorite = favorites.some(fav => fav.id === movie.id)

    if (isFavorite) {
      setFavorites(favorites.filter(fav => fav.id !== movie.id))
    } else {
      setFavorites([...favorites, movie])
    }
  }

  const handleVerDetalhes = async (movie) => {
    setSelectedMoovie(movie);
    setDetails(null);
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/movie/${movie.id}?append_to_response=credits&language=pt-BR`,
        {
          headers: {
            accept: "application/json",
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3ODZhMjY5MGQ2NTQ0MzgzZjJjOGY0OThjMjQ3MjJmZiIsIm5iZiI6MTc1MjAxODkyMS4zNDYsInN1YiI6IjY4NmRhZmU5MzNkYzdiZjNmYjZlOGFlMCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.0rU0YVgFNtoZiFR6LpL1gE7vlzDC0nFQkKVja287hNQ",
          },
        }
      );
      setDetails(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="search">
        <h1>Buscador de filmes</h1>

        <label htmlFor="film">Busque pelo seu filme:</label>
        <input
          type="text"
          value={inputUser}
          onChange={(ev) => setInputUser(ev.target.value)}
        />
        <button onClick={handleBuscar} className="buscar">
          Buscar
        </button>
        <button className="btnPadrao" onClick={() => navigate("/favoritos")}>
          Favoritos
        </button>
      </div>

      <div>
        <ul className="lista">
          {moovies.length > 0 ? (
            moovies.map((moovie) => (
              <li key={moovie.id} className="card">
                <h3>{moovie.title}</h3>
                <img
                  src={`http://image.tmdb.org/t/p/w500${moovie.poster_path}`}
                  alt={`moovie.title`}
                />
                <p>{moovie.overview}</p>
                <button
                  className="btnPadrao"
                  onClick={() => handleVerDetalhes(moovie)}
                >
                  Ver detalhes
                </button>
              </li>
            ))
          ) : (
            <p></p>
          )}
        </ul>
        <div className="pages">
          <button
            className="btnPadrao margin-right"
            onClick={() => {
              if (page > 1) {
                setPage(page - 1);
              }
            }}
            disabled={page === 1 || loading}
          >
            Página anterior
          </button>

          <span>
            Pagina {page} de {totalPages}
          </span>

          <button
            className="btnPadrao margin-left"
            onClick={() => {
              setPage(page + 1);
            }}
            disabled={page >= totalPages || loading}
          >
            Próxima página
          </button>
        </div>
      </div>

      {SelectedMoovie && details && (
        <div className="modal">
          <div className="modal-content">
            <span className="iconStar" onClick={() => toggleFavoritesProp(SelectedMoovie)}><HiStar />{favorites.some(fav => fav.id === SelectedMoovie.id) ? "" : ""}</span>
            {details ? (
              <>
                <h3>Diretor: {details.credits?.crew?.find(c => c.job === "Director")?.name || "-"}</h3>
                <h4>Elenco:</h4>
                <ul>
                  {details.credits.cast.slice(0, 5).map((actor) => (
                    <li key={actor.id}>
                      {actor.name} como {actor.character}
                    </li>
                  ))}
                </ul>
                <p><strong>Sinopse:</strong> {details.overview}</p>
                <p><strong>Avaliação:</strong> {details.vote_average}</p>
              </>
            ) : (
              <p>Carregando detalhes...</p>
            )}

            <button className="btnPadrao" onClick={() => { setSelectedMoovie(null); setDetails(null); }}>Fechar</button>

            <div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RequestAPI;
