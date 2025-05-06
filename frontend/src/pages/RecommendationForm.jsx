import React, { useState } from "react";
import "./recommendationform.css"; 

function RecommendationForm({ onSubmit }) {
  const [userInput, setUserInput] = useState({
    query: "",
    category: "All",
    tone: "All",
  });

  const handleChange = (e) => {
    setUserInput({
      ...userInput,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(userInput);
  };

  return (
    <div className="recommendation-container">
      <div className="form-container">
        <h1 className="form-title">Find Your Movie</h1>
        <p className="form-subtitle">Let us help you pick the best movie!</p>
        
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="query"
            placeholder="Enter a keyword"
            value={userInput.query}
            onChange={handleChange}
            className="input-field"
          />
          
          <select
            name="category"
            value={userInput.category}
            onChange={handleChange}
            className="select-field"
          >
            <option value="All">All Categories</option>
            <option value="Action">Action</option>
            <option value="Adventure">Adventure</option>
            <option value="Animation">Animation</option>
            <option value="Comedy">Comedy</option>
            <option value="Crime">Crime</option>
            <option value="Drama">Drama</option>
            <option value="Fantasy">Fantasy</option>
            <option value="Horror">Horror</option>
            <option value="Mystery">Mystery</option>
            <option value="Romance">Romance</option>
            <option value="Sci-Fi">Sci-Fi</option>
            <option value="Thriller">Thriller</option>
            <option value="Western">Western</option>
            <option value="Documentary">Documentary</option>
          </select>

          <select
            name="tone"
            value={userInput.tone}
            onChange={handleChange}
            className="select-field"
          >
            <option value="All">All Tones</option>
            <option value="Happy">Happy</option>
            <option value="Sad">Sad</option>
            <option value="Suspenseful">Suspenseful</option>
            <option value="Heartwarming">Heartwarming</option>
            <option value="Inspiring">Inspiring</option>
            <option value="Dark">Dark</option>
            <option value="Feel-good">Feel-good</option>
            <option value="Romantic">Romantic</option>
            <option value="Chilling">Chilling</option>
            <option value="Funny">Funny</option>
          </select>

          <button type="submit" className="submit-button">Get Recommendations</button>
        </form>
      </div>
    </div>
  );
}

export default RecommendationForm;
