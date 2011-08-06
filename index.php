<?php

// uncomment these two lines to show errors - for debugging
//ini_set('display_errors','1');
//error_reporting (E_ALL & ~E_NOTICE );

require 'config.php';
require 'lib/Klein.php';

respond( 'GET',			'/[:resource]',				'constructor' );
respond( 'POST',		'/[:resource]',				'constructor' );
respond( 'PUT',			'/[:resource]/[:id]',	'constructor' );
respond( 'DELETE',	'/[:resource]/[:id]',	'constructor' );

respond( 'GET',			'/',									'index' );

function constructor($request,$response) {
	require 'lib/Mullet.php';
	if (!isset($request->resource)) return;
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
	if (isset($obj) && method_exists($obj,$action)) {
  	echo json_encode($obj->$action($request,$response))."\n";
  	exit;
	}
  echo json_encode(array(
    'error'=>'internal error',
    'code'=>500
  ));
}

function index($request,$response) {
	require 'lib/Mustache.php';
	$m = new Mustache;
	echo $m->render(file_get_contents('html/index.html'),array());
}

dispatch();