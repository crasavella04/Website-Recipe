import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import ReciepsLink from '../components/ReciepsLink';


function SaveRecieps() {
  
  const [posts, setPosts] = useState([])

  useEffect(() => {
    fetch(`/recipes/ourSaves/${localStorage.getItem("userId")}`)
    .then(response => response.json())
    .then(result => setPosts(result))
  }, [])

  console.log(posts);

  return (
    <div style={{ width: '100%' }}>
      <Header prev={false} title='Сохраненные рецепты' />
      <div className="container saveRecieps marginHeader">

        <div className="recieps__postsList">
        {posts.map(post => {

            return (
                <ReciepsLink data={post} key={post.id} />
            )
          })}
        </div>
      </div>
    </div>
  );
}

export default SaveRecieps;