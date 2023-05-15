import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom'
import Burger from './Burger';

function Header({ prev, title, href }) {

  const [burgerActive, setBurgerActive] = useState(false)

  const toggleBurger= () => {
    setBurgerActive(!burgerActive);
  }

  const myRef = useRef(null);
  let height

  useEffect(() => {
    if (myRef.current) {
      height = myRef.current.clientHeight;
    }
  }, []);

  if(title){
    return (
      <header ref={myRef} className='header'>
        <div className="container header__withTitle">
          <div className="left__col">
            {prev && (
              <Link to={href} className="prev__link"><img src="/img/arrow_back.svg" alt="" className='header__arrowBack' /></Link>
            )}
            <h1 className='header__title'>{title}</h1>
          </div>
          <div className="burger__container">
            <button 
              className={`burger ${burgerActive ? 'burger__active' : ''}`} 
              onClick={toggleBurger}
            >
              <div className={`burger__mid ${burgerActive ? 'burger__active' : ''}`}></div>
            </button>
          </div>
        </div>
        <Burger props={burgerActive} />
      </header>
    );
  } else {
    return(
      <header className="header">
        <div className="container header__withoutTitle">
          <div className="burger__container">
            <button 
              className={`burger ${burgerActive ? 'burger__active' : ''}`}
              onClick={toggleBurger}
            >
              <div className={`burger__mid ${burgerActive ? 'burger__active' : ''}`}></div>
            </button>
          </div>
        </div>
      </header>
    )
    
  }
  
}

export default Header;