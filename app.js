const express = require('express');
const {Client, pool} = require('pg');
const ejs = require('ejs');

const app = express();

app.set('views', __dirname + '/views');
app.set('views engine', 'ejs');

const client = new Client({
  host: 'tiny.db.elephantsql.com',
  user: 'jsdawjqh',
  password: 'EaGfh-f8IrBfBfH6rTRMqV1w3xQcqZXj',
  database: 'jsdawjqh',
  //port: 5432,
});

client.connect()
.then(() => console.log('Connected to the database'))
.catch(err => console.error('Error connecting DB:', err));

//app.use(express.urlencided({extended: true}));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/home.html');
})

app.get('/register', (req, res) => {
    res.sendFile(__dirname + '/register.html');
})

app.get('/database', (req, res) => {
    const name = req.query.name;
    const email = req.query.email;
    const password = req.query.password;
    const contact = req.query.contact;
    const dob = req.query.dob;

    const insertQuery = "INSERT INTO usinfo(name, emil, password, contact, dob) VALUES ($1,$2,$3,$4,$5)";
    const values = [name,email,password,contact,dob];

    client.query(insertQuery, values)
    .then(result => {
        console.log(result);
        res.redirect('/home');
    })
    .catch(err => {
        console.error(err);
        res.status(500).send('Error inserting data');
    })
})

app.get('/viewData', (req, res)=> {
    const selectQuery = "SELECT * FROM usinfo";
    client.query(selectQuery)
    .then(result => {
        const studentdata = result.rows;
        res.render('viewData', {studentdata});
    })
    .catch(err => {
        console.error(err);
        res.status(500).send('Error fetching data');
    });
});


app.listen(3000, (err) => {
    if (err) console.error(err);
    else console.log('Server running on port 5000');
});