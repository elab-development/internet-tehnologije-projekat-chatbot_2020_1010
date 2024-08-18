import React, { useState, useEffect } from "react"; // Uvoz React-a, useState i useEffect hook-ova
import { useAuth } from "../hooks/useAuth"; // Uvoz hook-a za autentifikaciju
import api from "../api/posts"; // Uvoz API-a za komunikaciju sa serverom
import logo from "../assets/images/main.png"; // Uvoz slike za bot avatar

export default function MessageList({ messages }) {
  // Dohvatanje korisničkih podataka i tokena iz hook-a useAuth
  const { user, token } = useAuth();
  // State za čuvanje podataka o profilu
  const [profile, setProfile] = useState(null);

  // useEffect hook za preuzimanje podataka o profilu kada se komponenta učita ili korisnik/tokens se promene
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Slanje GET zahteva za preuzimanje profila
        const response = await api.get(`/profiles/${user.id}`, {
          headers: { "x-auth-token": token }, // Dodavanje tokena u zaglavlje zahteva
        });
        setProfile(response.data); // Postavljanje podataka o profilu u state
      } catch (error) {
        console.error("Error fetching profile:", error); // Prikazivanje greške u konzoli
      }
    };

    fetchProfile();
  }, [user.id, token]); // Zavisi od user.id i token, poziva se kada se promene

  // Definiše URL za default avatar u slučaju kada podaci o profilu nisu još dostupni
  const defaultAvatar = "https://cdn-icons-png.freepik.com/512/3177/3177440.png";

  return (
    <>
      {messages
        .slice(0) // Kreira kopiju poruka
        .reverse() // Okreće redosled poruka
        .map((message, index) => (
          <div key={message._id ? message._id : index}>
            {/* Prikaz poruka koje šalje korisnik */}
            <div className="msg right-msg">
              <div
                className="msg-img"
                style={{ backgroundImage: `url(${profile ? profile.avatar : defaultAvatar})` }} // Postavljanje slike avatara
              />
              <div className="msg-bubble">
                <div className="msg-info">
                  <div className="msg-info-name">
                    {user ? user.name : "You"} {/* Prikaz imena korisnika */}
                  </div>
                </div>
                <div className="msg-text">{message.text}</div> {/* Prikaz teksta poruke */}
              </div>
            </div>
            {/* Prikaz poruka koje šalje bot */}
            <div className="msg left-msg">
              <div
                className="msg-img"
                style={{ backgroundImage: `url(${logo})` }} // Postavljanje slike avatara za bot
              />
              <div className="msg-bubble">
                <div className="msg-info">
                  <div className="msg-info-name">BOT</div> {/* Prikaz imena bota */}
                </div>
                <div className="msg-text">{message.response}</div> {/* Prikaz teksta odgovora bota */}
              </div>
            </div>
          </div>
        ))}
    </>
  );
}
