// Pocetna.jsx
import React from 'react';
import './Pocetna.css';
import Footer from '../footer/Footer';
import useJoke from './useJoke'; // Update the path accordingly

const Pocetna = () => {
  const joke = useJoke();

  return (
    <>
      <div className='pocetna-stranica'>
        <div className="pocetna-tekst">
          <h1>Dobrodosli na aplikaciju CHATBOT!</h1>
          <p className="type" style={{ '--n': 53 }}>Koristite neverovatnu moc vestacke inteligencije.</p>

          <div className='sala'>
            <h2>Izgenerisana šala:</h2>
            {joke && (
              <blockquote>
                <span className="type" style={{ '--n': 106 }}>{joke.joke}</span>
              </blockquote>
            )}
          </div>
        </div>
      </div>
      <Footer/>
    </>
  );
};

export default Pocetna;

  