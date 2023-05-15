import React, {useEffect, useState} from 'react';
import { useParams } from 'react-router';
import Header from '../components/Header';
import { Link } from 'react-router-dom';


function ReciepsItem() {
  
  let router = useParams()

  const [recipe, setRecipe] = useState({
    id: router.id,
    title: '',  
    instruction: '', 
    kcal: 0, 
    authorId: 0,
    authorFullName: '',
    ingridients: [],
    rating: 0,
    saved: false,
    kcal: -1
})

const data = {
  recipeId: Number(router.id),
  userId: Number(localStorage.getItem("userId"))
}
  
useEffect(() => {
  fetch(`/recipes/recipeItem`, {
    method: "POST", 
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then(response => response.json())
    .then(result => {
      console.log(result);
      setRecipe(result)
    })
}, []);

  const saveRecipe = () => {
    fetch("/recipes/saveRecipe", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId: Number(localStorage.getItem("userId")),
        recipeId: Number(router.id)
      })
    })
      .then(() => {
        window.location.reload();
      })
  }

  const Like = (rating) => {
    fetch("/recipes/likeRecipe", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        idRecipe: Number(router.id),
        idUser: Number(localStorage.getItem("userId")),
        rating: Number(rating)
      })
    })
      .then(() => {
        window.location.reload();
      })
  }

  return (
    <div style={{ width: '100%' }}>
      <Header prev={true} title='Рецепт' href={'/recieps'}/>
      <div className="container recieps__item marginHeader">
        <h2 className="reciepsItem__title">
          {recipe.title}
        </h2>
          <div className="structure">
            <h3 className="structure__title">
              Ингридиенты
            </h3>
            <ul type="disc" className="structure__content">
              {recipe.ingridients.map(ingridient => {
                return <li>
                  {ingridient.dataValues.name} {ingridient.dataValues.quantity}{ingridient.unitOfMeasurement 
                  ?
                   ` ${ingridient.unitOfMeasurement}` 
                   : 
                   ' (г/мл/шт)'}
                </li>
              })}
            </ul>
          </div>
          <div className="instruction">
            <h3 className="instruction__title">
              Пошаговая инструкция
            </h3>
            <p className="instruction__content">
              {recipe.instruction}
            </p>
          </div>
          <p className="recieps__kcal">
            {recipe.kcal !== -1 && 0 ? `~${recipe.kcal}Ккал` : '*К сожалению мы не можем посчитать каллорийность этого блюда:('}
          </p>
          {recipe.authorFullName === "" ? <p className="recieps__author">
            <Link to={`/recieps/save_recieps}`}>Ваши рецепты</Link>
          </p> : <p className="recieps__author">
            Автор: <Link to={`/recieps/author/${recipe.authorId}}`}>{recipe.authorFullName}</Link>
          </p>}
          <div className="recieps__liked">
            <p className="liked__text">
              {recipe.like ? "Вы уже оценили этот рецепт: " : 'Оцените этот рецепт:'}
            </p>
            {recipe.rating !== 0 ? 
              <div className="liked__stars">
                <span className={`grade__item ${recipe.rating >= 0.5 ? "grade__item-gold" : "grade__item-normal"}`}></span>
                <span className={`grade__item ${recipe.rating >= 1.5 ? "grade__item-gold" : "grade__item-normal"}`}></span>
                <span className={`grade__item ${recipe.rating >= 2.5 ? "grade__item-gold" : "grade__item-normal"}`}></span>
                <span className={`grade__item ${recipe.rating >= 3.5 ? "grade__item-gold" : "grade__item-normal"}`}></span>
                <span className={`grade__item ${recipe.rating >= 4.5 ? "grade__item-gold" : "grade__item-normal"}`}></span>
              </div>
            : 
              <div className="liked__stars">
                <span className={`grade__item grade__item-normal`} onClick={() => {Like(1)}}></span>
                <span className={`grade__item grade__item-normal`} onClick={() => {Like(2)}}></span>
                <span className={`grade__item grade__item-normal`} onClick={() => {Like(3)}}></span>
                <span className={`grade__item grade__item-normal`} onClick={() => {Like(4)}}></span>
                <span className={`grade__item grade__item-normal`} onClick={() => {Like(5)}}></span>
              </div>
            }
          </div>
          {recipe.saved ? 
            <div className="recipe__saved" onClick={saveRecipe}>
              Рецепт сохранен
            </div>
          : 
            <div className="save__button" onClick={saveRecipe}>
              + Сохранить рецепт
            </div>
          }
      </div>
    </div>
  );
}

export default ReciepsItem;