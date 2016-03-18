// console.log($.getJSON)

var apiKey = 'dc6zaTOxFJmzC'
// fullUrl should look like:  
// http://api.giphy.com/v1/gifs/search?q=funny+cat&api_key=dc6zaTOxFJmzC
var baseUrl = 'http://api.giphy.com/v1/gifs/search'
var containerEl = document.querySelector('#container')
	scrollButton = document.querySelector('#buttons button[value="scroll"]'),
	infoGridButton = document.querySelector('#buttons button[value="infoGrid"]')



var controller = function () {
	var route = location.hash.substr(1) // strips off #
	// splits route into two parts in an array
	var routeParts = route.split('/'), 
		viewType = routeParts[0],
		currentQuery = routeParts[1]	

	// check whether first part of view type/array is equal to scroll
	// if it is, run function render scroll with current query
	if (viewType === "scroll") {
		renderScrollView(currentQuery)
	}
	else if (viewType === "infoGrid") {
		renderGridView(currentQuery)
	}
	else if (viewType === "detail") {
		renderDetailView(currentQuery)
	}	
}

// has been invoked by controller	
var renderScrollView = function(query) {
	// format parameters
		var paramsObj = {
		q: query,
		api_key: apiKey
	}

	var giphyPromise = $.getJSON(baseUrl, paramsObj)

	// from arrToHTML function above, write data to page
	var handleData = function(jsonData) {
		// console.log(jsonData)
		containerEl.innerHTML = arrToHtml(jsonData.data)
	}
	giphyPromise.then(handleData)
}

var renderGridView = function(query) {
	// same as renderScroll, except need to format html differently
}

var arrToHtml = function(arrayData) {
	var htmlString = ''
	for(var i = 0; i < 5; i++) {
		var singleObj = arrayData[i]
		console.log(singleObj)
		htmlString += '<img class="gifScroll" src="' + singleObj.images.original.url + '"/>'	
	}
	return htmlString
} 

var changeView = function(event) {
	var buttonEl = event.target,
		currentQuery = location.hash.split('/')[1]
	location.hash = buttonEl.value + '/' + currentQuery
}

// listening for hashchange event
window.addEventListener('hashchange', controller)
scrollButton.addEventListener('click', changeView)
infoGridButton.addEventListener('click', changeView)


controller()

