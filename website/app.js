/* Variables */
const baseURL = 'http://api.openweathermap.org/data/2.5/weather?zip=';
const apiKey = '&appid=ebcafb4360283dbfdcc63aaad0a363f9';
const form = document.querySelector('.app_form');
const icons = document.querySelectorAll('.entry_icon');

//Date
let date = new Date();
let newDate = date.getMonth() + '.' + date.getDate() + '.' + date.getFullYear();

// Event listener 
document.getElementById('generate').addEventListener('click', performAction);

function performAction(e) {
    e.preventDefault();
    const newZip = document.getElementById('zip').value;
    if (newZip === "")
    {
        icons.forEach(icon => icon.style.opacity = '1');
        document.getElementById('date').innerHTML = "ERROR";
        document.getElementById('temp').innerHTML = "ERROR";
        document.getElementById('content').innerHTML = "Please Insert new Zip Code.";
        form.reset();
        return;
    }
    const content = document.getElementById('feelings').value;
    getWeather(baseURL, newZip, apiKey)
        .then(function (userData) {
            if (userData.cod !== 200) {
                //debugger;
                icons.forEach(icon => icon.style.opacity = '1');
                document.getElementById('date').innerHTML = "ERROR";
                document.getElementById('temp').innerHTML = "ERROR";
                document.getElementById('content').innerHTML = `ERROR - ${userData.cod} ${userData.message}`;
                form.reset();
                return;
            }
            postData('/add', { date: newDate, temp: userData.main.temp, content });
            updateUI();
        });
    form.reset();
}

/* Function to GET Web API Data*/
const getWeather = async (baseUrl, newZip, apiKey) => {
    const res = await fetch(baseUrl + newZip + apiKey);
    try {
        const userData = await res.json();
        return userData;
    } catch (error) {
        console.log("error", error);
    }
    return window.userData;
}

/* Function to POST data */
const postData = async (url = '', data = {}) => {
    const req = await fetch(url,
        {
            method: "POST",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json;charset=UTF-8"
            },
            body: JSON.stringify({
                date: data.date,
                temp: data.temp,
                content: data.content
            })
        });

    try {
        const newData = await req.json();
        return newData;
    }
    catch (error) {
        console.log(error);
    }
    return window.newData;
};


const updateUI = async () => {
    const request = await fetch('/all');
    try {
        //        debugger;
        const allData = await request.json();
        icons.forEach(icon => icon.style.opacity = '1');
        document.getElementById('date').innerHTML = allData.date;
        document.getElementById('temp').innerHTML = allData.temp;
        document.getElementById('content').innerHTML = allData.content;
    }
    catch (error) {
        console.log("error", error);
    }
};
