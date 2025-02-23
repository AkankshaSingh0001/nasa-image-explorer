import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/Favorites.css";

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const navigate = useNavigate();

  // ✅ Fetch Favorite Data
  useEffect(() => {
    axios.get("http://localhost:5000/favorites")
      .then(response => setFavorites(response.data))
      .catch(error => console.error("Error fetching favorites:", error));
  }, []);

  // ✅ Remove from Favorites
  const removeFromFavorites = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/favorites/${id}`);
      setFavorites((prevFavorites) => prevFavorites.filter(item => item._id !== id));
    } catch (error) {
      console.error("Error removing favorite:", error);
    }
  };

  return (
    <div className="favorites-container">
      {!favorites.length ? (
        <p className="loading-text">No Favorites Yet...</p>
      ) : (
        <div className="grid-container">
          {favorites.map((item) => (
            <div key={item._id} className="card">
              <div className="card-content" onClick={() => navigate(`/detail/${item.originalId || item._id}`)}>
                <h2 className="title">{item.title}</h2>
                <p className="date">{item.date}</p>
                <img src={item.url} alt={item.title} className="image" />
                <p className="description">{item.explanation.slice(0, 100)}...</p>
              </div>
              <button className="remove-button" onClick={() => removeFromFavorites(item._id)}>
                ❌ Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
