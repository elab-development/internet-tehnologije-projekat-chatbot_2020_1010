import { Link } from 'react-router-dom';
import { RiQuestionAnswerFill } from "react-icons/ri";
import { IoHomeSharp } from "react-icons/io5";
import './Navbar.css';
import { useNavigate } from 'react-router-dom';

function NavBar({ loggedInUser, handleLogout }) {

    const navigate = useNavigate();

    const handleLogoutClick = () => {
        handleLogout();
        navigate('/');
        };

    return (
      <div>
        <nav className="nav">
          <div className="nav__title">
            <h1>CHATBOT</h1>
            <img className='logo'  src="https://i.ibb.co/DrLtmvS/logo.png" alt="logo" border="0"/>
          </div>
          <ul className="nav__list">
            <li className="nav__item">
                Prijavljen korisnik: {loggedInUser}{' '}
                </li>
                <li className="nav__item">
                  <Link to='/pocetna'> Pocetna <IoHomeSharp /> </Link>
                </li>
                <li className="nav__item">
                  <Link to='/pitanje'> Pitaj pitanja <RiQuestionAnswerFill /></Link>
                </li>
                <button className="logout-button" onClick={handleLogoutClick}>
                Odjava
              </button>
          </ul>
        </nav>
      </div>
    );
  }
  
  export default NavBar;