CREATE TABLE public.users (
  id SERIAL PRIMARY KEY,
  surname VARCHAR(30) NOT NULL,
  name VARCHAR(30) NOT NULL,
  email VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(25) NOT NULL
);



CREATE TABLE public.recipes (
  id SERIAL PRIMARY KEY,
  recipe_name VARCHAR(80) NOT NULL,
  cooking_instructions VARCHAR(255) NOT NULL,
  author_id INTEGER NOT NULL,
  CONSTRAINT recipes_fk0 FOREIGN KEY (author_id) REFERENCES users(id)
);



CREATE TABLE public.ratings (
  id_recipe INTEGER NOT NULL,
  rating INTEGER NOT NULL,
  id_user INTEGER NOT NULL,
  CONSTRAINT ratings_pk PRIMARY KEY (id_recipe, id_user),
  CONSTRAINT ratings_fk0 FOREIGN KEY (id_recipe) REFERENCES recipes(id),
  CONSTRAINT ratings_fk1 FOREIGN KEY (id_user) REFERENCES users(id)
);



CREATE TABLE public.saved_recipes (
  user_id INTEGER NOT NULL,
  recipe_id INTEGER NOT NULL,
  CONSTRAINT saved_recipes_pk PRIMARY KEY (user_id, recipe_id),
  CONSTRAINT saved_recipes_fk0 FOREIGN KEY (user_id) REFERENCES users(id),
  CONSTRAINT saved_recipes_fk1 FOREIGN KEY (recipe_id) REFERENCES recipes(id)
);



CREATE TABLE public.products (
  product_name VARCHAR(50) NOT NULL PRIMARY KEY,
  calories_per_unit FLOAT,
  unit_of_measurement VARCHAR(5)
);



CREATE TABLE public.recipe_ingredients (
  recipe_id INTEGER NOT NULL,
  product_name VARCHAR(50) NOT NULL,
  quantity INTEGER NOT NULL,
  CONSTRAINT recipe_ingredients_pk PRIMARY KEY (recipe_id, product_name),
  CONSTRAINT recipe_ingredients_fk0 FOREIGN KEY (recipe_id) REFERENCES recipes(id),
  CONSTRAINT recipe_ingredients_fk1 FOREIGN KEY (product_name) REFERENCES products(product_name)
);
