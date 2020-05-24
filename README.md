# Knowledge - Back End

API to serve [Knowledge - Front End](https://github.com/afmdaniel/knowledge-frontend)

## Technologies

- Node.js
- Express 
- Jwt
- Passport
- PostgreSQL
- Knex
- MongoDB
- Mongoose

## Getting Started

### Install PostgreSQL

#### Windows

[Download](https://www.enterprisedb.com/downloads/postgres-postgresql-downloads) and install PostgreSQL version 9.6<br>

#### Linux (Ubuntu)
```
sudo apt update
sudo apt install postgresql postgresql-contrib -y
```

### MongoDB

1. Create a cluster at [Mongo Atlas](https://www.mongodb.com/cloud/atlas)
2. Connect it to the application by rewritting the URL at './config/mongoDB.js' file with your cluster URL

### Set Database configs

Set you local settings in sample_env file and rename it to .env<br>
Make sure to set the correct settings.

### Install dependecies
```
npm install
```

### Run in development mode
```
npm start
```

### Compiles and minifies for production
```
npm run production
```

### Admin Privileges

By default, new users are signup without admin privilages.<br>
To create a new User with admin privileges:

1. Comment lines 17 and 18 from 'api/users.js'
2. Make a POST request to 'http://localhost:3000/signup' passing JSON with "admin":"true" in the body of request.
3. Uncomment lines 17 and 18.
4. Now you can use [Knowledge - Front End](https://github.com/afmdaniel/knowledge-frontend) as admin
