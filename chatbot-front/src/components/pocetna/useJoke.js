// useJoke.js
import { useState, useEffect } from 'react';
import axios from 'axios';

const useJoke = () => {
  const [joke, setJoke] = useState(null);

  useEffect(() => {
    const fetchJoke = async () => {
      try {
        const response = await axios.get('https://api.chucknorris.io/jokes/random');

        console.log(response.data); // Log the entire API response

        if (response.data && response.data.value) {
          setJoke({
            joke: response.data.value
          });
        } else {
          console.error('No Chuck Norris joke found in the response.');
        }
      } catch (error) {
        console.error('Došlo je do greške prilikom dohvatanja šale:', error);
      }
    };

    fetchJoke();
  }, []);

  return joke;
};

export default useJoke;
