const path = require('path')
const express = require('express')
const hbs = require('hbs')
const forecast = require('./utils/forecast')
const geocode = require('./utils/geocode')

//Defining paths for express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')
const app = express()

const port = process.env.PORT || 3000

// Setup handlebars engine and views location
app.set('view engine', 'hbs') //Used for dynamic templates
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

//setup static directory to serve
app.use(express.static(publicDirectoryPath))

// For root page
app.get('', (req, res) => {
    res.render('index', {
      title: 'Whether app',
      name: 'Mayank'  
    })
})


//For about page
app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About',
        name: 'Mayank Sharma'
    })
})

//For help page
app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help',
        name: 'Mayank',
        info: 'This is a help page'
    })
})

// Whether page
app.get('/whether', (req, res) => {
    if(!req.query.address){
        return res.send({
            error: 'Address not provided'
        })
    }

    const address = req.query.address
    geocode(address, (error, {latitude, longitude, location } = {}) => {
        if(error){
            return res.send({error})
        }
    
        forecast(latitude, longitude, (error, forecastData) => {
            if(error){
                return res.send({error})
            }

            res.send({
                forecast: forecastData,
                location,
                address
            })
        })
    })    
})

app.get('/products', (req,res) => {
    if(!req.query.search){
        return res.send({
            error: 'Search field not provided'
        })
    }

    res.send({
        products: []
    })
})

// help/ 404 page
app.get('/help/*', (req,res) => {
    res.render('404', {
        title: '404',
        name: 'Mayank Sharma',
        errMsg: 'Help article not found'
    })
})

// 404 Page
app.get('*', (req,res) => {
    res.render('404', {
        title: '404',
        name: 'Mayank Sharma',
        errMsg: 'Page not Found'
    })
})

app.listen(port, () => {
    console.log('Server started on port ' + port)
})