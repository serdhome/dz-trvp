import React, { useState } from 'react';
import "./header.css";
import logo from "./AO_logo.png";
import person from "./face.png";

const Header = () => {
  const [dark, setDark] = useState(true);

  const toggleDarkMode = () => {
    setDark(!dark);
    document.body.classList.toggle('dark-theme', dark);
  };

  return (
    <div className="header">
      <div className="title">
        <img src={logo} alt="Логотип" style={{ width: '35px', height: '35px', marginRight: '15px' }} /> {/* Используем изображение вместо иконки */}
        AirlineOnline
      </div>
      <div className='header-right'>
        <i onClick={() => toggleDarkMode()} className={dark ? 'fa fa-moon-o darktheme' : 'fa fa-sun-o darktheme'}></i>
        <div className="icon">
          <img src={person} alt="Аватар"style={{fontSize: '25px', color:'white', opacity: '70%'}}></img>
        </div>
      </div>
    </div>
  );
};

export default Header;
