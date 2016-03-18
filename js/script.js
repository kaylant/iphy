// console.log(Backbone)

// http://api.giphy.com/v1/gifs/search?q=funny+cat&api_key=dc6zaTOxFJmzC   

// -------------- Models -------------- //
var IphyModel = Backbone.Model.extend ({
	defaults: {
		description: "no description provided",
		image_type: "gif"
	},

	_apiKey: "dc6zaTOxFJmzC",

	_generateUrl: function(id) {
		var fullUrl = "http://api.giphy.com/v1/gifs/" + id
		this.url = fullUrl
	},

	parse: function(JSONData) { //parse backbone magic 
        if (JSONData.data) return JSONData.data //this is the case when IphyModel is fetching
        else return JSONData //this the case when one of many in the collection
    }
})

var IphyCollection = Backbone.Collection.extend ({
	_apiKey: "dc6zaTOxFJmzC",
	url: "http://api.giphy.com/v1/gifs/search?", 
	model: IphyModel, 
     parse: function(JSONData) { //parse backbone magic 
        return JSONData.data //will filter data wanted 
    }
})

// -------------- Views -------------- //

var IphyScrollView = Backbone.View.extend ({
	el: "#container",

	initialize: function(someCollection) {
		this.collection = someCollection
		var boundRenderFunction = this._render.bind(this)
		this.collection.on("sync", boundRenderFunction)
	},
 
	// hard mode for hw 
	events: {
		"click img": "_triggerDetailView", 
		"keydown input": "_searchByKeyword"
	},

	_searchByKeyword: function(keyEvent) {
		if (keyEvent.keyCode === 13) {
			var wordSearched = keyEvent.target.value
			location.hash = "scroll/" + wordSearched
		}
	},

	_triggerDetailView: function(clickEvent) {
		//console.log(clickEvent.target)
		var imgNode = clickEvent.target
		// router listening for hash change
		window.location.hash = "detail/" + imgNode.getAttribute('gifid')
		//console.log("success")
	},

	_render: function() {
		var gifUrlString = "<input>"
		var dataArray = this.collection.models
		console.log(this.collection.models)
		for (var i = 0; i < dataArray.length; i++){
			var gifObj = dataArray[i]
			// console.log(gifObject.images.original.url)
			gifUrlString += '<img gifid="' + gifObj.get('id') + '" class="gifScroll" src="' + gifObj.get('images').original.url + '">'
		}
		this.el.innerHTML = gifUrlString
	}
})

var DetailView = Backbone.View.extend ({
	el: "#container",

	initialize: function(someModel) {
		this.model = someModel
		//console.log(this.model)
		var boundRenderFunction = this._render.bind(this)
		this.model.on("sync", boundRenderFunction)
	},

	_getShortDescr: function(description) {
		return description.substr(0,10) + '...'
	},

    _render: function() {
        console.log(this.model)
        var newHtmlString = '<img src="' + this.model.get('images').original.url + '">'
        	newHtmlString += '<p class="descr">' + this._getShortDescr(this.model.get('description')) + '</p>' 
        this.el.innerHTML = newHtmlString
    }
})


// -------------- Router -------------- //
// routes: 
// scroll view
// detail view
var IphyRouter = Backbone.Router.extend ({
	routes: {
		"detail/:id": "handleDetailView",
		"*scroll/:query": "handleScrollView"
	},

	handleScrollView: function(query){
		var collection = new IphyCollection()
		var nv = new IphyScrollView(collection)
		// fetch taking these paramaters, HAVE TO USE THIS FOR ETSY: jsonp line
		collection.fetch({
			// dataType: "jsonp",
			data: {
				q: query,
				api_key: collection._apiKey
			}
		})
		// collection.where({image_type:"gif"})
	},

	//hw master mode pass in where and describe something about its attributes (above)

	handleDetailView: function(id){
		var nm = new IphyModel()
		nm._generateUrl(id)
		var dv = new DetailView(nm)
		nm.fetch({
			data: {
				api_key: nm._apiKey
			}
		})
	},

	// start listening for hash change events
	initialize: function() {
		Backbone.history.start()
	}

})

var rtr = new IphyRouter()