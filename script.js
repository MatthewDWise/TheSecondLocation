const MAPQUESTURL = "https://open.mapquestapi.com/geocoding/v1/address?key=71mWauomnixpVMPwLE2ClAbNSJir7B8C&inFormat=kvp&outFormat=json&"
const ZOMATOURL = "https://developers.zomato.com/api/v2.1/search?entity_id=287&entity_type=city"
let userAddress = ["Philadelphia", "PA"]
let timeOfDate = ""
let latLong=[]
let lat = ''
let long = ''
let userCount = 1
let userRadiusFormat = 1000;
let userCuisine = ''
let userCuisineFormat = 1
let secondSearch = 0
let secondArray = []
let secondSearchDisplay = ""
let secondCuisine = 0
let randomArray = []

function morningTime(){
    $("#morning").on("click", event => {
        timeOfDate = "morning";
        $("#search-options").removeClass("hidden");
        $("#time-of-day").addClass("hidden");
        console.log(timeOfDate)
    })
}

function afternoonTime(){
    $("#afternoon").on("click", event => {
        timeOfDate = "afternoon";
        $("#search-options").removeClass("hidden");
        $("#time-of-day").addClass("hidden");
        console.log(timeOfDate)
    })
}

function eveningTime(){
    $("#evening").on("click", event => {
        timeOfDate = "evening";
        $("#search-options").removeClass("hidden");
        $("#time-of-day").addClass("hidden");
        console.log(timeOfDate)
    })
}

function startOver(){
    $("#goBack1").on("click", event => {
        $("#time-of-day").removeClass("hidden");
        $("#search-options").addClass("hidden");
        $("#cuisineChoice").addClass("hidden");
        $("#location-choice").addClass("hidden");
        $("#cuisineButton").removeClass("hidden");
        $("#locationButton").removeClass("hidden");
        $("#goBack2").addClass("hidden");
        $("#searchResults").addClass("hidden");
        $("#secondSearchResults").addClass("hidden");
        $("#userInputAddress").val(' ')
    })
}

function goBack2(){
    $("#goBack2").on("click", event => {
        $("#cuisineChoice").addClass("hidden");
        $("#location-choice").addClass("hidden");
        $("#cusineButton").removeClass("hidden");
        $("#locationButton").removeClass("hidden");
        $("#goBack2").addClass("hidden");
        $("#searchResults").addClass("hidden");
        $("#secondSearchResults").addClass("hidden");
        $("#userInputAddress").val(" ");
        $("#secondSearchResults").addClass("hidden");
    })
}

function food() {
    $("#cuisineButton").on("click", event => {
        $("#cuisineChoice").removeClass("hidden");
        $("#location-choice").addClass("hidden");
        $("#cuisineButton").addClass("hidden");
        $("#locationButton").addClass("hidden");
        $("#goBack2").removeClass("hidden");
        $("#cuisinechoice").removeClass("hidden");
    })
    inputCuisine();
}

function place(){
    $("#locationButton").on("click", event => {
        $("#location-choice").removeClass("hidden");
        $("#cuisinechoice").addClass("hidden");
        $("#cuisineButton").addClass("hidden");
        $("#locationButton").addClass("hidden");
        $("#goBack2").removeClass("hidden");
        grabAddress();
    })
}

function grabAddress(userInputAddress){
    $("#locationchoice").on("click", event => {
        event.preventDefault();
        $("#location-choice").addClass("hidden");
        $("#cuisinechoice").removeClass("hidden");
        let addressOne = $("#userInputAddress").val();
        addressOne = addressOne.split(" ");
        userAddress.unshift(addressOne);
        userAddress = userAddress.toString().replace(/[,]+/g,'+');
        formatMapQuestSearch(userAddress);
    })
}

function formatMapQuestSearch(userAddress){
    const MPPARAMS = {
        "location": userAddress,
        "thumbMaps": "false",
    }
    let addressQuery = Object.keys(MPPARAMS).map(key => `${encodeURIComponent(key)}=${encodeURI(MPPARAMS[key])}`)
    let formattedAddressQuery = MAPQUESTURL + addressQuery.join("&");
    fetchMapQuestSearch(formattedAddressQuery)
}

function fetchMapQuestSearch(formattedAddressQuery){
    fetch(formattedAddressQuery)
    .then(response => response.json())
    .then(responseJson => handleAddress(responseJson))
    .then($("#location-choice").addClass("hidden"))
    .then($("#cuisineChoice").removeClass("hidden"))
    .then($("#cuisinechoice").removeClass("hidden"))
}

function handleAddress(responseJson){
    latLong = responseJson.results[0].locations[0].latLng;
    lat = latLong.lat;
    long = latLong.lng;
    inputCuisine();
}

function restaurantSearch(){
    const restPARAMS = {
        "count": userCount,
        "lat": lat,
        "lon": long,
        "radius": userRadiusFormat,
        "cuisines": userCuisineFormat,
    }
    let zomSearch = Object.keys(restPARAMS).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(restPARAMS[key])}`)
    zomRequest(zomSearchURL)
}

function zomRequest(zomSearchURL){
    fetch(zomSearchURL, {
        headers: {
            "user-key": "7c8262a5d0a41d6fa0df9a6732e3615f",
        }
    })
    .then(response => response.json())
    .then(responseJson => displayResults(responseJson))
    .catch(error => alert(error))
    secondLocation();
}

function secondLocation(){
    if(timeOfDate == "morning"){
        secondSearch = "6"
        secondCuisine = "161"
    } else if (timeOfDate == "afternoon"){
        secondSearch = "11"
        secondCuisine = "100"}
        else {(timeOfDate =="evening")
        secondSearch = "14"
        secondCuisine = "268"
    } secondLocationSearch();
}

function secondLocationSearch(){
    secondPARAMS = {
        "lat": lat,
        "lon": long,
        "radius": userRadiusFormat,
        "category": secondSearch,
        "cuisines": secondCuisine,
    }
    let formatSecondSearch = Object.keys(secondPARAMS).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(secondPARAMS[key])}`)
    secondSearchURL = (ZOMATOURL + '&' + formatSecondSearch.join('&'))
    performSecondSearch(secondSearchURL)
}

function performSecondSearch(){
    fetch(secondSearchURL, {
        headers: {
            "user-key": "7c8262a5d0a41d6fa0df9a6732e3615f",
        }
    })
    .then(response => response.json())
    .then(responseJson => displaySecondResults(responseJson))
    .catch(error => alert(error))
}



function popArray(){
    for(let i = 0; i <3; i++){
        let k =(Math.floor(Math.random()*11))
        randomArray.push(k);
        }checkIt(randomArray)
}

function checkIt(randomArray){
    for(let i = 0; i < randomArray.length; i++){
        if(randomArray[0] == randomArray[1] || randomArray[0] == randomArray[2]){
            randomArray[0]+=1;
        } if(randomArray[1] == randomArray[2]){
            randomArray[1]+=1;
        }
    }
}

function displaySecondResults(responseJson){
    let secondResults = {responseJson};
    secondSearchDisplay = "<h2>After your meal, try these locations to keep the date going!</h2>";
    for(let i = 0; i < 3; i++){
        secondSearchDisplay += `<h4><li><a href = "${secondResults.responseJson.restaurants[randomArray[i]].restaurant.menu_url}" target ="_blank">
        ${secondResults.responseJson.restaurants[randomArray[i]].restaurant.name}</a><br>${secondResults.responseJson.restaurants[randomArray[i]].restaurant.location.address}<br>
        <a href ="tel:${secondResults.responseJson.restaurants[randomArray[i]].restaurant.phone_numbers}">${secondResults.responseJson.restaurants[randomArray[i]].restaurant.phone_numbers}</a><br></li></h4>`
        $("#secondSearchResults").removeClass("hidden");
        $("#secondSearchResults").html(secondSearchDisplay)
    }
}

function displayResults(responseJson){
    let results = {responseJson}
    let resultsForDisplay = "<h2>Restaurant results:</h2>"
    for(let i = 0; i < responseJson.restaurants.length; i++){
        resultsForDisplay += `<h3><li><a href ="${results.responseJson.restaurants[i].restaurant.menu_url}" target ="_blank">${results.responseJson.restaurants[i].restaurant.name}</a><br>
        ${results.responseJson.restaurants[i].restaurant.location.address}<br><a href="tel:%{results.responseJson.restaurants[i].rstaurant.phone_numbers}">${results.responseJson.restaurants[i].restaurant.phone_numbers}</a>
        <br></li></h3>`
    }
    $("#searchResults").removeClass("hidden");
    $("#searchResults").html(resultsForDisplay)
}

function inputCuisine(){
    $("#cuisinechoice").on("click", event => {
        event.preventDefault();
        userCuisine = $("#userInputcuisine").val();
        userCount = $("#resultsNumber").val();
        usercuisineFormat = userCuisine;
        $("#cuisineChoice").addClass("hidden");
        restaurantSearch();
    })
}

function watchForm(){
    food();
    place();
    morningTime();
    afternoonTime();
    eveningTime();
    startOver();
    goBack2();
    popArray();
}

$(watchForm)
