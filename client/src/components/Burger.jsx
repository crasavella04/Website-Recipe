import React from 'react';
import BurgerLink from './BurgerLink';

function Burger( {props} ) {

  return(
    <div className={`burger__list ${props ? 'burger__list-active' : ''}`}>
      <BurgerLink urlPath={"/recieps"}>
        Рецепты
      </BurgerLink>
      <BurgerLink urlPath={"/profile"}>
        Профиль
      </BurgerLink>
      <BurgerLink urlPath={"/our_recieps"}>
        Ваши рецепты
      </BurgerLink>
      <BurgerLink urlPath={"/save_recieps"}>
        Сохраненные рецепты
      </BurgerLink>
    </div>
  )
}

export default Burger;