<?php

class Comments extends MulletMapper {

  function __construct() {

		$this->key( 'pagekey', 'String' );
		$this->key( 'username', 'String' );
		$this->key( 'description', 'String' );

  }
  
  function create() {
    
		$conn = new Mullet(USR,PWD);
  
		$coll = $conn->user->comments;
		$result = $coll->insert(array(
		  'pagekey' => $_POST['pagekey'],
		  'description' => $_POST['description']
		));
		if ($result)
  	  return array(
  	    'ok'=>true
  	  );
		return array(
			'ok'=>false
		);

  }

  function show($slug) {
    session_start();
	  $user = $_SESSION['current_user'];
	  if (empty($user)) {
			exit;
	  }
  	$conn = new Mullet();
  	$coll = $conn->user->profiles;
    $cursor = $coll->find(array(
  	  'username' => $user
  	));
  	$user = $cursor->getNext();
  	$conn = new Mullet(
  		$user->datasource_username,
  		$user->datasource_encrypted_password
  	);
  	$coll = $conn->user->posts;
    $cursor = $coll->find(array(
  	  'keyname' => $slug
  	));
    $item = (array)$cursor->getNext();
    return array(
      'postid' => $item->keyname
    );
  }
  
}