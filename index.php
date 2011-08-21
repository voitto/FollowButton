<?php

require 'config.php';
require 'lib/Klein.php';

respond( 'GET',      '/changes',                 'changes' );
respond( 'GET',      '/[:resource]',             'constructor' );
respond( 'POST',     '/[:resource]',             'constructor' );
respond( 'PUT',      '/[:resource]/[:id]',       'constructor' );
respond( 'DELETE',   '/[:resource]/[:id]',       'constructor' );
respond( 'GET',      '/[:resource]/[:action]',   'constructor' );
respond( 'POST',     '/[:resource]/[:action]',   'constructor' );
respond( 'GET',      '/',                        'index' );

function constructor($request,$response) {
  require 'lib/Mullet.php';
  $model = 'model/'.$request->resource.".php";
  if (file_exists($model)) include $model;
  $action = strtolower($request->method());
  if (isset($request->action))
    $action = $request->action;
  $mapper = ucwords($request->resource);
  if (class_exists($mapper))
    $obj = new $mapper;
  header('HTTP/1.1 200 OK');
  header('Content-Type: application/json');
  if (isset($obj) && method_exists($obj,$action))
    echo json_encode($obj->$action($request,$response))."\n";
  else
    echo json_encode(array(
      'error'=>'internal error',
      'code'=>500
    ));
}

function index($request,$response) {
  require 'lib/Mustache.php';
  $m = new Mustache;
  session_start();
  $params = array();
  if (isset($_SESSION['current_user']))
    $params['username'] = $_SESSION['current_user'];
  echo $m->render(file_get_contents('html/index.html'),$params);
}

function changes( $request, $response ) {
  require 'lib/Mustache.php';
  $m = new Mustache;
  $resource = 'everyone';
  $tpl = 'html/changes.json';
  session_start();
	require 'lib/facebook.php';
	$return = 'http://'.$_SESSION['current_user'].'.followbutton.com/profiles/facebook';
	require 'lib/Mullet.php';
  $conn = new Mullet(REMOTE_USER,REMOTE_PASSWORD);
  $coll = $conn->user->profiles;
  $cursor = $coll->find(array(
    'username' => $_SESSION['current_user']
  ));
  $user = $cursor->getNext();
	$f = new Facebook( FB_SEC, FB_AID, $return,	$user->facebook_token );
  $j = json_decode($f->friends_timeline());
  $end = count($j->data);
  $items = array();
  $count = 0;
  krsort($j->data);
  foreach($j->data as $key=>$post) {
    $count++;
    if ($count == $end)
      $last = false;
    else
      $last = true;
    $enclosures = array();
    $enclosures[] =
    array(
      'enc_url' => 'http://graph.facebook.com/'.$post->from->id.'/picture?type=small',
      'enc_type' => '',
      'enc_length' => 0,
      'last'=>false
      );
      if (isset($post->message))
    $items[] = array(
      'last' => $last,
      'id' => $post->id,
      'title' => json_encode($post->message),
      'link' => '',
      'permalink' => '',
      'pubdate' => '',
      'body' => json_encode($post->from->name),
      'enclosures' => $enclosures,
      'has_enc' => true
    );
  }
  
  //id [1] => from [2] => message [3] => picture [4] => link [5] => name [6] => caption [7] => description [8] => icon [9] => actions [10] => type [11] => application [12] => created_time [13] => updated_time [14] => comments )



  $collections[] = array(
    'last' => false,
    'title' => $resource,
    'feedurl' => '',
    'url' => '',
    'lastupdate' => '',
    'items' => $items 
  );
  header('HTTP/1.1 200 OK');
  header('Content-Type: application/json');
  echo $m->render(file_get_contents($tpl), array(
      'sources' => $collections
  ));
  exit;
}


dispatch();