import "./ChatGUI.css";
import React, { Fragment, useState, useEffect } from "react";
import { io } from "socket.io-client";
import { useAuth } from "../../hooks/useAuth";
import api from "../../api/posts";
import MessageList from "../MessageList";

// Globalna promenljiva za socket kako bi se konekcija uspostavila samo jednom
let socket;

export default function ChatGUI() {
  // State za čuvanje poruka i unetog teksta
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const { token } = useAuth(); // Koristi autentifikacioni token iz hook-a

  // Funkcija za dobijanje poruka sa servera
  const getMessages = async () => {
    const response = await api.get("/chat", {
      headers: {
        "x-auth-token": token,
      },
    });
    // Pretpostavljamo da response.data.messages sadrži ID-ove poruka
    const messageDetails = await Promise.all(response.data.messages.map(async messageId => {
      const messageResponse = await api.get(`/messages/${messageId}`, {
        headers: {
          "x-auth-token": token,
        },
      });
      return messageResponse.data;
    }));
    setMessages(messageDetails); // Ažurira state sa dobijenim porukama
  };

  // useEffect za uspostavljanje socket konekcije i slušanje novih poruka
  useEffect(() => {
    socket = io("http://localhost:5000"); // Uspostavlja konekciju sa serverom
    getMessages(); // Dobija poruke prilikom učitavanja komponente

    // Sluša na "response" događaj i dodaje nove poruke u state
    socket.on("response", message => {
      setMessages(prevMessages => [...prevMessages, message]);
    });

    // Čisti socket konekciju kada se komponenta unmount-uje
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []); // Prazan niz kao dependency znači da useEffect radi samo jednom prilikom mount-a

  // Funkcija za slanje poruka
  const handleSubmit = e => {
    e.preventDefault(); // Sprečava podrazumevani ponašanje forme
    const text = inputMessage;
    const userdata = { text, token };
    socket.emit("message", userdata); // Šalje poruku serveru preko socket-a
    setInputMessage(""); // Čisti polje za unos
  };

  return (
    <Fragment>
      <section className="msger">
        <header className="msger-header"></header>

        <main className="msger-chat">
          {/* Prikazuje listu poruka ako postoje */}
          {messages && <MessageList messages={messages} />}
        </main>

        <form className="msger-inputarea" onSubmit={handleSubmit}>
          <input
            type="text"
            name="text"
            className="msger-input"
            placeholder="Enter your message..."
            onChange={e => setInputMessage(e.target.value)} // Ažurira state sa novim tekstom
            value={inputMessage} // Kontrolisan unos
          />

          <button
            type="submit"
            className="msger-send-btn"
            disabled={!inputMessage} // Onemogućava dugme ako je unos prazan
          >
            Send
          </button>
        </form>
      </section>
    </Fragment>
  );
}
