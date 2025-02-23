import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Home.css"; // Import the CSS file

const Home = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    const NASA_API_KEY = "pMYdgXJERHJGFpUUuX6ObBAtVUvcGwfs1xFxLfhJ"; // 🔹 Replace with your NASA API Key

    // Fetch today's NASA data from API
    axios.get(`https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}`)
      .then(response => {
        setData(response.data);

        // Store today's data in MongoDB
        axios.post("http://localhost:5000/saveData", response.data)
          .then(() => console.log("✅ Data saved successfully!"))
          .catch(error => console.error("❌ Error saving data:", error));
      })
      .catch(error => {
        console.error("❌ Error fetching data:", error);
        setError("Failed to load NASA data. Please try again.");
      });
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
