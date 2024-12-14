import { useState, useEffect } from "react";

// Custom hook for fetching tech-related quotes from Programming Quotes API
const useQuote = () => {
  const [quote, setQuote] = useState("");
  const [author, setAuthor] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuote = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('https://favqs.com/api/qotd');
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        // Extracting data based on the actual response structure
        setQuote(data.quote.body);
        setAuthor(data.quote.author);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuote(); // Fetch quote on component mount
  }, []); // Effect runs only once

  // Returns the quote, author, loading status, and error
  return { quote, author, loading, error };
};

export default useQuote;
