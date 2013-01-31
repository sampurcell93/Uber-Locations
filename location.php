<?php 

$parts = explode('/', $_SERVER['REQUEST_URI']);

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


/* get a single location, or a set of locations, 
* which may even be the comlete set */
function get_location($id) {
	$pdo = make_connection();
	$json = '{ "location": ';
	$stmt = $pdo->query("SELECT * FROM `locations` where location_id = '$id'");
	$stmt->setFetchMode(PDO::FETCH_OBJ);
	$row = $stmt->fetch();
	$json .= '[{"id":"' . $row->location_id . '", ';
	$json .= '"latitude":"' . $row->latitude . '", ';
	$json .= '"longitude":"' . $row->longitude . '", ';
	$json .= '"address":"' . $row->address . '", ';
	$json .= '"name":"' . $row->name . '"}],';
	echo substr($json,0,-1) . "}";
	$pdo = NULL;
}
if ($parts[3] != "")
	get_location($parts[3]);
else { 

	echo "You need to enter an id!";

}