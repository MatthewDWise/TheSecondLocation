const MAPQUESTURL = "https://open.mapquestapi.com/geocoding/v1/address?key=7lmWauomnixpVMPwLE2ClAbNSJir7B8C&inFormat=kvp&outFormat=json&"
const ZOMATOURL = "https://developers.zomato.com/api/v2.1/search?entity_id=287&entity_type=city"
let userAddress = ["Philadelphia", "PA"]
let timeOfDate = ""
let latLong=[]
let lat = ''
let long = ''
let userCount = 1
let userRadiusFormat = 100;
let userCuisine = ''
let userCuisineFormat = 1
let secondSearch = 0
let secondArray = []
let secondSearchDisplay = ""
let secondCuisine = 0
let randomArray = []

//set time of date variable to provide specific recommendations for second location
function morningTime(){
    $("#morning").on("click", event => {
        timeOfDate = "morning";
        $("#search-options").removeClass("hidden");
        $("#time-of-day").addClass("hidden");
        console.log(timeOfDate)
    })
}
//set time of date variable to provide specific recommendations for second location
function afternoonTime(){
    $("#afternoon").on("click", event => {
        timeOfDate = "afternoon";
        $("#search-options").removeClass("hidden");
        $("#time-of-day").addClass("hidden");
        console.log(timeOfDate)
    })
}
//set time of date variable to provide specific recommendations for second location
function eveningTime(){
    $("#evening").on("click", event => {
        timeOfDate = "evening";
        $("#search-options").removeClass("hidden");
        $("#time-of-day").addClass("hidden");
        console.log(timeOfDate)
    })
}

//hide location information and show options to select food type
function food() {
    $("#cuisineButton").on("click", event => {
        $("#cuisineChoice").removeClass("hidden");
        $("#location-choice").addClass("hidden");
        $("#cuisineButton").addClass("hidden");
        $("#locationButton").addClass("hidden");
        $("#goBack2").removeClass("hidden");
        $("#cuisinechoice").removeClass("hidden");
        $("#searchQuestion").addClass('hidden');
        $(".startOver1").addClass('hidden');
        $(".startOver2").removeClass('hidden');
    })
    inputCuisine();
}
//hide cuisine information and show options to select location
function place(){
    $("#locationButton").on("click", event => {
        $("#location-choice").removeClass("hidden");
        $("#cuisinechoice").addClass("hidden");
        $("#cuisineButton").addClass("hidden");
        $("#locationButton").addClass("hidden");
        $("#goBack2").removeClass("hidden");
        $("#searchQuestion").addClass('hidden');
        $(".startOver1").addClass('hidden');
        $(".startOver2").removeClass('hidden');
        grabAddress();
    })
}
//take user address and convert to string for fetch to Mapquest for latitude and longitude
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
//take user address and combine in mapquests required format, send to fetchMapQuestSearch to send request
function formatMapQuestSearch(userAddress){
    const MPPARAMS = {
        "location": userAddress,
        "thumbMaps": "false",
    }
    let addressQuery = Object.keys(MPPARAMS).map(key => `${encodeURIComponent(key)}=${encodeURI(MPPARAMS[key])}`)
    let formattedAddressQuery = MAPQUESTURL + addressQuery.join("&");
    fetchMapQuestSearch(formattedAddressQuery)
}
//send request to Mapquest, send results to handleAddress function
function fetchMapQuestSearch(formattedAddressQuery){
    fetch(formattedAddressQuery)
    .then(response => response.json())
    .then(responseJson => handleAddress(responseJson))
    .then($("#location-choice").addClass("hidden"))
    .then($("#cuisineChoice").removeClass("hidden"))
    .then($("#cuisinechoice").removeClass("hidden"))
}
//set variables for latitude and longitude for Zomato API request
function handleAddress(responseJson){
    latLong = responseJson.results[0].locations[0].latLng;
    lat = latLong.lat;
    long = latLong.lng;
    inputCuisine();
}
//format request to Zomato and send to ZomRequest to fetch
function restaurantSearch(){
    const restPARAMS = {
        "count": userCount,
        "lat": lat,
        "lon": long,
        "radius": userRadiusFormat,
        "cuisines": userCuisineFormat,
    }
    let zomSearch = Object.keys(restPARAMS).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(restPARAMS[key])}`)
    zomSearchURL = (ZOMATOURL + '&'+ zomSearch.join('&'))
    zomRequest(zomSearchURL)
}
//fetch restaurant information from Zomato, send results to displayResults function, call secondLocation function to provide suggestions
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
//set variables for secondLocation request based on prior variable timeOfDate
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
//format secondLocation parameters and send to performSecondSearch function
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
//send fetch request to Zomato for suggestions, send results to displaySecondResults 
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


//create random numbers to use to display second search resutls, send array to function checkIt to make sure there are no repeating variable numbers
function popArray(){
    for(let i = 0; i <3; i++){
        let k =(Math.floor(Math.random()*11))
        randomArray.push(k);
        }checkIt(randomArray)
}
//check random numbers against themselves and alter so no duplicate suggestions provided to user
function checkIt(randomArray){
    for(let i = 0; i < randomArray.length; i++){
        if(randomArray[0] == randomArray[1] || randomArray[0] == randomArray[2]){
            randomArray[0]+=1;
        } if(randomArray[1] == randomArray[2]){
            randomArray[1]+=1;
        }
    }
}
//format second search results and display
function displaySecondResults(responseJson){
    let secondResults = {responseJson};
    secondSearchDisplay = "<h2>After your meal, try these locations to keep the date going!</h2>";
    for(let i = 0; i < 3; i++){
        secondSearchDisplay += `<h3><li><a href = "${secondResults.responseJson.restaurants[randomArray[i]].restaurant.menu_url}" target ="_blank">
        ${secondResults.responseJson.restaurants[randomArray[i]].restaurant.name}</a><br>${secondResults.responseJson.restaurants[randomArray[i]].restaurant.location.address}<br>
        <a href ="tel:${secondResults.responseJson.restaurants[randomArray[i]].restaurant.phone_numbers}">${secondResults.responseJson.restaurants[randomArray[i]].restaurant.phone_numbers}</a><br></li></h3>`
        $("#secondSearchResults").removeClass("hidden");
        $("#secondSearchResults").html(secondSearchDisplay);
        $(".startOver1").addClass('hidden');
        $(".startOver2").addClass('hidden');
        $("#buttonHolder").removeClass('hidden');
    }
}
//format results and display results
function displayResults(responseJson){
    let results = {responseJson}
    let resultsForDisplay = "<h2>Restaurant results:</h2>"
    for(let i = 0; i < responseJson.restaurants.length; i++){
        resultsForDisplay += `<h3><li><a href ="${results.responseJson.restaurants[i].restaurant.menu_url}" target ="_blank"><img alt ="Picture of ${results.responseJson.restaurants[i].restaurant.name}" src=
        "${results.responseJson.restaurants[i].restaurant.thumb}"><br>${results.responseJson.restaurants[i].restaurant.name}</a><br>
        ${results.responseJson.restaurants[i].restaurant.location.address}<br><a href="tel:%{results.responseJson.restaurants[i].rstaurant.phone_numbers}">${results.responseJson.restaurants[i].restaurant.phone_numbers}</a>
        <br></li></h3>`
    }
    $("#searchResults").removeClass("hidden");
    $("#searchResults").html(resultsForDisplay)
}
//handle user input cuisine and requested results numbers
function inputCuisine(){
    $("#cuisinechoice").on("click", event => {
        event.preventDefault();
        userCuisine = $("#userInputcuisine").val();
        userCount = $("#resultsNumber").val();
        userCuisineFormat = userCuisine;
        $("#cuisineChoice").addClass("hidden");
        restaurantSearch();
    })
}

//expand about section on click
function expandButton(){
    $("#expand").on("click", event => {
        $("#aboutSection").slideDown();
        $("#retract").removeClass("hidden");
        $("#expand").addClass("hidden");
        retractButton();
    })
}
//retract about section on click
function retractButton(){
    $("#retract").on("click", event => {
        $("#aboutSection").slideUp();
        $("#retract").addClass('hidden');
        $("#expand").removeClass('hidden');
    })
}
//watch for pageload and run needed functions
function watchForm(){
    food();
    place();
    morningTime();
    afternoonTime();
    eveningTime();
    popArray();
    expandButton();
}

$(watchForm)
