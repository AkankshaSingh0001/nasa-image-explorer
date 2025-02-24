import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/PastData.css";

const PastData = () => {
  const [pastData, setPastData] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const navigate = useNavigate();
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

  // ✅ Fetch past data
  useEffect(() => {
    axios.get(`${API_BASE_URL}/getPastData`)
      .then(response => setPastData(response.data))
      .catch(error => console.error("Error fetching past data:", error));

    // ✅ Fetch favorites on load
    axios.get(`${API_BASE_URL}/favorites`)
      .then(response => setFavorites(response.data.map(fav => fav.originalId)))
      .catch(error => console.error("Error fetching favorites:", error));
  }, []);

  // ✅ Check if item is in favorites
  const isFavorite = (id) => favorites.includes(id);

  // ✅ Add to favorites
  const addToFavorites = async (item) => {
    try {
      const favoriteData = {
        originalId: item._id,
        title: item.title,
        date: item.date,
        url: item.url,
        explanation: item.explanation,
      };

      await axios.post(`${API_BASE_URL}/favorites`, favoriteData);
      setFavorites([...favorites, item._id]); // ✅ Update state
    } catch (error) {
      console.error("Error adding to favorites:", error);
    }
  };

  return (
    <div className="past-data-container">
      {!pastData.length ? (
        <p className="loading-text">Loading Past Data...</p>
      ) : (
        <div className="grid-container">
          {pastData.map((item) => (
            <div key={item._id} className="card">
              <div className="card-content" onClick={() => navigate(`/detail/${item._id}`)}>
                <h2 className="title">{item.title}</h2>
                <p className="date">{item.date}</p>
                <img src={item.url} alt={item.title} className="image" />
                <p className="description">{item.explanation.slice(0, 100)}...</p>
              </div>
              {/* ✅ Change button style dynamically */}
              <button
                className={`favorite-button ${isFavorite(item._id) ? "added" : ""}`}
                onClick={() => addToFavorites(item)}
                disabled={isFavorite(item._id)} // Prevent duplicate clicks
              >
                {isFavorite(item._id) ? "✅ Added to Favorites" : "⭐ Add to Favorites"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PastData;
