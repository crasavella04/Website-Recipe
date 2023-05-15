const express = require('express')
const app = express()
app.use(express.json())
const { Client } = require('pg')
 
const client = new Client({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'berd2004',
  database: 'recipesSite'
})
client.connect((err) => {
  if (err) {
    console.error('connection error', err.stack)
  } else {
    console.log('connected')
  }
})

//Регистрация
app.post('/api/registration', (req, res) => {

  const data = req.body

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^[0-9a-zA-Z]{8,}$/;

  if(data.surname.match(/^\s+$/) !== null) {
    res.status(400).end('Недопустимая фамилия')
  } else if (data.name.match(/^\s+$/) !== null) {
    res.status(400).end('Недопустимое имя')
  } else if (!emailRegex.test(data.mail)) {
    res.status(400).end('Недопустимый email')
  } else if (!passwordRegex.test(data.password)) {
    res.status(400).end('Недопустимый пароль')
  } else {
    client.query(`
      INSERT INTO users (surname, name, email, password) VALUES ($1, $2, $3, $4)
      RETURNING *;
    `, [data.surname, data.name, data.mail, data.password])
    .then(result => {
      res.status(200).json(result.rows[0].id)
    })
    .catch(err => {
      res.status(400).end('Что-то пошло не так... Возможно вы уже зарегистрированы')
    })
  }
  
})

//Вход
app.get('/api/enter', (req, res) => {
  const mail = req.query.mail;
  const password = req.query.password;
  client.query(`
      SELECT *
      FROM users
      WHERE email = $1;
    `, [mail])
    .then(user => {
      user = user.rows
      if (user.length != 0 && user[0].password == password) {
        res.json(user[0])
      } else {
        res.send({errorMassage: 'Возможно вы ошиблись в логине или пароле'});
      }
    })
    .catch(e  => res.send({errorMassage: 'Возможно вы ошиблись в логине или пароле'}));
})

//Получение рецептов для общей ленты
app.get('/api/recipes', async (req, res) => {
  try{
    const recipes = await client.query(`
      SELECT recipes.id, recipes.recipe_name, recipes.cooking_instructions, recipes.author_id, users.surname, users.name
      FROM recipes
      JOIN users ON recipes.author_id = users.id;
    `);
    const ratings = await client.query(`SELECT * FROM ratings`);
    const data = {
      recipes: recipes.rows,
      ratings: ratings.rows,
    }
    res.status(200).json(data)
  } catch {
    res.status(400).end(err)
  }
})

//Получение данных профиля
app.post('/api/profile', async (req, res) => {
  const data = req.body
  //Получение имени пользователи
  let user = await client.query(`
    SELECT *
    FROM users
    WHERE id = $1;
  `, [data.id])
  user = user.rows
  //Рецепты которые пользователь сохранил
  let saveRecipes = await client.query(`
    SELECT *
    FROM saved_recipes
    WHERE user_id = $1
  `, [data.id])
  saveRecipes = saveRecipes.rows
  //Количесво сохранений рецептов пользователя
  let ourRecipesSaves = await client.query(`
    SELECT saved_recipes.user_id, saved_recipes.recipe_id, recipes.author_id
    FROM saved_recipes
    JOIN recipes ON saved_recipes.recipe_id = recipes.id
    WHERE recipes.author_id = $1
  `, [data.id])
  ourRecipesSaves = ourRecipesSaves.rows
  //Количество рецептов понравились пользователю
  let ourRecipes = await client.query(`
    SELECT *
    FROM recipes
    WHERE author_id = $1
  `, [data.id])
  ourRecipes = ourRecipes.rows
  let resp = {
    name: user[0].surname + ' ' + user[0].name,
    countSaveRecipes: saveRecipes.length,
    countOurRecipes: ourRecipes.length,
    countOurRecipesSaves: ourRecipesSaves.length
  }
  res.json(resp)
})

//Получение данных для конкретного рецепта
app.get('/api/recipes_item', async (req, res) => {
  try{
    const data = req.query
    console.log(data);
    let recipes = await client.query(`
      SELECT *
      FROM recipes
      WHERE id = $1
    `, [data.id])
    recipes = recipes.rows //получение названия, инструкции, id автора, id рецепта
    let ingridients = await client.query(`
      SELECT *
      FROM recipe_ingredients
      WHERE recipe_id = $1
    `, [data.id])
    ingridients = ingridients.rows //получение всех ингридиентов
    let flag = true
    for (let i = 0; i < ingridients.length; i++) {
      let kcalIngridients = await client.query(`
        SELECT * 
        FROM products
        WHERE product_name = $1
      `, [ingridients[i].product_name])
      kcalIngridients = kcalIngridients.rows
      if (kcalIngridients.length != 0) {
        ingridients[i].unitOfMeasurement = kcalIngridients[0].unit_of_measurement //получение единицы измерения и запись в объект
        ingridients[i].caloriesPerUnit = kcalIngridients[0].calories_per_unit //получение калорийности продукта на единицу измерения
      } else {
        flag = false
      }
    }

    let allKcal = null

    if (flag) {
      allKcal = 0
      for (let i = 0; i < ingridients.length; i++) {
        allKcal += (ingridients[i].quantity * ingridients[i].caloriesPerUnit)
      }
    }

    //получение имени автора
    let authorName = await client.query(`
      SELECT *
      FROM users
      WHERE id = $1
    `, [recipes[0].author_id])
    authorName = authorName.rows

    //проверка оценил ли пользователь данный рецепт
    let likeRecipe = await client.query(`
      SELECT rating
      FROM ratings
      WHERE id_recipe = $1 AND id_user = $2
    `, [recipes[0].id, data.user_id])
    likeRecipe = likeRecipe.rows 
    let rating
    if (likeRecipe.length == 0) {
      rating = 0
    } else {
      rating = likeRecipe[0].rating
    }

    let saveRecipe = await client.query(`
      SELECT EXISTS (
        SELECT 1
        FROM saved_recipes
        WHERE recipe_id = $1 AND user_id = $2
      ) AS "exists"
    `, [recipes[0].id, data.user_id])
    saveRecipe = saveRecipe.rows[0].exists

    let recipe = {
      name: recipes[0].recipe_name,
      ingridients: ingridients,
      instruction: recipes[0].cooking_instructions,
      kcal: allKcal,
      author: authorName[0].surname + ' ' + authorName[0].surname,
      like: rating,
      saves: saveRecipe, 
      author_id: recipes[0].author_id
    }
    res.status(200).json(recipe)
  } catch (err) {
    console.log(err);
    res.status(500).send('Что-то пошло не так')
  }
})

//Добавление рецепта
app.post('/api/add_recipe', (req, res) => {
  const data = req.body
  client.query(`
    INSERT INTO saved_recipes (recipe_id, user_id)
    VALUES ($1, $2)
  `, [data.recipe_id, data.user_id])
    .then(() => {
      res.status(200).send('')
    })
    .catch(err => {
      console.log(err)
      res.status(500)
    })
})

//Добавление оценки пользователя в бд 
app.post('/api/like_recipe', (req, res) => {
  const data = req.body
  client.query(`
    INSERT INTO ratings (id_recipe, id_user, rating)
    VALUES ($1, $2, $3)
  `, [data.recipe_id, data.user_id, data.grade])
    .then(() => {
      res.status(200).send('Успех')
    })
    .catch(err => {
      console.log(err)
      res.status(500)
    })
})

//Получение рецептов для ленты автора
app.post('/api/author_recipes', async (req, res) => {
  try{
    const data = req.body
    const recipes = await client.query(`
      SELECT recipes.id, recipes.recipe_name, recipes.cooking_instructions, recipes.author_id, users.surname, users.name
      FROM recipes
      JOIN users ON recipes.author_id = users.id
      WHERE recipes.author_id = $1;
    `, [data.author_id]);
    const ratings = await client.query(`SELECT * FROM ratings`);
    const newData = {
      recipes: recipes.rows,
      ratings: ratings.rows,
    }
    res.status(200).json(newData)
  } catch (err) {
    console.log(err);
    res.status(500).end(err)
  }
})

//Получение рецептов которые сохранил пользователь
app.post('/api/saves_recipes', async (req, res) => {
  try {
    const data = req.body

    const recipesId = await client.query(`
      SELECT recipe_id
      FROM saved_recipes
      WHERE user_id = $1
    `, [data.id])

    let recipes = []

    for (let i = 0; i < recipesId.rows.length; i++) {
      let recipe = await client.query(`
        SELECT recipes.id, recipes.recipe_name, recipes.cooking_instructions, recipes.author_id, users.surname, users.name
        FROM recipes
        JOIN users ON recipes.author_id = users.id
        WHERE recipes.id = $1
      `, [recipesId.rows[i].recipe_id])
      recipes.push(recipe.rows[0])
    }

    const ratings = await client.query(`SELECT * FROM ratings`);

    res.json({
      recipes,
      ratings: ratings.rows,
    })
  } catch (err) {
    console.log(err);
    res.status(500)
  }
})

//Создание рецептов
app.post('/api/create_recipe', async (req,res) => {
  try{
    const data = req.body
    const recipe = await client.query(`
      INSERT INTO recipes (recipe_name, cooking_instructions, author_id) 
      VALUES ($1, $2, $3) 
      RETURNING *;
    `, [data.title, data.instruction, data.user_id])

    for(let i = 0; i < data.ingridients.length; i++) {
      await client.query(`
        INSERT INTO recipe_ingredients (recipe_id, product_name, quantity) 
        VALUES ($1, $2, $3) 
      `, [recipe.rows[0].id, data.ingridients[i].name, data.ingridients[i].quantity])
    }
    
    res.send("1")
  } catch (err) {
    res.status(500).send(err)
  }
})

//Получение всех ингридиентов
app.get('/api/get_ingridients', async (req, res) => {
  try{
    const response = await client.query(`SELECT product_name FROM products;`);
    const result = response.rows
    res.status(200).json(result)
  } catch {
    res.status(400).end(err)
  }
})

app.listen(5000, () => {
  console.log(`http://localhost:5000`)
})