import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import Header from '../components/Header';
import ReciepsLink from '../components/ReciepsLink';


function AuthorRecieps() {
  
  let router = useParams()

  const [posts, setPosts] = useState([])
  const [author, setAuthor] = useState('')
  useEffect(() => {
    fetch(`/recipes/authorRecipes/${router.id}`)
    .then(response => response.json())
    .then(result => {
      setAuthor(result.authorFullName)
      setPosts(result.recipes)
      })
  }, [router.id])

  return (
    <div style={{ width: '100%' }}>
      <Header prev={false} title='Рецепты автора' />
      <div className="container reciepsAuthor marginHeader">
        <h3 className='reciepsAuthor__title'>
          {author}
        </h3>
        <div className="recieps__postsList">
          {posts.map(post => <ReciepsLink data={post} key={post.id} />)}
        </div>
      </div>
    </div>
  );
}

export default AuthorRecieps;