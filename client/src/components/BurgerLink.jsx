import React from 'react';
import { Link } from 'react-router-dom'

function BurgerLink({ children, urlPath }) {

  let URL = window.location.pathname
  
  return(
    
      <Link to={urlPath} className={`list__item ${URL.indexOf(`${urlPath}`) !== -1 ? 'list__item-active' : ''}`}>
        {children}
      </Link>
      
  )
}

export default BurgerLink;