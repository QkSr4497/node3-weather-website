const path = require('path');   // core node modules (built in - no need to install) before npm modules
const express = require('express');
const hbs = require('hbs');
const forecast = require('./utils/forecast');
const geocode = require('./utils/geocode');

// console.log(__dirname);   // path to the directory of the file (provided by the wrapper function)
// console.log(__filename);    // path to the file (provided by the wrapper function)
// console.log(path.join(__dirname, '../public'));
const app = express();  // creating a new express application

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views'); // absolute path to the new templates/views folder (which is instead the previous default folder called views)
const partialsPath = path.join(__dirname, '../templates/partials');

// Setup handlebars engine and views location
app.set('view engine', 'hbs');  // telling express which templating engine we installed
                                // 2 arguments: the key is the setting name and the value we want to set for the setting
                                // express expects all the views (here the handlebars views) in a "views" folder in the root of the project
                                // to use view pages we need to setup a route
app.set('views', viewsPath);    //changing the path for views
hbs.registerPartials(partialsPath); // changing the path to the partials


// Setup static directory to serve
app.use(express.static(publicDirectoryPath));  // use is a way to customize our server to serve up the folder
                                               // static takes a path to the folder we want to serve up
                                               // here the server serves the static assets which are in public directory
                                               // static means no matter how many times we refresh the page, the assets won't change (for example the picture)
                                               // now when visiting the root of our website we will get index.html








app.get('', (req, res) => {
    res.render('index', {   // allows to render one of our views (handlebars templates), we configured express to use the view engine: hbs
                            // no need for the file extension
                            // when render called, express goes to that view and converts it to html and makes sure it gets back to the requestor
                            // to provide a value that is accessible to the template, we provide a second argument to render
                            // here the second value is an object which contains the values we want that view to access
        title: 'Weather',
        name: 'Yevgeni K'
    });
                          
});

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About page',
        name: 'Yevgeni K'
    });
});

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help page',
        helpText: 'This is some helpful text.',
        name: 'Yevgeni K'
    });
});


// allows to render one of our views (handlebars templates), we configured express to use the view engine: hbs
// no need for the file extension
// when render called, express goes to that view and converts it to html and makes sure it gets back to the requestor


// app.get('', (req, res) => {  // get function gets 2 agrguments: the first for the route and second is a function the describes what we want to do when someone enters the route in the first argumnet 
//                              // empty string in first argument is for the root of our website
//                              // the function gets called with 2 arguments: first is an object containing information about the incomming requrst to the server. the second is the response containing methods
//                              // that allow to customize what we are going to send back to the requester

//     // res.send('Hello express!'); // this message will send back a text response to the browser
//     res.send('<h1>Weather</h1>');   // providing html right inside the string          
// });


// app.get('/help', (req, res) => {    // setting up a second route, this time for the help page
//     // res.send('Help page');
//     // res.send({  // passing to send function an object (we can send an array as well). when vising the page were gonna get a JSON response back
//     //             // express detects that we provided an object and will automatically stringfy the object to JSON for us
//     //     name: 'Yevgeni',
//     //     age: 31
//     // });

//     res.send([{ // passing an array of objects
//         name: 'Andrew'
//     }, {
//         name: 'Yevgeni'
//     }]);
// });


// app.get('/about', (req, res) => {   
//     // res.send('About page');
//     res.send('<h1 style="font-size:900%;">About page</h1>');   // providing html right inside the string 
// });


app.get('/weather', (req, res) => {   
    // res.send('Your weather');
    if (!req.query.address) {   // query is the information provided in the url    
        return res.send({   // only can send one response for each request, so we want to return if there is no address
                            // if you send more than one response an error message will appear: "Cannot set headers after they are sent to the client"
            error: 'You must provide an address!'
        });
    }

    geocode(req.query.address, (error, { latitude, longtitude, location } = {}) => {    // callback chaining, and using new Object destructuring syntax
                                                                                        // if we hadn't provided the object's default value to an empty object
                                                                                        // then app will try to destructre an empty object incase of a bad address
                                                                                        // and the server would crash
        if (error) {
            return res.send({   // only can send one response for each request, so we want to return if there is no address
                error   // using the shorthand
            });
        }
        forecast(latitude, longtitude, (error, forecastData) => {
            if (error) {
                return res.send({   // only can send one response for each request, so we want to return if there is no address
                    error   // using the shorthand
                });
            }

            res.send({
                forecast: forecastData,
                location,
                address: req.query.address
            });
        });
    });
 
});

app.get('/products', (req, res) => {
    if (!req.query.search) {    
        return res.send({   // only can send one response for each request, so we want to return if there is no search
                            // if you send more than one response an error message will appear: "Cannot set headers after they are sent to the client"
            error: 'You must provide a search term!'
        });
    }

    console.log(req.query.search);
    res.send({
        products: []
    });
});

app.get('/help/*', (req, res) => {    // the star /help/* means to match anything the hasn't been matches so far and starts with /help/
                                      // this way when someone is trying to get to some help page but didn't write it correctly
                                      // we can show some spesific message
    // res.send('Help article not found!');
    res.render('404', {
        title: '404',
        name: 'Yevgeni K',
        errorMessage: 'Help article not found.'
    });
   
});

app.get('*', (req, res) => {    // the star * means to match anything the hasn't been matches so far - for 404
                                // the get function has to come last after all routes are set up!
    // res.send('My 404 page');
    res.render('404', {
        title: '404',
        name: 'Yevgeni K',
        errorMessage: 'Page not found.'
    });
});



// app.com
// app.com/help
// app.com/about

app.listen(3000, () => {    // starts up the server and has it listen on port 3000 which is good for our local devloping environment and for the purpose for viewing things on our machine
                            // the callback function is optional and it runs when the server is up and running. the process of stating up a sever is an asynchronous process
                            // the server will stay up and running, listening and processing new requests untill we close it
                            // everytime we make a change we need to restart the server
                            // enterypoint for example for the help page: "localhost:3000/help"   for the root:  "localhost:3000"
    console.log('Server is up on port 3000.');  // will dispay when running the application
}); 





