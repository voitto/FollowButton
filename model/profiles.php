<?php

class Profiles extends MulletMapper {
	
	function __construct() {
		$this->validates_uniqueness_of( 'username' );
	}

  function get( $request, $response ) {
    return array();
  }
  
  function put( $request, $response ) {
    return array();
  }

  function login( $request, $response ) {
    $arr = json_decode(file_get_contents('php://input'));
    $conn = new Mullet();
		$coll = $conn->user->profiles;
		$cursor = $coll->find(array(
		  'username' => $arr->username,
		  'password' => md5($arr->password)
		));
  	$user = $cursor->getNext();
  	if ($user && !empty($user->username)) {
  	  session_start();
  	  $_SESSION['current_user'] = $user->username;
  	  return array('ok'=>true);
  	}
    return array('ok'=>false);
  }

  function register( $request, $response ) {
    $arr = json_decode(file_get_contents('php://input'));
    $conn = new Mullet();
		$coll = $conn->user->profiles;
		$result = $coll->insert(array(
		  'username' => $arr->username,
		  'password' => md5($arr->password)
		));
		if ($result) {
		  $token = md5(uniqid(rand(), true));
  		$coll = $conn->user->setuptokens;
  		$result = $coll->insert(array(
  		  'username' => $arr->username,
  		  'token' => $token,
  		  'active' => true
  		));
      session_start();
			$_SESSION['current_user'] = pg_escape_string($arr->username);
			if (isset($_SESSION['current_user']))
      if ($result)
			  return array( 'ok'=>true, 'token'=>$token, 'username'=>$arr->username );
		}
		return array('ok'=>false);
  }
  
  function index( $request, $response ) {
    return array('ok'=>true,'username'=>'cow-man');
  }
  
  function _settings( $request, $response ) {
    return array();
  }
  
  function _privacy( $request, $response ) {
    return array();
  }
  
  function _following( $request, $response ) {
    return array();
  }
  
  function _appearance( $request, $response ) {
    return array();
  }
  
  function loggedin( $request, $response ) {
  	session_start();
		if (isset($_SESSION['current_user']))
		  return array( 'ok'=>true,'username'=>$_SESSION['current_user'] );
		return array( 'ok'=>false );
  }
  
  function logout( $request, $response ) {
  	session_start();
		unset($_SESSION['current_user']);
		if (!isset($_SESSION['current_user']))
		  return array( 'ok'=>true );
		return array( 'ok'=>false );
  }

  function post( $request, $response ) {
  }

  function delete( $request, $response ) {
    return array();
  }
  
  function checkAvail ( $request, $response ) {
  	$arr = json_decode(file_get_contents('php://input'));
    $conn = new Mullet();
  	$coll = $conn->user->profiles;
  	$cursor = $coll->find(array(
  		'username' => $arr->username,
  	));
  	$user = $cursor->getNext();
    	if ($user && !empty($user->username)) {
  		return array('ok'=>false);
  	}
  	return array('ok'=>true);
  }

}