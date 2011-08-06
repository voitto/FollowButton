<?php

class Pages extends MulletMapper {
	
	function __construct() {
		
		$this->key( 'title', 'String' );
		$this->key( 'body', 'String' );
		$this->validates_uniqueness_of( 'title' );
	  $this->many( 'comments' );
	
	}
	
	function get() {

	  $conn = new Mullet();

	  $coll = $conn->user->pages;
	  
	  $pages = array();

		$cursor = $coll->find();

		while( $cursor->hasNext() ) {
			$page = $cursor->getNext();
       $pages[] = array(
        'id' => $page->keyname,
        'title' => $page->title
      );
		}

    return $pages;

	}

/*
  function get( $request, $response ) {
    if (!$this->signed_in())
      return array();
  	$conn = new Mullet();
    $coll = $conn->user->domains;
    $domains = array();
    $cursor = $coll->find(array(
  	  'username' => $this->username()
  	));
  	while( $cursor->hasNext() ) {
  		$domain = $cursor->getNext();
  		if (($this->username() == $domain->username))
  		 if (isset($_SESSION['current_user']))
       $domains[] = array(
        'id' => $domain->id,
        'name' => $domain->name
      );
      else
       $domains[] = array(
        'id' => $domain->id,
        'name' => $domain->name
      );
      
  	}
    return $domains;
  }
*/
  
  function put( $request, $response ) {
    $this->_update( $request, $response );
  }

  function post( $request, $response ) {
    $this->_insert( $request, $response );
  }

  function delete( $request, $response ) {
    $this->_remove( $request, $response );
  }
	
	function index() {

	  $conn = new Mullet(USR,PWD);

	  $coll = $conn->user->pages;
	  
	  $pages = array();

		$cursor = $coll->find();

		while( $cursor->hasNext() ) {
			$page = $cursor->getNext();
       $pages[] = array(
        'title' => $page->title,
        'key' => $page->keyname
      );
		}

    return array('ok'=>true,'pages'=>$pages);
    
	}
	
	function show($key) {
    
  	$conn = new Mullet(USR,PWD);

	  $coll = $conn->user->pages;

	  $pages = array();

		$cursor = $coll->find(array(
		  'keyname' => $key,
		));

	  $page = $cursor->getNext();

    $comments = array();

    $coll = $conn->user->comments;

		$cursor = $coll->find(array(
		  'pagekey' => $key
		));

  	while( $cursor->hasNext() ) {
  		$c = $cursor->getNext();
       $comments[] = array(
        'description'=> trim($c->description),
        'commentkey'=>$c->keyname
      );
  	}

		return array('ok'=>true,'content'=>urldecode(stripslashes($page->content)),'key'=>$page->keyname,'comments'=>$comments);
		
	}
	
	function create() {
	  
	  if (isset($_POST['title'])) {

    	$conn = new Mullet(USR,PWD);

  	  $coll = $conn->user->pages;

  	  $result = $coll->insert(array(
  		  'title' => $_POST['title'],
  		));

  	  if ($result)
  			return array(
  				'ok'=>true
  			);
  			
      return array('ok'=>false);
      
	  }

    return array('ok'=>true);

	}
	
	function edit($key) {

  	$conn = new Mullet(USR,PWD);

	  $coll = $conn->user->pages;

	  $pages = array();

		$cursor = $coll->find(array(
		  'keyname' => $key,
		));

	  $page = $cursor->getNext();

    if (isset($_POST['title'])) {

  		$result = $coll->update( 
        array( 
    		  'keyname' => $key,
  	    ),
        array( 
          'title' => $_POST['title'],
          'content' => $_POST['content']
        )
      );

  	  if ($result)
  			return array(
  				'ok'=>true
  			);
			
      return array('ok'=>false);
    
    }

    return array(
      'ok'=>true,
      'title'=>$page->title,
      'content'=>$page->content,
      'key'=>$page->keyname
    );
    
	}
	
	function destroy() {
		echo 'destroy';
	}
	
}

