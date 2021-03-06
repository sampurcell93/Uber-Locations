var API_GLOBALS = { 

	key: "AIzaSyBoS1bfOyPBTbYH1GhtD4xRs9XrT17nGwg"

}

var mapObject = {
	map: "",
	mapIdentifier: "map-canvas",
	/* Initializes a V3 Google Map to the User's Location*/ 
	initializeMap: function(orig_coords) {

		if (typeof orig_coords == "undefined") {
			alert("Your location is not being reported correctly by google. By their own admission, their app can be unreliable.")
			orig_coords = { latitude: 37.7736, longitude: 122.4214};
		}
		var coords = new google.maps.LatLng(orig_coords.latitude, orig_coords.longitude);
	    var mapOptions = {
	      center: coords,
	      zoom: 8,
	      mapTypeId: google.maps.MapTypeId.ROADMAP
	    };
	    /* instantiate the map */
	    map = new google.maps.Map(document.getElementById(this.mapIdentifier),
	        mapOptions);
	    /* allow access by backbone*/
	    this.map = map;
	  	/* set a marker at the huser's current location */
	    var yourLocation = this.placeMarker(coords, "You are nearby this location right now");
	    return coords;
	
	},
	/* Set a marker at a given latitude and longitude, and label it */
	placeMarker: function(location, name) {
	
		var contentBox = "<div class='map-box'>" +
			name + "</div>";

		var infoWindow = new google.maps.InfoWindow({
			content: contentBox
		});
		var marker = new google.maps.Marker({
     	 	position: location,
      	 	map: map,
      	 	title: name
  		});
		google.maps.event.addListener(marker, 'mouseover', function() {
 			 infoWindow.open(map,marker);
		});
		google.maps.event.addListener(marker, 'mouseout', function() {
 			 infoWindow.close(map,marker);
		});

  		map.setCenter(location);
  		return marker;
	},
	/* Converts an input address string to a formatted string, and returns its coords */
	getLocationData: function(address) { 

		var latitude, longitude;

		$.ajax({
			url: "http://maps.googleapis.com/maps/api/geocode/json?address=" +
			address + "&sensor=true",
			async: false,
			dataType: 'json',
			success: function(json) { 
				
					latitude = json.results[0].geometry.location.lat;
					longitude = json.results[0].geometry.location.lng;
					address = json.results[0].formatted_address;

			}
		});

		return {

			latitude: latitude,
			longitude: longitude,
			address: address
		};
	}
}
$(document).ready(function() { 
	/*start map, centered at user's location */
	var initialLocation = mapObject.initializeMap(google.loader.ClientLocation);

	/* The base model for a location */
	Location = Backbone.Model.extend({

		initialize: function() { 
			_.bindAll(this,"push","update");
			var LatLng = new google.maps.LatLng(this.get("latitude"), this.get("longitude"));
			this.marker = mapObject.placeMarker(LatLng, this.get("name"));
		},
		url: './locations/',
		/*for POST */
		push: function() { 
			var latitude, longitude, name, address, id;
			latitude  = this.get("latitude") + "/";
			longitude = this.get("longitude") + "/";
			address   = this.get("address") + "/";
			name 	  = this.get("name");
			var request = latitude+longitude+address+name;

			$.ajax({
				url: "./locations/" + request,
				type: 'POST',
				async: false,
				dataType: 'json',
				success: function(json) {

					id = json.location.location_id;

				},
				done: function() {
				}
			});
			this.id = id;

		},
		/*replacement for a backbone's save() */
		update: function() {
			var request = this.url + this.id + "/" + this.get("name") + "/" + this.get("latitude") + "/" +
			this.get("longitude") + "/" + this.get("address");
			/*call a a put on the location file*/
			$.ajax({
				url: request,
				type: 'PUT',
				async: true,
				dataType: 'json',
				success: function(json) {
				},
				done: function() {
				}
			});
			/*here I would write a function to update the map too */
		},
		/* for destroy() */
		remove: function() {
			var request = this.url + this.id
			$.ajax({
				url: request,
				type: 'DELETE',
				async: true,
				dataType: 'json',
				success: function(json) {
				},
				done: function() {
				}
			});
			this.collection.remove(this);
		}
	});

	/* A collection of user locations */
	var LocationCollection = Backbone.Collection.extend({
		model: Location,
		urlRoot: 'locations',
		initialize: function() {
			this.model.bind("remove")
			_.bindAll(this,'getInitial');
			this.getInitial();
		},
		/* gets all of the locations already in the db */
		getInitial: function() { 

			var currentLocations;
			$.ajax({
				url: this.urlRoot, 
				async: false,
				dataType: 'json',
				success: function(json) {
					currentLocations = json;
				}
			});
			var latitude, longitude, address, name;
			var location;
			var that = this;

			if (typeof currentLocations === "undefined") return;

			for (var i = 0; i < currentLocations.locations.length; i++) {
				var current = currentLocations.locations[i][0];
				latitude = current.latitude;
				longitude = current.longitude;
				address = current.address;
				name = current.name;
				id=current.id;
				this.add(new Location({
					"id": id,
					"name":name,
					"latitude": latitude,
					"longitude": longitude,
					"address": address,
					collection: that
				}));
			}
		}
	});

	
	
	/* this View encompasses the entire list of locations */
	var LocationListView = Backbone.View.extend({

		el: '.location-list',
		tagName: 'ol',
		className: '.location-list',

		initialize: function() { 

			_.bindAll(this,"render");
			this.collection.bind("add",this.render);
			this.render();
		},
		render: function () {
			
			var $el = $(this.el);
			$el.empty();
			_.each(this.collection.models, function(location) {

					var loc = new LocationItemView({model: location});
					$el.prepend(loc.render().el);
					$el.find("li").first().hide().slideDown("fast");

			});

			if(!this.collection.length || $el.html() == "")
				$el.append("<li class='center no-favs'>You don't seem to have any favorite locations! Go ahead and add some.</li>");
			return this;
		},
		no_favs: function() { 

			if(this.collection.length == 0)
				$el.append("<li class='center no-favs'>You don't seem to have any favorite locations! Go ahead and add some.</li>");
		}
	
	});

	/* A view for each item, template found in index.php */
	var LocationItemView = Backbone.View.extend({

		tagName: 'li',
		/* template for each list tiem */
		template: $("#location-item").html(),
		/* template for a location's display box */
		displayTemplate: $("#display-box").html(),

		initialize: function() { 
			_.bindAll(this,"render");
			this.model.on("change","render");
			this.model.on('destroy', this.remove, this);
			this.render(this.model);
		},
		render: function(location) {
			if (location){
				var listItem = { 
					address: location.get("address"),
					name: location.get("name"),
					id: location.get("id")
				};
				$(this.el).prepend(_.template(this.template, listItem));
			}

			return this;
		},
		events: {

			"click .update": "update",
			"click .submit-change": "send",
			"click .delete":"delete",
			"click .view-icon":"viewModel"

		},
		/* subview calls a display box with the model's info */
		viewModel: function() { 
			var mod = this.model;
			var name = mod.get("name");
			var latitude = mod.get("latitude");
			var longitude = mod.get("longitude");
			var address = mod.get("address");
			var id = mod.id;


			var info = { 
				id: id,
				latitude: latitude, 
				longitude: longitude,
				address: address,
				name: name
			}
			$("#" + mapObject.mapIdentifier).find(".display-box").remove();
			$("#" + mapObject.mapIdentifier).append(_.template(this.displayTemplate, info))
			var LatLng = new google.maps.LatLng(latitude,longitude);
			mapObject.map.setCenter(LatLng);

		},
		/* Opens a panel to update the model */
		update: function() { 
			var $el = $(this.el);
			var submit = $el.find(".update");

			if (!this.model.get("editing")){
				submit.text("Done").addClass("submit-change");
				var updatePane = "<div class='update-box'>" + 
				'<input type="text" class="updateName w35" placeholder="name" value="' + this.model.get("name") + '" />' + 
				"<input type='text' class='updateAddress w60' placeholder='address' value='" + this.model.get("address") + "' />" +
				 "</div>";
				$el.append(updatePane);
				$el.find(".update-box").animate({"width":"show"});
				this.model.set({"editing":true},{silent:true});
			}
			else { 
				submit.text("Update").removeClass("submit-change");
				$el.find(".update-box").animate({"width":"hide"}, function(){
					$(this).remove();
				});
				this.model.set({"editing":false},{silent:true});
			}
		},
		delete: function() { 
			var $el = $(this.el);
			$el.animate({"width":"hide","height":"hide"});
			$(".display-box[data-id=" + this.model.id + "]").remove();
			this.model.remove();
			this.model.marker.setMap(null);

		},
		send: function(){
			var $el = $(this.el);
			var oldlLatitude = this.model.get("latitude"), oldLongitude = this.model.get("longitude");
			var oldAddress = this.model.get("address");
			var newAddress = $el.find(".updateAddress").val();
			var newName = $el.find(".updateName").val();
			var updated = mapObject.getLocationData(newAddress);
			var oldName = this.model.get("name"), oldAddress = this.model.get("address");
			var flag = false;

			if (oldAddress == newAddress && this.model.get("name") == newName)
				return;

			if (newName == "" || newAddress == "")
				this.error();
			else { 
				this.model.set({
					name: newName,
					address: updated.address,
					latitude: updated.latitude,
					longitude: updated.longitude

				},{silent: true}).update();
	
				$el.find(".name").text(newName);
				$el.find(".address").text(updated.address);

				if (oldName != newName || oldAddress != newAddress)
					this.successfulUpdate();
		
				/* find the display box and edit it */
				var that = this;				
				var display = $(".display-box[data-id=" + that.model.id + "]");

				if(display.html() != "") {
					display.find(".name-display").text(newName);
					display.find(".address-display").text(updated.address);
					display.find(".lat-display").text(updated.latitude);
					display.find(".long-display").text(updated.longitude);
				}
			}
			var marker = mapObject.placeMarker(new google.maps.LatLng(updated.latitude, updated.longitude), newName);
			this.model.marker.setMap(null);
			this.model.marker = marker;
			mapObject.map.setCenter(marker);
			mapObject.map.setZoom(13);

		},
		/* If they enter an invalid address or blank line, throw error */
		error: function() {

			var $el = $(this.el);
			var warning = "<div class='list-warning'>You really should enter " +  "the name and location, or go ahead and delete it.</div>";
			$(warning).appendTo($el).delay(5000).fadeOut(300, function() { 

				$(this).remove();

			});
		},
		/* If they update successfully, display a checkbox */
		successfulUpdate: function() {
			var $el = $(this.el);
			$("<div class='success-check'>&#xe004;</div>").appendTo($el)
			.delay(4000).fadeOut(300,function() { 

				$(this).remove();

			});
		}


	});
	
	/* instantiate the collection of models */
	var c = new LocationCollection();
	/* instantiate the listview */
	var list = new LocationListView({"collection": c});
	/* set the center of the map to the user's current location */
	mapObject.map.setCenter(initialLocation);

	$(".new-location").on("click",function() { 
		var text = $(this).text();
		$(this).parent().next(".new-location-wrap").slideToggle("fast");

	});

	/*When a user submits a new location*/
	$("#submit-location").on("click",function() { 

		var latitude, longitude;
		var $this = $(this);
		var address = $this.siblings("#new-address").val();
		var name = $this.siblings("#new-name").val();
		$(".no-favs").hide();
		/*Use maps API to get latitude, longitude, and format address*/
		var locationData = mapObject.getLocationData(address);

		if (name == ""){
			$this.siblings("#new-name").css("background","#FC9E9C");
			return;
		}
		else if (address == "") {
			$this.siblings("#new-address").css("background","#FC9E9C");
			return;
		}

		$this.siblings("#new-address").css("background","#fefefe").val("");
		$this.siblings("#new-name").css("background","#fefefe").val("");
		c.add(new Location({
			name: name,
			address: locationData.address,
			latitude: locationData.latitude,
			longitude: locationData.longitude,
			collection: this
		}));
		/*take the newly created model and push it to db*/
		c.at(c.length - 1).push();
	});

	$(".close-box").live("click",function() {

		$(this).parent().fadeOut(300, function() { $(this).remove(); })

	});

});