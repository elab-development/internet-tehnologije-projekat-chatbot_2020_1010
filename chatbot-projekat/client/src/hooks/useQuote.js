import { useState, useEffect } from "react"; // Uvozi useState i useEffect hook-ove iz React-a

// Prilagođeni hook za preuzimanje nasumičnih citata sa Quotable API-a na osnovu tag-ova
const useQuote = (tags) => {
  // Definiše stanje za citat, status učitavanja i eventualne greške
  const [quote, setQuote] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Asinhrona funkcija za preuzimanje citata
    const fetchQuote = async () => {
      setLoading(true); // Postavlja status učitavanja na true pre početka preuzimanja
      setError(null); // Postavlja grešku na null pre preuzimanja
      try {
        const response = await fetch(`https://api.quotable.io/random?tags=${tags}`); // Pravi HTTP GET zahtev ka Quotable API-u sa prosleđenim tag-ovima
        if (!response.ok) { // Ako odgovor nije u redu
          throw new Error("Network response was not ok"); // Bacanje greške ako odgovor nije u redu
        }
        const data = await response.json(); // Parsiranje JSON odgovora
        setQuote(data.content); // Postavljanje citata u stanje
      } catch (error) {
        setError(error.message); // Postavljanje greške u stanje ako se dogodi greška
      } finally {
        setLoading(false); // Postavljanje statusa učitavanja na false bez obzira na uspeh ili grešku
      }
    };

    fetchQuote(); // Poziva funkciju za preuzimanje citata kada se tag promeni
  }, [tags]); // Efekat zavisi od promene tag-ova

  // Vraća objekat sa citatom, statusom učitavanja i greškom
  return { quote, loading, error };
};

export default useQuote; // Izvozi hook za korišćenje u drugim komponentama
