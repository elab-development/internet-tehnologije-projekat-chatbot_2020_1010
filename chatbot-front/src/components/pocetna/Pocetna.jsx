import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Pocetna.css';

const Pocetna = () => {
  const [sala, setSala] = useState(null);

  useEffect(() => {
    const fetchSala = async () => {
      try {
        const response = await axios.get('https://api.chucknorris.io/jokes/random');

        console.log(response.data); // Log the entire API response

        if (response.data && response.data.value) {
          setSala({
            joke: response.data.value
          });
        } else {
          console.error('No Chuck Norris joke found in the response.');
        }
      } catch (error) {
        console.error('Došlo je do greške prilikom dohvatanja šale:', error);
      }
    };

    fetchSala();
  }, []);

  return (
    <>
      <div className='pocetna-stranica'>
        <div className="pocetna-tekst">
          <h1>Dobrodosli na aplikaciju CHATBOT!</h1>
          <p className="type" style={{ '--n': 53 }}>Koristite neverovatnu moc vestacke inteligencije.</p>

          <div className='sala'>
            <h2>Izgenerisana šala:</h2>
            {sala && (
              <blockquote>
                <span className="type" style={{ '--n': 106 }}>{sala.joke}</span>
              </blockquote>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Pocetna;

  