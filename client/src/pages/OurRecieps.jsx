import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'
import Header from '../components/Header';
import ReciepsLink from '../components/ReciepsLink';


function OurRecieps() {

  const [posts, setPosts] = useState([])

  useEffect(() => {
    fetch(`/recipes/authorRecipes/${localStorage.getItem("userId")}`)
      .then(response => response.json())
      .then(result => setPosts(result.recipes))
  }, [])

  return (
    <div style={{ width: '100%' }}>
      <Header prev={false} title='Ваши рецепты' />
      <div className="container ourRecieps marginHeader">
        <Link to="/our_recieps/create" className="createButton">
          + Создать рецепт
        </Link>
        <div className="recieps__postsList">
          {posts.map(post => <ReciepsLink data={post} key={post.id} />)}
        </div>
      </div>
    </div>
  );
}

export default OurRecieps;