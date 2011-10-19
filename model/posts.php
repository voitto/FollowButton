<?php

class Posts extends MulletMapper {
	
	function fileUpload() {
		
		$id = 1;
		
		foreach ($_FILES['files']['tmp_name'] as $file) {
		
		$destination = "/var/www/ben/uploads/".$id.".jpg";
		
		$id++;
		
		$result = move_uploaded_file($file, $destination);
		
		};
		//print_r($files);
	}
	
	function __construct() {
    /*
	      validates_presence_of   :firstname, :lastname
		attr_accessible :login, :email, :name, :password, :password_confirmation,
      :firstname, :lastname, :fullname, :is_admin
      */
	}
	
	function get() {
	}
	
	function put() {
	}
	
	
	function comment() {
    $arr = json_decode(file_get_contents('php://input'));
  	$conn = new Mullet(REMOTE_USER,REMOTE_PASSWORD);
  	$coll = $conn->user->posts;
  	$result = $coll->insert(array(
  	  'title' => $arr->title
  	));
  	

    session_start();
  	require 'lib/facebook.php';
  	$return = $_SESSION['base_url'].'profiles/facebook';


    $coll = $conn->user->profiles;
    $cursor = $coll->find(array(
      'username' => $_SESSION['current_user']
    ));
    $user = $cursor->getNext();
  	$f = new Facebook( FB_SEC, FB_AID, $return,	$user->facebook_token );
	
    $result = $f->comment($arr->title,$arr->objid);

  	
  	return array(
  		'ok'=>$result,'msg'=>$result
  	);
	}

	function reply() {
	  $arr = json_decode(file_get_contents('php://input'));
    session_start();
    require_once 'lib/twitter.php';
    require_once 'lib/OAuth.php';
    $t = new Twitter( TW_KEY, TW_SEC );
    $t->authorize_from_access( $_SESSION['twit_token'], $_SESSION['twit_secret'] );
    $response = $t->update($arr->title,$arr->objid);
  	return array(
  		'ok'=>true,
  		'msg'=>$response
  	);
	}

	function favorite() {
    $arr = json_decode(file_get_contents('php://input'));
    session_start();
    require_once 'lib/twitter.php';
    require_once 'lib/OAuth.php';
    $t = new Twitter( TW_KEY, TW_SEC );
    $t->authorize_from_access( $_SESSION['twit_token'], $_SESSION['twit_secret'] );
    $response = $t->favorite($arr->objid);
  	return array(
  		'ok'=>true,
  		'msg'=>$response
  	);
	}

	function retweet() {
    $arr = json_decode(file_get_contents('php://input'));
    session_start();
    require_once 'lib/twitter.php';
    require_once 'lib/OAuth.php';
    $t = new Twitter( TW_KEY, TW_SEC );
    $t->authorize_from_access( $_SESSION['twit_token'], $_SESSION['twit_secret'] );
    $response = $t->retweet($arr->objid);
  	return array(
  		'ok'=>true,
  		'msg'=>$response
  	);
	}


	function like() {
    $arr = json_decode(file_get_contents('php://input'));
  	$conn = new Mullet(REMOTE_USER,REMOTE_PASSWORD);
  	

    session_start();
  	require 'lib/facebook.php';
  	$return = $_SESSION['base_url'].'profiles/facebook';


    $coll = $conn->user->profiles;
    $cursor = $coll->find(array(
      'username' => $_SESSION['current_user']
    ));
    $user = $cursor->getNext();
  	$f = new Facebook( FB_SEC, FB_AID, $return,	$user->facebook_token );
	
    $result = $f->like($arr->objid);
  	
  	return array(
  		'ok'=>$result,'msg'=>$result
  	);
	}
	
	function post() {
    $arr = json_decode(file_get_contents('php://input'));
  	$conn = new Mullet(REMOTE_USER,REMOTE_PASSWORD);
  	$coll = $conn->user->posts;
  	$result = $coll->insert(array(
  	  'title' => $arr->title
  	));
     if ($arr->sendtw == 1) {
       session_start();
       require_once 'lib/twitter.php';
       require_once 'lib/OAuth.php';
       $t = new Twitter( TW_KEY, TW_SEC );
       $t->authorize_from_access( $_SESSION['twit_token'], $_SESSION['twit_secret'] );
       $t->update($arr->title);
     }  	
  	if ($arr->sendfb == 1) {
      session_start();
    	require 'lib/facebook.php';
    	$return = $_SESSION['base_url'].'profiles/facebook';


      $coll = $conn->user->profiles;
      $cursor = $coll->find(array(
        'username' => $_SESSION['current_user']
      ));
      $user = $cursor->getNext();
    	$f = new Facebook( FB_SEC, FB_AID, $return,	$user->facebook_token );
  	
      $result = $f->publish($arr->title,$user->facebook_uid);
    }
  	
  	return array(
  		'ok'=>$result,'msg'=>$result
  	);
	}
	
	function delete() {
	}
	
}

/*
def self.is_indexable_by(accessing_user, parent = nil)
    accessing_user.is_admin?
  end

  def self.is_creatable_by(user, parent = nil)
    user == nil or user.is_admin?
  end

  def is_updatable_by(accessing_user, parent = nil)
    id == accessing_user.id or accessing_user.is_admin?
  end

  def is_deletable_by(accessing_user, parent = nil)
    false
  end

  def is_readable_by(user, parent = nil)
    id.eql?(user.id) or user.is_admin?
  end
  
  */
  
  
