const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

// Mongoose schema
const Schema = mongoose.Schema;

// User schema for authentication
const userSchema = new Schema({});
// Integrates passport js with mongoose for user authentication
userSchema.plugin(passportLocalMongoose);
// Creating user model from schema
const User = mongoose.model('User', userSchema);

// Schema for storing website statistics
const statsSchema = new mongoose.Schema({
    // Tracking the total number of page visits
    pageVisits: { type: Number, default: 0 },
    // Tracking the total number of contact form submissions
    formSubmissions: { type: Number, default: 0 },
    // Tracking the daily vistits and storing them in an array
    dailyVisits: [{ date: Date, count: Number }],
    // Mapping the page visits by page name
    pageVisitCounts: { type: Map, of: Number, default: () => new Map() },
});

// Creating stats model from schema
const Stats = mongoose.model('Stats', statsSchema);

// Schema for contact form submissions
const contactSchema = new mongoose.Schema({
    // Setting fields for the contact form
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        match: [/.+@.+\..+/, 'Please enter a valid email address']
    },
    phone: {
        type: String,
        required: true,
        match: [/^\d{10}$/, 'Please enter a valid phone number']
    },
    subject: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    }
});

// Creating contact model from schema
const Contact = mongoose.model('Contact', contactSchema);

// Schema for portfolio items
const portfolioSchema = new mongoose.Schema({
    // Setting fields for the portfolio items
    projectType: String,
    projectName: String,
    projectDescription: String,
    projectTools: String,
    projectLink: {
        text: { type: String, default: 'Visit the app' },
        url: String
    },
    // URL or path to the project image
    projectImg: String,
    // Alt text for the project image
    projectImgAlt: String
});

// Creating portfolio model from schema
const Portfolio = mongoose.model('Portfolio', portfolioSchema);

// Schema for page content
const pageContentSchema = new Schema({
    type: { type: String, required: true },
    // Setting to mixed type so we can store any type of data
    content: Schema.Types.Mixed
});

// Schema for website pages
const pageSchema = new mongoose.Schema({
    // Setting fields for each page on the website
    link: {
        text: String,
        url: String
    },
    navButton: String,
    pageTitle: String,
    header: String,
    headerParagraph: String,
    pageSymbol: String,
    // Array of page content from the schema above
    pageContent: [pageContentSchema]
});

// Creating page model from schema
const Page = mongoose.model('Page', pageSchema);

// Exporting models so we can use it in the app
module.exports = { Contact, Portfolio, Page, User, Stats };
