
DROP TABLE IF EXISTS items CASCADE;
CREATE TABLE items (
  id SERIAL PRIMARY KEY NOT NULL,
  name TEXT NOT NULL,
  done BOOLEAN 
);
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO labber;