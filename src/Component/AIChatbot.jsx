import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function AIChatbot({ weather }) {
  const [question, setQuestion] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const askAI = async (e) => {
    e.preventDefault();

    const userQuestion = question.trim();
    if (!userQuestion || loading) return;

    setChatHistory((prev) => [...prev, { role: "user", text: userQuestion }]);
    setQuestion("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/ai/chat`, {
        signal: AbortSignal.timeout(30000),
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: userQuestion,
          weather: weather
            ? {
                city: weather.location?.name,
                country: weather.location?.country,
                temperature_c: weather.current?.temp_c,
                condition: weather.current?.condition?.text,
                humidity: weather.current?.humidity,
                wind_kph: weather.current?.wind_kph,
                chance_of_rain:
                  weather.forecast?.forecastday?.[0]?.day?.daily_chance_of_rain,
              }
            : null,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "AI request failed");
      }

      setChatHistory((prev) => [
        ...prev,
        { role: "assistant", text: result.answer },
      ]);
    } catch (error) {
      console.error("AI chat error:", error);

      let errorMessage = "AI se connect nahi ho paaya. Please try again.";

      if (error.name === "TimeoutError" || error.name === "AbortError") {
        errorMessage =
          "AI response mein zyada time lag raha hai. Please try again.";
      } else if (!navigator.onLine) {
        errorMessage = "Internet connection check karo aur dobara try karo.";
      } else if (error.message === "AI request failed") {
        errorMessage =
          "AI service abhi available nahi hai. Thodi der baad try karo.";
      }

      setChatHistory((prev) => [
        ...prev,
        { role: "assistant", text: errorMessage },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setChatHistory([]);
  };

  return (
    <section className="ai-chatbot">
      <h2>AI Weather Assistant</h2>
      <p>Ask anything about your weather!</p>

      {chatHistory.length > 0 && (
        <div className="chat-history">
          {chatHistory.map((message, index) => (
            <div key={index} className={`chat-message ${message.role}`}>
              <strong>
                {message.role === "user" ? "You" : "AI Assistant"}
              </strong>
              <p>{message.text}</p>
            </div>
          ))}
        </div>
      )}

      {loading && <p className="chat-loading">AI is thinking...</p>}

      <form onSubmit={askAI}>
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask about weather trends, forecast insights, or weather risks..."
          disabled={loading}
        />

        <button type="submit" disabled={loading || !question.trim()}>
          {loading ? "Thinking..." : "Ask AI"}
        </button>
      </form>

      {chatHistory.length > 0 && (
        <button
          type="button"
          className="clear-chat-btn"
          onClick={clearChat}
          disabled={loading}
        >
          Clear Chat
        </button>
      )}
    </section>
  );
}

export default AIChatbot;
