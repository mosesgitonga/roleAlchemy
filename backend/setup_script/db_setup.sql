-- Create the development database
CREATE DATABASE roleAlchemy_developer_db;

-- Create the user with a password
DO
$$
BEGIN
   IF NOT EXISTS (
       SELECT FROM pg_catalog.pg_roles 
       WHERE rolname = 'dev'
   ) THEN
       CREATE ROLE dev WITH LOGIN PASSWORD '123456';
   END IF;
END
$$;

-- Grant privileges on the database to the user
GRANT ALL PRIVILEGES ON DATABASE roleAlchemy_developer_db TO dev;
