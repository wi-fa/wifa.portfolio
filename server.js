// server.js
const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const passport = require('passport')
const session = require('express-session')
const flash = require('connect-flash')
const rateLimit = require('express-rate-limit')
const app = express()
const User = require('./models').User
const pageVisitRoutes = require('./routes.js')
const PORT = process.env.PORT || 3000
require('dotenv').config()

// Connect to db using Mongoose
mongoose
    // Connection string to db
    .connect(process.env.MONGODB_URI)
    .then(() => {
        // If connection works i success messages logs
        console.log('Connected to MongoDB Atlas')
    })
    .catch((err) => {
        // If error a error message is logged
        console.error('MongoDB connection error', err)
    })

// Set up view engine and views directory
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

// Serve static files from the 'public' directory
app.use(express.static('public'))

// Parse URL-encoded
app.use(express.urlencoded({ extended: false }))

// Middlewear to block bots
app.use((req, res, next) => {
    const userAgent = req.headers['user-agent']

    // Check if the User-Agent is one that you want to block
    if (userAgent.includes('BadBot')) {
        return res.status(403).send('Access denied')
    }

    // If the User-Agent is not blocked, continue to the next middleware
    next()
})

// Limit requests (since my pageVisits was spammed after deploy)
// const limiter = rateLimit({
//     // 15 minutes
//     windowMs: 15 * 60 * 1000,
//     // limit each IP to 50 requests per windowMs
//     max: 50 //
// })

//  apply to all requests
// app.use(limiter)

// Configure express-session
app.use(
    session({
        // Secret key for signing the session ID cookie
        secret: process.env.SESSION_SECRET,
        // Dont resave session if it hasnt been modified
        resave: false,
        // Do not save uninitialized sessions
        saveUninitialized: false
    })
)

// Initialize Passport and use with express-session
app.use(passport.initialize())
app.use(passport.session())

app.use(flash())

// Configure passport to use User model for authentication
passport.use(User.createStrategy())

// Set up session serialization and deserialization
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

// Import and use the routes defined in routes.js
const routes = require('./routes')
app.use('/', routes)

// Additional routes for page visit statistics
app.use('/api', pageVisitRoutes)

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err)

    // Render the error.ejs template with the error message
    res.status(500).render('error', { error: err })
})

// Start the server on the specified PORT
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
