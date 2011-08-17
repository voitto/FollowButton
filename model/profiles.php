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

  function facebook( $request, $response ) {
    session_start();
 		require 'lib/facebook.php';
		add_include_path('lib/facebook');
		require 'lib/facebook/Services/Facebook.php';
		$fblogin = 'http://'.$_SESSION['current_user'].'.followbutton.com/profiles/facebook';

		$f = new Facebook( FB_KEY, FB_SEC, FB_AID, FB_NAM, false, $fblogin );
		if (!isset($_GET['auth_token'])) {
			$token = $f->request_token();
			redirect_to( $token->authorize_url() );
		}
		list($userid,$sesskey) = $f->authorize_from_access();
		if (empty($userid) || empty($sesskey))
			trigger_error('error: could not get session or userid from Facebook',E_USER_ERROR);
		$_SESSION['face_userid'] = $userid;
		$_SESSION['face_session'] = $sesskey;
		$f = new Facebook( FB_KEY, FB_SEC, FB_AID, FB_NAM, $_SESSION['face_session'], $fblogin );
	  $_SESSION['fbcomplete'] = true;
		redirect_to('http://'.$_SESSION['current_user'].'.followbutton.com');
  }

}