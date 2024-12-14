import { Head, Para, Subs, CapsLetter, Logo, HandleImg } from "./HeroSectionElements"; // Uvoz stilizovanih elemenata
import logo from "../../assets/images/main.png"; // Uvoz slike logotipa za korisnike
import adminLogo from "../../assets/images/admin.png"; // Uvoz slike logotipa za administratore
import { StyledBtn } from "../../assets/styles/ButtonElements"; // Uvoz stilizovanog dugmeta
import { useAuth } from "../../hooks/useAuth"; // Uvoz hook-a za autentifikaciju
import { Link } from "react-router-dom"; // Uvoz Link komponente iz react-router-dom za navigaciju

export default function HeroSection() {
  const { token, user } = useAuth(); // Dohvatanje tokena i korisničkih informacija iz hook-a useAuth

  return (
    <>
      {user?.isAdmin ? (
        // Ako je korisnik admin, prikazuje se admin sadržaj
        <div>
          <Head>
            Welcome, <CapsLetter>Admin</CapsLetter> {/* Pozdrav za administratora */}
          </Head>
          <Subs>Admin Dashboard</Subs> {/* Podnaslov za admin dashboard */}
          <Para>Manage users, settings, and view analytics.</Para> {/* Opis za administratore */}
          <Link to="/dashboard">
            <StyledBtn zero onClick={() => {}}>
              Go to Dashboard
            </StyledBtn>
          </Link>
        </div>
      ) : (
        // Ako korisnik nije admin, prikazuje se sadržaj za regularne korisnike
        <div>
          <Head>
            Welcome to the <CapsLetter>Chat Bot.</CapsLetter> {/* Pozdrav za regularne korisnike */}
          </Head>
          <Subs>The only human that actually listens</Subs> {/* Podnaslov za chat bot */}
          <Para>
            A chatbot is software that simulates human-like conversations with
            users via text messages on chat. Its key task is to help users by
            providing answers to their questions.
          </Para>
          <Link to={token ? "/chat" : "/register"}>
            <StyledBtn zero onClick={() => {}}>
              Start Chatting
            </StyledBtn>
          </Link>
        </div>
      )}
      <HandleImg>
        <Logo src={user?.isAdmin ? adminLogo : logo} /> {/* Prikaz odgovarajuće slike logotipa na osnovu uloge korisnika */}
      </HandleImg>
    </>
  );
}
