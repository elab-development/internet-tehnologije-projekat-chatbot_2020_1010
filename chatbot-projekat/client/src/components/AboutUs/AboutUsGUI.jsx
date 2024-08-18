import React from "react";
import useQuote from "../../hooks/useQuote"; 
import "./AboutUsGUI.css"; 

const AboutUsGUI = () => {
  // Koristi custom hook 'useQuote' za dobijanje citata o tehnologiji
  const { quote, loading, error } = useQuote("technology");

  return (
    <section className="about-us">
      <header className="about-us-header">
        {/* Naslov sekcije 'About Us' */}
        <h1 className="header">About Us</h1>
      </header>

      <main className="about-us-content">
        <div className="model-container">
          <div className="sketchfab-embed-wrapper">
            {/* Iframe za ugrađeni 3D model sa Sketchfab-a */}
            <iframe 
              title="Robo_face" 
              frameBorder="0" 
              allowFullScreen 
              mozAllowFullScreen="true" 
              webkitAllowFullScreen="true" 
              allow="autoplay; fullscreen; xr-spatial-tracking" 
              src="https://sketchfab.com/models/2526efbe2077444ea82dab30debc58aa/embed"
            >
            </iframe>
          </div>
        </div>
        <div className="text-and-quote">
          <p>
            {/* Dobrodošlica korisnicima */}
            <span className="subheading">Welcome to Our Chat Bot Application</span><br />
            We are a team of dedicated professionals committed to providing the best user experience. 
            Our goal is to enhance communication through advanced chat bot technologies. 
            By leveraging state-of-the-art artificial intelligence, our chat bots are designed to understand and 
            respond to user inquiries with remarkable accuracy and efficiency.<br /><br />
            
            {/* Objašnjenje važnosti veštačke inteligencije */}
            <span className="subheading">Why Artificial Intelligence?</span><br />
            Artificial intelligence plays a pivotal role in the development of our chat bots. AI enables our systems to 
            learn from interactions, improve over time, and offer personalized experiences. Our AI algorithms analyze 
            user input to provide relevant and helpful responses, making communication smoother and more intuitive. 
            <br /><br />
            
            {/* Kontakt informacije za podršku */}
            If you have any questions or need support, feel free to contact us at <a href="mailto:support@chatbot.com">support@chatbot.com</a>.
          </p>
          <section className="quote-of-the-day">
            <h2>Tech Quote of the Day</h2>
            {/* Prikaz citata o tehnologiji */}
            {loading ? (
              <p>Loading quote...</p>
            ) : error ? (
              <p>Error: {error}</p>
            ) : (
              <blockquote>
                {quote}
              </blockquote>
            )}
          </section>
        </div>
      </main>
    </section>
  );
};

export default AboutUsGUI;
