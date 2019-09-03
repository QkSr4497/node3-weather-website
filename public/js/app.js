// ***** client side JavaScript which will run in the browser *****

console.log('Client side javascript file is loaded!');

// fetch('http://puzzle.mead.io/puzzle'). then((response) => { // the callback function will run when the data is available (meaning in asynchronous way)
//                                                             // fetch is browser based API (it's not accesible in a backend node script)

//     response.json().then((data) => {    // the callback function will run when the JSON data has arrived and been parsed
//         console.log(data);
//     });
// });




const weatherForm = document.querySelector('form');
const search = document.querySelector('input');
const messageOne = document.querySelector('#message-1');
const messageTwo = document.querySelector('#message-2');

// messageOne.textContent = ''; 

weatherForm.addEventListener('submit', (e) => {    // first argument is the name of the event we trying to listen for
                                                   // the second is a callback function which runs everytime this event occurs
                                                   // e is an event object
    e.preventDefault(); // prevents default refreshing of the browser when the form submits

    const location = search.value;


    messageOne.textContent = 'Loading..';
    messageTwo.textContent = '';  
    fetch('/weather?address=' + location).then((response) => { // the callback function will run when the data is available (meaning in asynchronous way)
        // fetch is browser based API (it's not accesible in a backend node script)

        response.json().then((data) => {    // the callback function will run when the JSON data has arrived and been parsed
            if (data.error) {
                // console.log(data.error);
                messageOne.textContent = data.error;
            }
            else {
                // console.log(data.location);
                // console.log(data.forecast);
                messageOne.textContent = data.location;
                messageTwo.textContent = data.forecast;  
            }
        });
    });
});


