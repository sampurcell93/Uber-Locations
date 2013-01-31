<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
  <title>Your favorite locations</title>
  <link href='http://fonts.googleapis.com/css?family=Open+Sans:400,300,600' rel='stylesheet' type='text/css'>
  <link href='stylesheets/screen.css' rel='stylesheet' media='screen' />
  <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js" type="text/javascript"></script>
  <script src="http://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.3.3/underscore-min.js" type="text/javascript"></script>
  <script src="http://cdnjs.cloudflare.com/ajax/libs/backbone.js/0.9.2/backbone-min.js" type="text/javascript"></script>
  <script src="http://cdnjs.cloudflare.com/ajax/libs/backbone-localstorage.js/1.0/backbone.localStorage-min.js" type="text/javascript"></script>  
  <script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?lib=places&key=AIzaSyBoS1bfOyPBTbYH1GhtD4xRs9XrT17nGwg&sensor=true"></script>
  <script type="text/javascript" src="https://www.google.com/jsapi"></script>
  <script type="text/javascript" src='main.min.js'></script>

</head>
	<body >

		<script type='text/template' id='display-box'>
			<div class='display-box' data-id='<%= id %>'>
				<a class='close-box'>&#xe000;</a>
				<h2 class='name-display'><%= name %></h2>
				<ul>
					<li>Address: <span  class='address-display'> <%= address %></span></li>
					<li>Latitude:<span  class='latitude-display'> <%= latitude %></span></li>
					<li>Longitude:<span  class='longitude-display'> <%= longitude %></span></li>
				</ul>
			</div> 
		</script>
		<div id="map-canvas"></div> 

		<div class='content-wrapper'>

			<h1>Get picked up at your favorite spots.</h1>

			<p class='center'>We know you like the get picked up in style, wherever you are. Manage your favorite pickup spots here.</p>

			<h2 class='freq'>Your Frequent Locations <a class='new-location button fr'>+ Add a New Favorite</a>
			</h2>
			<div class='new-location-wrap'>
				<input type='text' name='new-address' class='w60' placeholder='address' id='new-address'></textarea>
				<input type='text' name='new-name' id='new-name' placeholder='location name' />
				<input type='submit' name='submit' class='button m10' value='Go.' id='submit-location'/>
			</div> 

				<script type='text/template' id='location-item'>
					<a class='view-icon'>&#xe00e;</a>
					<section class='fl w60'>
						<span class='name'><%= name %></span>
						<span class='address'><%= address %></span>
					</section>

						<a title='delete this item' class='list-button fr delete'>&#xe000;</a>
						<a class='list-button fr update' data-id='<%= id %>'>Update</a>
				</script>
			<ol class='location-list'></ol>

			<p class='footer center'>Implementation 2013 by Sam Purcell </p>
		</div>
	</body>
</html>

