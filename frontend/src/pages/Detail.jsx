import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../styles/Detail.css";

const Detail = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
  useEffect(() => {
    axios.get(`${API_BASE_URL}/detail/${id}`)
      .then(response => setData(response.data))
      .catch(err => setError("Error fetching details"));
  }, [id]);

  if (error) return <p className="error-text">{error}</p>;
  if (!data) return <p className="loading-text">Loading details...</p>;

  return (
    <div className="detail-container">
      <h2 className="title">{data.title}</h2>
      <p className="date">{data.date}</p>
      <img src={data.url} alt={data.title} className="image" />
      <p className="description">{data.explanation}</p>
    </div>
  );
};

export default Detail;
