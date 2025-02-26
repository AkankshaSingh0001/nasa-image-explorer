import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Home.css"; 

const Home = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const today = new Date().toISOString().split("T")[0];
        const NASA_API_KEY = "pMYdgXJERHJGFpUUuX6ObBAtVUvcGwfs1xFxLfhJ"; 
        
       
        const response = await axios.get(
          `https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}`
        );
        setData(response.data);

        
        const checkResponse = await axios.get(
          `${API_BASE_URL}/getPastData`
        );
        const existingData = checkResponse.data.find(
          (item) => item.date === today
        );

        if (!existingData) {
          await axios.post(`${API_BASE_URL}/saveData`, response.data);
          console.log("✅ Data saved successfully!");
        } else {
          console.log("⚠️ Data already exists in the database.");
        }
      } catch (error) {
        console.error("❌ Error fetching or saving data:", error);
        setError("Failed to load NASA data. Please try again.");
      }
    };

    fetchData();
  }, []); 

  return (
    <div className="home-container">
      {error ? (
        <p className="text-red-500">{error}</p>
      ) : !data ? (
        <p className="loading-text">Loading...</p>
      ) : (
        <div className="nasa-card">
          <h2 className="nasa-title">{data.title}</h2>
          <p className="nasa-date">{data.date}</p>
          <div className="own">
            <img src={data.url} alt={data.title} className="nasa-image" />
            <p className="nasa-description">{data.explanation}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
