import React from 'react';
import { Link } from 'react-router-dom'

function ReciepsLink( {data} ) {

  return(
    
    <Link to={`/recieps/${Number(data.id)}`} className="post__item">
      <p className="post__title">
        {data.title}
      </p>
      <p className="post__instruction">
        {data.instruction}
      </p>
      <div className="post__lastRow">
        <p className="post__author">
          {data.authorFullName}
        </p>
        <div className="post__grade">
          <span className={`grade__item ${data.rating >= 0.5 ? "grade__item-gold" : "grade__item-normal"}`}></span>
          <span className={`grade__item ${data.rating >= 1.5 ? "grade__item-gold" : "grade__item-normal"}`}></span>
          <span className={`grade__item ${data.rating >= 2.5 ? "grade__item-gold" : "grade__item-normal"}`}></span>
          <span className={`grade__item ${data.rating >= 3.5 ? "grade__item-gold" : "grade__item-normal"}`}></span>
          <span className={`grade__item ${data.rating >= 4.5 ? "grade__item-gold" : "grade__item-normal"}`}></span>
        </div>
      </div>
    </Link>
      
  )
}

export default ReciepsLink;