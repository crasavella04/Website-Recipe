import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';

function Profile() {

  const [userData, setUserData] = useState({
    authorFullName: '',
    ourRecipesSaved: 0,
    quantityOurRecipes: 0,
    quantitySavedRecipes: 0,
  })

  const data = localStorage.getItem("userId");

  useEffect(() => {
    fetch(`/user/data/${data}`)
      .then(response => response.json())
      .then(result => {
        setUserData(result)
    })
  }, [data]); 

  return (
    <div style={{ width: '100%' }}>
      <Header prev={false} title='Профиль' />
      <div className="container profile__content marginHeader">
        <h2 className="profile__name">
          {userData.authorFullName}
        </h2>
        <div className="profile__recipes">
          <Link to='/our_recieps' className="profile__ourRecipes">
            <img src="/img/ourRecipes.svg" alt="" className='recipes__img' />
            <p className="ourRecipes__text">
              Ваши рецепты({userData.quantityOurRecipes})
            </p>
          </Link>
          <Link to='/save_recieps' className="profile__saveRecipes">
            <img src="/img/saveRecipes.svg" alt="" className='recipes__img' />
            <p className="saveRecipes__text">
              Сохраненные рецепты({userData.quantitySavedRecipes})
            </p>
          </Link>
        </div>
      </div>
      <p className="profile__postText">Ваши рецепты сохранили {userData.ourRecipesSaved} раз(а)</p>
    </div>
  );
}

export default Profile;