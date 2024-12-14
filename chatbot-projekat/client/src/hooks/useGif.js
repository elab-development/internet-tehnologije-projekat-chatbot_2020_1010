import { useState, useEffect } from 'react'; // Uvozi useState i useEffect hook-ove iz React-a
import axios from 'axios'; // Uvozi axios biblioteku za pravljenje HTTP zahteva

// Prilagođeni hook za preuzimanje GIF-ova sa Giphy API-a
const useGif = (tag = "Technology") => {
  // Definiše stanje za URL GIF-a, status učitavanja i eventualne greške
  const [gifUrl, setGifUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Asinhrona funkcija za preuzimanje GIF-a
    const fetchGif = async () => {
      try {
        setLoading(true); // Postavlja status učitavanja na true pre početka preuzimanja
        const response = await axios.get('https://api.giphy.com/v1/gifs/search', {
          params: {
            api_key: process.env.REACT_APP_GIPHY_API_KEY, // API ključ za pristup Giphy API-u
            q: tag, // Tag za pretragu GIF-ova
            limit: 1, // Ograničava broj rezultata na 1
            rating: 'g', // Filtrira rezultate na GIF-ove sa ocenom 'g' (generalna publika)
            offset: Math.floor(Math.random() * 1000), // Nasumični offset za raznolike rezultate
          },
        });
        // Ako postoji rezultat, postavlja URL prvog GIF-a
        if (response.data.data.length > 0) {
          setGifUrl(response.data.data[0].images.original.url);
        }
      } catch (error) {
        // Postavlja grešku ako se pojavi tokom preuzimanja
        setError(error);
      } finally {
        // Postavlja status učitavanja na false bez obzira na uspeh ili grešku
        setLoading(false);
      }
    };

    // Poziva funkciju za preuzimanje GIF-a kada se tag promeni
    fetchGif();
  }, [tag]); // Efekat zavisi od promene tag-a

  // Vraća objekat sa URL-om GIF-a, statusom učitavanja i greškom
  return { gifUrl, loading, error };
};

export default useGif; // Izvozi hook za korišćenje u drugim komponentama
