/****************** NEW ROUT  *************************/

  const express = require('express');
const { Client, Pool } = require('pg');
const ejs = require('ejs');

const app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs'); // Set the view engine to EJS

const client = new Client({
  host: 'tiny.db.elephantsql.com',
  user: 'jsdawjqh',
  password: 'EaGfh-f8IrBfBfH6rTRMqV1w3xQcqZXj',
  database: 'jsdawjqh',
});

client.connect()
  .then(() => console.log('Connected to the database'))
  .catch(err => console.error('Error connecting to the database:', err));

app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies

// This connected the user rotuer file located in the routes folder with user.js name
const userRoute = require('./routes/users');
const adminRoute = require('./routes/admin');

// start using the user routes, this will redirect all the /user calls to the user routes
app.use('/user', userRoute);
app.use('/admin', adminRoute  );

app.get('/', (req, res) => {
  res.redirect('/register');
});

app.get('/register', (req, res) => {
  res.sendFile(__dirname + '/register.html');
});

app.get('/backenduser', (req, res) => {
  const name = req.query.userName;
  const email = req.query.userEmail;
  const contact = req.query.contact;
  const address = req.query.address;
  const dob = req.query.dob;

  const insertQuery = "INSERT INTO students1(studentname, email) VALUES ($1, $2)";
  const values = [name, email];

  client.query(insertQuery, values)
    .then(result => {
      console.log(result);
      // Send a response or redirect as needed
      res.redirect('/profile');
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('Error inserting data');
    });
});

  
// Add a route to view data from the database
app.get('/viewData', (req, res) => {
  const selectQuery = "SELECT * FROM students1";
  client.query(selectQuery)
    .then(result => {
      const studentdata = result.rows;
      res.render('viewData', { studentdata }); // Render a view using EJS
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('Error fetching data');
    });
});

 app.get('/profile', (req, res) => {
  const studentId = req.query.id; // Adjust this to get the user's ID based on your authentication mechanism
  const selectQuery = "SELECT * FROM students1 WHERE id = $1";
  client.query(selectQuery, [studentId])
    .then(result => {
      const data = result.rows[0];
      if (data) {
        console.log('Profile data retrieved successfully:', data);
        res.render('profile', { user: data }); // Render the profile page and pass the data
      } else {
        res.send('Student not found');
      }
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('Error fetching data');
    });
}); 

app.post('/delete/:id', (req, res) => {
const id = req.params.id;
const deleteQuery = "DELETE FROM students1 WHERE id = $1"; 
client.query(deleteQuery, [id])
 .then(result => {
 console.log('Data deleted successfully');
  res.redirect('/viewData');
})
.catch(err => {
   console.error('Error deleting data:', err);
 res.status(500).send('Error deleting data');
});
 });

 app.listen(5000, (err) => {
  if (err) console.error(err);
  else console.log('Server running on port 5000');
});


