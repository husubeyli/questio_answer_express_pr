const express = require('express');
const dotenv = require('dotenv')
const path = require('path');
const connectDatabase = require('./helpers/database/connectDatabase')

const question = require('./routers/question')
const auth = require('./routers/auth')
const routers = require('./routers/index')
const customErrorHandler = require('./middlewares/errors/customErrorHandler')

// Envoirment variables 
dotenv.config({
    path: "./config/env/config.env"
});

// MongoDB connection
connectDatabase()
const app = express();

// Express body Middleware
app.use(express.json());

// Express send form data Middleware
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 5001;



// Routers Middleware

app.use('/api', routers)

// app.use('/api/questions', question)
// app.use('/api/auth', auth)


// Error handling middleware
app.use(customErrorHandler)


// Static files middleware
app.use(express.static(path.join(__dirname, 'public')));


app.listen(PORT, () => {
    console.log(`App started on ${PORT} PORT. Mode: ${process.env.NODE_ENV}`);
});



// app.get('/', (req, res) => {
//     res.send('Hello Question Answer Api UPDATED');
// });

// app.get('/api/questions', (req, res) => {
//     res.send('All questions');
// });
