import React, { useState } from 'react';
import LandingPage from './pages/landingpage';
import RecommendationForm from './pages/RecommendationForm';
import RecommendationProcessing from './pages/RecommendationProcessing';
import RecommendationResults from './pages/RecommendationResults';

function App() {
  const [step, setStep] = useState(0);  // 0 = landing, 1 = form, 2 = processing, 3 = results
  const [formData, setFormData] = useState(null);
  const [recommendations, setRecommendations] = useState([]);

  const handleBegin = () => setStep(1);

  const handleRecommend = (userInput) => {
    const formattedInput = {
      query: userInput.query || "",
      category: userInput.category || "All",
      tone: userInput.tone || "All",
    };

    setFormData(formattedInput);
    setStep(2); // go to processing page
  };

  
  const fetchRecommendations = async (input) => {
    try {
      const response = await fetch("http://127.0.0.1:5000/recommend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch recommendations");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      return []; 
    }
  };

  return (
    <>
      {step === 0 && <LandingPage onBegin={handleBegin} />}

      {step === 1 && (
        <RecommendationForm onSubmit={handleRecommend} />
      )}

      {step === 2 && (
        <RecommendationProcessing
          formData={formData}
          getRecommendations={fetchRecommendations} 
          onComplete={(data) => {
            setRecommendations(data);
            setStep(3);
          }}
        />
      )}

{step === 3 && (
  <RecommendationResults 
    recommendations={recommendations}
    onBack={() => setStep(1)} 
  />
)}
    </>
  );
}

export default App;
