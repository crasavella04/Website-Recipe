import React, { useState, useEffect } from 'react';
import Header from '../components/Header';

function CreateRecieps() {

  const [ingridients, setIngridients] = useState([])

  useEffect(() => {
    fetch('/product')
      .then(response => response.json())
      .then(result => setIngridients(result))
  }, [])

  const [messageError, setMessageError] = useState('')
  const [title, setTitle] = useState('')
  const [instruction, setInstruction] = useState('')

  let n = 1
  const [data, setData] = useState([
    {
      id: n,
      name: '',
      quantity: '',
      focus: false
    }
  ]);

  const addIngridient = () => {
    n++
    setData(prevData => prevData.concat({
      id: n,
      name: '',
      quantity: ''
    }))
  }
  const deleteIngridient = () => {
    if (data.length > 1){
      setData(prevData => prevData.slice(0, -1));
      n--
    }
  }

  const addReciept = () => {

    setMessageError('')
    let flag = true

    if (!instruction) {
      flag = false
      setMessageError('Введите инструкцию!')
    }
    
    for (let i = 0; i < data.length; i++) {
      if (data[i].name === '' || data[i].quantity === '') {
        flag = false
        setMessageError('У вас остались пустые ингридиенты!')
        break
      }
    }
    
    if (!title) {
      setMessageError('Введите название блюда!')
      flag = false
    }

    const ingridients = data.map(ingridient => {
      return {
        name: ingridient.name,
        quantity: Number(ingridient.quantity),
      }
    })

    console.log(ingridients);

    if (flag) {

      fetch('/recipes/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          authorId: Number(localStorage.getItem("userId")),
          title,
          ingridients,
          instruction,
        })
      })

      window.location.pathname = `/our_recieps`
    }
  }

  const replaceIngridient = (ingridient, index) => {
    const newData = [...data];
    newData[index].name = ingridient;
    setData(newData);
    // console.log(data);
  }

  return (
    <div style={{ width: '100%' }}>
      <Header prev={true} title='Рецепт' href={'/our_recieps'} />
      <div className="container createPage marginHeader">
        <h3 className="createPage__title">
          Название блюда
        </h3>
        <input 
          type="text" 
          className='createPage__name' 
          placeholder='Введите название блюда' 
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <h3 className="createPage__title">
          Ингридиенты
        </h3>
        <div className="ingridientsList">
          {data.map((item, index) => (
            <div className="ingridientsList-item" key={item.id}>
              <input 
                type="text" 
                className='ingridients__name' 
                placeholder='Ингредиент'
                value={item.name}
                onFocus={() => {
                  let newData = [...data]
                  newData[index].focus = true
                  setData(newData)
                }}
                onBlur={() => {
                  setTimeout(function(){
                    let newData = [...data]
                    newData[index].focus = false
                    setData(newData)
                  }, 300)
                }} 
                onChange={e => {
                  let newData = [...data];
                  newData[index].name = e.target.value;
                  setData(newData); 
                }}
              />
              <div className={`listIngridients ${item.focus ? 'listIngridients-active' : ''}`} >
                {ingridients.map(ingridient => {
                  if (ingridient.toLowerCase().indexOf(item.name.toLowerCase()) !== -1) {
                    return (
                      <div
                        className="listIngridients-item"
                        onClick={() => replaceIngridient(ingridient, index)}
                      >
                        {ingridient}
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
              <input 
                type="number"
                inputMode='numeric'
                className='ingridients__quantity' 
                placeholder='Кол-во грамм/мл/шт' 
                value={item.quantity}
                onKeyPress = {event => {
                  const keyCode = event.which || event.keyCode;
                  const keyValue = String.fromCharCode(keyCode);
                  if (/\D/.test(keyValue)) {
                    event.preventDefault();
                  }
                }}
                onChange={e => {
                  const newData = [...data]; 
                  newData[index].quantity = e.target.value; 
                  setData(newData);
                }}
              />
            </div>
          ))}
        </div>
        <div className="ingridients__buttons">
          <button className="addIngridient ingridients__button" onClick={addIngridient}>Добавить ингридиент</button>
          <button className="deleteIngridient ingridients__button" onClick={deleteIngridient}>Удалить ингридиент</button>
        </div>
        <h3 className="createPage__title">
          Пошаговая инструкция
        </h3>
        <textarea 
          className='createPage__instruction' 
          placeholder='Опишите процесс приготовления блюда' 
          value={instruction}
          onChange={e => setInstruction(e.target.value)}
          maxlength='1000'
        />
        <button className="addRecieps" onClick={addReciept}>Добавить</button>
        <p className="messageError">
          {messageError}
        </p>
      </div>
    </div>
  );
}

export default CreateRecieps;