<?php

require 'config.php';
require 'lib/Moor.php';

Moor::route( '/changes', 'changes' );
Moor::route( '/:resource/:id([0-9A-Za-z_-]+)', 'constructor' );
Moor::route( '/:resource', 'constructor' );
Moor::route( '/', 'index' );

function constructor() {
  require 'lib/Mullet.php';
  $model = 'model/'.$_GET['resource'].".php";
  if (file_exists($model)) include $model;
  $action = strtolower($_SERVER['REQUEST_METHOD']);
  if (isset($_GET['id']) && in_array($action,array('get','post')))
    $action = $_GET['id'];
  $mapper = ucwords($_GET['resource']);
  if (class_exists($mapper))
    $obj = new $mapper;
  header('HTTP/1.1 200 OK');
  header('Content-Type: application/json');
  if (isset($obj) && method_exists($obj,$action))
    echo json_encode($obj->$action())."\n";
  else
    echo json_encode(array(
      'error'=>'internal error',
      'code'=>500
    ));
}

function index() {
  require 'lib/Mustache.php';
  $m = new Mustache;
  session_start();
  $params = array();
  if (isset($_SESSION['current_user']))
    $params['username'] = $_SESSION['current_user'];
  echo $m->render(file_get_contents('html/index.html'),$params);
}

function changes() {
  require 'lib/Mustache.php';
  $m = new Mustache;

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


	require_once 'lib/twitter.php';
	require_once 'lib/OAuth.php';
	$t = new Twitter( TW_KEY, TW_SEC );
	$t->authorize_from_access(  $_SESSION['twit_token'], $_SESSION['twit_secret'] );
  $tj = json_decode($t->friends_timeline());



$combined = array();


  krsort($j->data);
  foreach($j->data as $key=>$post) {
    $newcomb = array();
    $newcomb['comments'] = array();
    if (isset($post->comments->data))
    foreach($post->comments->data as $p) {
      $newcomb['comments'][] = array(
        'name' => $p->from->name,
        'userid' => $p->from->id,
        'message' => $p->message,
        'objid' => $p->id
      );
    }
    if (isset($post->message)) {
        $newcomb['id'] = $post->id;
        $newcomb['text'] = $post->message;
        $newcomb['name'] = $post->from->name;
        $newcomb['image'] = 'http://graph.facebook.com/'.$post->from->id.'/picture?type=small';
        $newcomb['type'] = 'facebook';
        $combined[] = $newcomb;
    }
  }
  
  //id [1] => from [2] => message [3] => picture [4] => link [5] => name [6] => caption [7] => description [8] => icon [9] => actions [10] => type [11] => application [12] => created_time [13] => updated_time [14] => comments )

  $items = render_items($combined);

  $collections[] = array(
    'last' => true,
    'title' => 'facebook',
    'feedurl' => '',
    'url' => '',
    'lastupdate' => '',
    'items' => $items 
  );
  
$combined = array();

  foreach($tj as $key=>$post) {

    //Array ( [0] => favorited [1] => in_reply_to_status_id_str [2] => possibly_sensitive [3] => in_reply_to_screen_name [4] => in_reply_to_user_id_str [5] => contributors [6] => user [7] => retweeted [8] => in_reply_to_user_id [9] => retweet_count [10] => created_at [11] => geo [12] => in_reply_to_status_id [13] => coordinates [14] => source [15] => id_str [16] => truncated [17] => id [18] => place [19] => text ) 
  //  $user = (array)$tweet['user'];
  //Array ( [0] => show_all_inline_media [1] => verified [2] => geo_enabled [3] => profile_link_color [4] => protected [5] => location [6] => notifications [7] => friends_count [8] => profile_sidebar_border_color [9] => followers_count [10] => name [11] => default_profile_image [12] => contributors_enabled [13] => time_zone [14] => favourites_count [15] => url [16] => statuses_count [17] => following [18] => profile_use_background_image [19] => profile_background_image_url_https [20] => utc_offset [21] => description [22] => is_translator [23] => default_profile [24] => profile_background_color [25] => profile_image_url_https [26] => follow_request_sent [27] => profile_background_image_url [28] => created_at [29] => profile_image_url [30] => id_str [31] => profile_text_color [32] => profile_sidebar_fill_color [33] => screen_name [34] => listed_count [35] => lang [36] => profile_background_tile [37] => id ) 


    
    $newcomb = array();
    $newcomb['comments'] = array();
    /*
    foreach($post->comments->data as $p) {
      $newcomb['comments'][] = array(
        'name' => $p->from->name,
        'userid' => $p->from->id,
        'message' => $p->message,
        'objid' => $p->id
      );
    }
    */
    if (isset($post->text)) {
        $newcomb['id'] = $post->id_str;
        $newcomb['text'] = $post->text;
        $newcomb['name'] = $post->user->screen_name;
        $newcomb['image'] = $post->user->profile_image_url;
        $newcomb['type'] = 'twitter';
        $combined[] = $newcomb;
    }
  }






  $items = render_items($combined);

  $collections[] = array(
    'last' => false,
    'title' => 'twitter',
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

function render_items($titems) {
  $count = 0;
  $items = array();
  $end = count($titems);
  foreach($titems as $key=>$post) {
    $count++;
    if ($count == $end)
      $last = false;
    else
      $last = true;
    $enclosures = array();
    $comments = array();
    foreach($post['comments'] as $p) {
      $comments[] = array(
        'name' => $p['name'],
        'userid' => $p['userid'],
        'message' => $p['message'],
        'objid' => $p['objid']
      );
    }
    $comment_html = '<ul>';
    foreach($comments as $c) {
      $comment_html .= '<li>'.$c['name'].': '.$c['message'].'<form class=\"fbLike\" id=\"'.$c['objid'].'\"><input id=\"likebtn'.$c['objid'].'\" type=\"submit\" value=\"Like\"/></form></li>';
    }
    $comment_html .= '</ul>';
    $enclosures[] =
    array(
      'enc_url' => $post['image'],
      'enc_type' => '',
      'enc_length' => 0,
      'last'=>false
      );
    $items[] = array(
      'last' => $last,
      'id' => $post['id'],
      'title' => json_encode($post['text']),
      'link' => '',
      'permalink' => '',
      'pubdate' => '',
      'body' => json_encode($post['name']),
      'enclosures' => $enclosures,
      'comments' => '',
      'has_enc' => true
    );
  }
  return $items;
}

Moor::run();


