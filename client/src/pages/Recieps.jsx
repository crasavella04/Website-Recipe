import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import ReciepsLink from '../components/ReciepsLink';

function Recieps() {

  const [posts, setPosts] = useState([])

  useEffect(() => {
    fetch("/recipes")
      .then((response) => response.json())
      .then((data) => setPosts(data))
  }, []); 
  
  const [recieptName, setRecieptName] = useState('')

  return (
    <div style={{ width: '100%' }}>
      <Header prev={false} title='Рецепты' />
      <div className="container recieps marginHeader">
        <input 
          type="text" 
          className='recieps_inputSearch' 
          placeholder='Введите блюдо'
          value={recieptName} 
          onChange={e => setRecieptName(e.target.value)}
        />
        <div className="recieps__postsList">
          {posts && posts.map(post => {
            if(post.title.toLowerCase().indexOf(recieptName.toLowerCase()) !== -1) {
              return (
                <ReciepsLink data={post} key={post.id} />
              )
            }
            return null; // or return;
          })}
        </div>
      </div>
    </div>
  );
}

export default Recieps;