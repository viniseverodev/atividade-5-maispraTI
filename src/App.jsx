import { useState, useEffect } from "react"
import { Routes, Route } from "react-router-dom"
import RequestAPI from "./components/RequestAPI"
import Favoritos from "./components/Favoritos"

function App() {
  const [favorites, setFavorites] = useState(() => {
    const stored = localStorage.getItem("favorites")
    return stored ? JSON.parse(stored) : []
  })

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites))
  }, [favorites])

  const toggleFavorites = (movie) => {
    const isFavorite = favorites.some(fav => fav.id === movie.id)
    if (isFavorite) {
      setFavorites(favorites.filter(fav => fav.id !== movie.id))
    } else {
      setFavorites([...favorites, movie])
    }
  }

  return (
    <Routes>
      <Route
        path="/"
        element={<RequestAPI favorites={favorites} toggleFavoritesProp={toggleFavorites} />}
      />
      <Route
        path="/favoritos"
        element={<Favoritos favorites={favorites} toggleFavorites={toggleFavorites} />}
      />
    </Routes>
  )
}

export default App
