DROP TABLE IF EXISTS category_item_mapping CASCADE;
CREATE TABLE category_item_mapping (
  category_id INTEGER REFERENCES categories(id),
  item_id INTEGER REFERENCES items(id)
);
