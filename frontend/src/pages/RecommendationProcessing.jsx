import React, { useEffect, useState } from "react";
import LoadingAnimation from "../components/loadinganimation"; // the loadinganimation component for progress bar
import "./recommendationprocessing.css";

function RecommendationProcessing({ formData, getRecommendations, onComplete }) {
    const steps = [
        "Initializing NLP model...",
        "Tokenizing input text...",
        "Getting part of speech tags...",
        "Performing syntactic parsing...",
        "Extracting semantic meaning and context...",
        "Generating sentence embeddings...",
        "Performing vector search with embeddings...",
        "Running transformers to predict intent...",
        "Analyzing tone and emotional context...",
        "Matching against our content database...",
        "Generating personalized recommendations..."
    ];

    const [currentStepIndex, setCurrentStepIndex] = useState(0);

    useEffect(() => {
        const stepInterval = 1000;

        if (currentStepIndex < steps.length - 1) {
            const timer = setTimeout(() => {
                setCurrentStepIndex((prev) => prev + 1);
            }, stepInterval);
            return () => clearTimeout(timer);
        } else {
            const fetchData = async () => {
                const recommendations = await getRecommendations(formData);
                onComplete(recommendations);
            };
            const timer = setTimeout(fetchData, 1500);
            return () => clearTimeout(timer);
        }
    }, [currentStepIndex, formData, getRecommendations, onComplete, steps.length]);

    // increasing percentage of fill of the progress bar
    const progressPercent = ((currentStepIndex + 1) / steps.length) * 100;

    return (
        <div className="processing-container">
            <h1>Let's get you some movies...</h1>
            <p className="processing-step">{steps[currentStepIndex]}</p>
            <div className="logo-progress-wrapper">
                {/*call the component*/}
                <LoadingAnimation progressPercent={progressPercent} />
            </div>
        </div>
    );
}

export default RecommendationProcessing;
