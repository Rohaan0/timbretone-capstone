require("dotenv").config();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const { Sequelize } = require("sequelize");


const app = express();

const { SERVER_PORT, CONNECTION_STRING } = process.env;

const sequelize = new Sequelize(CONNECTION_STRING, {
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        rejectUnauthorized: false,
      },
    },
  });
  

    const users = async () => {
        try {
          await sequelize.authenticate();
          console.log("Connection has been established successfully.");
        } catch (error) {
          console.error("Unable to connect to the database:", error);
        }
      };
      
      users();

let initialPath = path.join(__dirname, "public");

app.use(bodyParser.json());
app.use(express.static(initialPath));

app.get('/', (req, res) => {
    res.sendFile(path.join(initialPath, "index.html"));
})

app.get('/front', (req, res) => {
    res.sendFile(path.join(initialPath, "front.html"));
})

app.get('/game', (req, res) => {
    res.sendFile(path.join(initialPath, "game.html"));
})

app.get('/login', (req, res) => {
    res.sendFile(path.join(initialPath, "login.html"));
})

app.get('/register', (req, res) => {
    res.sendFile(path.join(initialPath, "register.html"));
})


app.post('/register-user', (req, res) => {
    const { name, email, password } = req.body;

    if(!name.length || !email.length || !password.length){
        res.json('fill all the fields');
    } else{
        sequelize.query(`
        INSERT INTO users (name, email, password)
        VALUES ('${name}', '${email}', '${password}')
        RETURNING name, email;
    `)
        .then(data => {
            res.json(data[0])
        })
        .catch(err => {
            if(err.detail.includes('already exists')){
                res.json('email already exists');
            }
        })
    }
})

app.post('/login-user', (req, res) => {
    const { email, password } = req.body;

    sequelize.query(`
    SELECT email, password FROM users WHERE email='${email}' AND password='${password}';`)
    .then(data => {
        if(data.length){
            res.json(data[0]);
            console.log(res.data)
        } else{
            res.json('email or password is incorrect');
        }
    })
})

app.listen(SERVER_PORT, () => {
    console.log(`Server up and running on ${SERVER_PORT}`);
  });