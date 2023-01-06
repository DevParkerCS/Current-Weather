const searchBtn = document.querySelector(".search-btn")
const searchForm = document.querySelector(".searchForm")

const getLocationData = async (location) => {
    try {
        await axios.get(`http://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=1&appid=${config.MY_KEY}`)
            .then((response) => {
                console.log(response.data)
                getLatLong(response.data)
            })
    }
    catch (e) {
        console.log("Error", e)
    }
}

const getLatLong = (locationData) => {
    const locationLatitude = locationData[0].lat
    const locationLongitude = locationData[0].lon
    console.log(locationLatitude, locationLongitude)
    getWeatherInfo(locationLatitude, locationLongitude)
}

const getWeatherInfo = async (latitude, longitude) => {
    console.log(latitude, longitude)
    try {
        await axios.get(`http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=imperial&appid=${config.MY_KEY}`)
            .then((response) => {
                console.log(response)
                getSunTimeInfo(response.data.sys)
            })
    }
    catch (e) {
        console.log("ERROR!!", e)
    }
}


// Gets the sunrise and sunset time from the api data
const getSunTimeInfo = (locationData) => {
    const sunriseUnix = locationData.sunrise
    const sunriseTime = convertUnixtoTime(sunriseUnix)
    const sunsetUnix = locationData.sunset
    const sunsetTime = convertUnixtoTime(sunsetUnix)
}

// Expects a parameter in Unix time and turns it into standard local Time
const convertUnixtoTime = (unixTime) => {
    try {
        let timeStamp = new Date(unixTime * 1000)
        let hour = timeStamp.getHours()
        let meridiemHour = decypherAmPm(hour)
        let min = timeStamp.getMinutes()
        if (meridiemHour === "PM") { hour -= 12; }
        if (min < 10) { min = `0${min}` }
        const convertedTime = `${hour}:${min} ${meridiemHour}`
        console.log(convertedTime)
        return convertedTime
    }
    catch (e) {
        console.log("Invalid Parameter")
    }
}

// Expects a Int parameter from convertUnixtoTime() and decides if time is AM or PM
const decypherAmPm = (time) => {
    if (time > 12) { time = "PM" }
    else { time = "AM" }
    return time
}

//Starts search using Search Form input value prevent's site from refreshing on submit 
searchBtn.addEventListener("click", (e) => {
    e.preventDefault()
    getLocationData(searchForm[0].value)
})