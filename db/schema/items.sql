

CREATE TABLE items (
  id SERIAL PRIMARY KEY NOT NULL,
  name VARCHAR(255) NOT NULL
  category_id INTEGER REFERENCES categories(id)
  done BOOLEAN 
);



