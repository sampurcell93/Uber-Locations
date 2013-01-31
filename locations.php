<?php 

	$parts = explode('/', $_SERVER['REQUEST_URI']);
	$request_method = strtolower($_SERVER['REQUEST_METHOD']);

	if ($request_method == "get")
	  	get_locations();
	else if ($request_method == "put")
		update_location($parts);
	else if ($request_method == "delete")
		delete_location($parts[3]);
	else if ($request_method == "post")
		add_location($parts);
	else {

		echo "Your URL is invalid.";

	}

/* make a connection with a mysql database */
function make_connection() {
    $dbhost="127.0.0.1";
    $dbuser="sampurce_admin";
    $dbpass="kamehameha1";
    $dbname="sampurce_Uber_locations";
    try { 
    	$dbh = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuser, $dbpass);
    	$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    }
    catch(PDOException $e) { 

		echo $e->getMessage();

	}
    return $dbh;
}
/* get all user locations */
function get_locations(){
	$pdo = make_connection();
	$json = '{"locations":[';
	$stmt = $pdo->query("SELECT * FROM locations ORDER BY location_id ASC");
	$stmt->setFetchMode(PDO::FETCH_OBJ);
	while ($row = $stmt->fetch()) { 

		$json .= '[{"id":"' . $row->location_id . '", ';
		$json .= '"latitude":"' . $row->latitude . '", ';
		$json .= '"longitude":"' . $row->longitude . '", ';
		$json .= '"address":"' . $row->address . '", ';
		$json .= '"name":"' . $row->name . '"}],';

	}
	echo substr($json,0,-1) . "]}";
	$pdo = NULL;
}

function add_location($parts) {

	$db = make_connection();
	$loc = "";
	$sql = "INSERT INTO `locations` VALUES (
		:location_id, :latitude, :longitude, :address, :name)";
    try {
    	/*PDO prepare to insert the model */
        $db = make_connection();
        $stmt = $db->prepare($sql);
        $stmt->bindValue("location_id", $loc);
        $stmt->bindValue("latitude", urldecode($parts[3]));
        $stmt->bindValue("longitude", urldecode($parts[4]));
        $stmt->bindValue("address", urldecode($parts[5]));
        $stmt->bindValue("name", urldecode($parts[6]));
        $stmt->execute();
        $id = $db->lastInsertId();
        $db = null;
    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
   	}
   	/* return a JSON object of the model*/
   	echo  '{"location":{ "location_id": "'. $id . '", ';
   	echo '"latitude": "' . urldecode($parts[3]) . '", ';
   	echo '"longitude": "' . urldecode($parts[4]) . '", ';
   	echo '"address": "'  . urldecode($parts[5]) . '", ';
   	echo '"name": "' . urldecode($parts[6]) . '"}}';
}

function update_location($location) {

	$sql = "UPDATE `locations`
				SET name = :name,
					address = :address,
					latitude = :latitude,
					longitude = :longitude
				WHERE location_id = :id";
	$id = urldecode($location[3]);
	$name = urldecode($location[4]);
	$lat = urldecode($location[5]);
	$long = urldecode($location[6]);
	$address = urldecode($location[7]);
	try {
    	/*PDO prepare to insert the model */
        $db = make_connection();
        $stmt = $db->prepare($sql);
        $stmt->bindValue("id", $id);
        $stmt->bindValue("name", $name);
        $stmt->bindValue("latitude", $lat);
        $stmt->bindValue("longitude", $long);
        $stmt->bindValue("address", $address);
        $stmt->execute();
        $db = null;
    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
   	}

   	echo '{"location": {';
   	echo '"id":"' . $id . '",';
   	echo '"latitude":"' . $lat . '", ';
	echo '"longitude":"' . $long . '", ';
	echo '"address":"' . $address . '", ';
	echo '"name":"' . $name . '"} ';
}


function delete_location($id) {
	try { 
		$db = make_connection();
		$sql = "DELETE FROM locations WHERE location_id = '$id'";
		$stmt = $db->prepare($sql);
		$stmt->execute();
	} catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
   	}
	$db = NULL;
}
?>