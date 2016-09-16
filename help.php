<?php
// This program recieves a help request from the help button on the app.
// See sample form for button in helpbutton.php
require_once( "common.inc.php" );
require_once( "config.php" );
require_once( "HelpRequest.class.php" );

if(isset($_POST['customer_id'])) {

	$customer_id= $_POST['customer_id'];
	$position= $_POST['position'];
	$newRequest = new HelpRequest(array(
	    "id" => "" ,
    	"customer_id" => isset( $_POST["customer_id"] ) ? preg_replace( "/[^ \'\-0-9]/", "", $_POST["customer_id"] ) : "",
	    "datetime" => "",
    	"position" => isset( $_POST["position"] ) ? preg_replace( "/[^ \'\-0-9]/", "", $_POST["position"] ) : ""
	  ));
	$ok = $newRequest->processButtonPress();
	if ($ok) {
//		$number = HelpRequest::countOpen(); 
		printf("<html><p>You are number %s in line for help.</p></html>", $ok);
	}
} else {
	print("<html><p>Nothing here to see.</p></html>");
	} 
?>