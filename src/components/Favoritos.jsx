import { useNavigate } from "react-router-dom"

function Favoritos({ favorites, toggleFavorites }) {
  const navigate = useNavigate()

  return (
    <div className="cardFora">
      <h2 className="favText">Meus Favoritos</h2>
      {favorites.length === 0 ? (
        <p>Você ainda não adicionou nenhum favorito.</p>
      ) : (
        <div className="cardFav">
          {favorites.map((movie) => (
            <div key={movie.id} className="favorite-card">
              <h3>{movie.title}</h3>
              <img src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} alt={movie.title} />
              <button className="btnPadrao" onClick={() => toggleFavorites(movie)}>Remover</button>
            </div>
          ))}
        </div>
      )}
      <button className="btnPadrao" onClick={() => navigate("/")}>Voltar</button>
    </div>
  )
}

export default Favoritos;