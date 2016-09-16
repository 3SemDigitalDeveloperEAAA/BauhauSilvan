<?php

require_once "DataObject.class.php";

class HelpRequest extends DataObject {

  protected $data = array(
    "id" => "",
    "customer_id" => "",
    "datetime" => "",
    "position" => ""
  );

  public function processButtonPress() {
  // pseudocode
  // check if customer have an open request already
  // if not:    make an insert
  // always return his number in line
  //
  // check if customer have an open request already
    $conn = parent::connect();
    $sql = "select count(*) as isopen from helprequest 
            where customer_id = :customer_id 
            AND id not in (select helprequest_id from employee_took_helprequest)";
    try {
      $st = $conn->prepare( $sql );
      $st->bindValue( ":customer_id", $this->data["customer_id"], PDO::PARAM_STR );
      $st->execute();
      $row = $st->fetch();
      parent::disconnect( $conn );
    } catch ( PDOException $e ) {
      parent::disconnect( $conn );
      die( "Query failed: " . $e->getMessage() );
    }

 // if not:    make an insert
     if  ($row['isopen']==0) {
        $this->insert();
     };
  // always return his number in line
     Return $this->countOpenBeforeMe($datetime = date_create()->format('Y-m-d H:i:s'));  
  }



  public static function getHelpRequest( $id ) {
    // this funxction is not really needed by anybody unless a manager needs to see all requests.
    // We will need a getAndCloseNextOpenRequest - a function the employee will need 
    $conn = parent::connect();
    $sql = "SELECT * FROM helprequest WHERE id = :id";
    try {
      $st = $conn->prepare( $sql );
      $st->bindValue( ":id", $id, PDO::PARAM_INT );
      $st->execute();
      $row = $st->fetch();
      parent::disconnect( $conn );
      if ( $row ) return new HelpRequest( $row );
    } catch ( PDOException $e ) {
      parent::disconnect( $conn );
      die( "Query failed: " . $e->getMessage() );
    }
  }


  private function countOpenBeforeMe($mydatetime) {
    $conn = parent::connect();
    $sql = "SELECT count(*) as waitline from helprequest 
            WHERE (time < :mydatetime) 
            AND id not in (select helprequest_id from employee_took_helprequest)";
    try {
      $st = $conn->prepare( $sql );
      $st->bindValue( ":mydatetime", $mydatetime, PDO::PARAM_STR );
      $st->execute();
      $row = $st->fetch();
      parent::disconnect( $conn );
      if ( $row ) return $row['waitline']+1;
    } catch ( PDOException $e ) {
      parent::disconnect( $conn );
      die( "Query failed: " . $e->getMessage() );
    }


  }


  private function insert() {
    $conn = parent::connect();
    $sql = "INSERT INTO helprequest (
              customer_id, 
              position
            ) VALUES (
              :customer_id,
              :position
            )";
    try {
      $st = $conn->prepare( $sql );
      $st->bindValue( ":customer_id", $this->data["customer_id"], PDO::PARAM_STR );
      $st->bindValue( ":position", $this->data["position"], PDO::PARAM_STR );
      $st->execute();
      parent::disconnect( $conn );
      return "OK";
    } catch ( PDOException $e ) {
      parent::disconnect( $conn );
      die( "Query failed: " . $e->getMessage() );
    }
  }

}