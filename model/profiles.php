<?php

class Profiles extends MulletMapper {
  
  function __construct() {
    $this->validates_uniqueness_of( 'username' );
  }

  function get() {
    return array();
  }
  
  function put() {
    return array();
  }

  function login() {
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

  function register() {
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
  
  function index() {
    $user = '';
    if (isset($_SESSION['current_user']))
      $user = $_SESSION['current_user'];
    return array('ok'=>true,'username'=>$user);
  }
  
  function _settings() {
    session_start();
    $conn = new Mullet(REMOTE_USER,REMOTE_PASSWORD);
    $coll = $conn->user->profiles;
    $cursor = $coll->find(array(
      'username' => $_SESSION['current_user']
    ));
    if ($cursor->hasNext())
      $user = $cursor->getNext();
    $conn = new Mullet();
    $coll = $conn->user->settings;
    $cursor = $coll->find(array(
      'username' => $_SESSION['current_user']
    ));
    if ($cursor->hasNext()) {
      $settings = $cursor->getNext();
    } else {
      $settings = array();
      $settings['email'] = '';
      $settings['username'] = $_SESSION['current_user'];
      $result = $coll->insert(
        $settings
      );
    }
    if ($settings)
      return array(
        'ok'=>true,
        'Email'=>$settings->email
      );
    return array('ok'=>false);
  }
  
  function _privacy() {
    return array();
  }
  
  function _following() {
    return array();
  }
  
  function _appearance() {
    return array();
  }
  
  function loggedin() {
    session_start();
    if (isset($_SESSION['current_user']))
      return array( 'ok'=>true,'username'=>$_SESSION['current_user'] );
    return array( 'ok'=>false );
  }
  
  function logout() {
    session_start();
    unset($_SESSION['current_user']);
    if (!isset($_SESSION['current_user']))
      return array( 'ok'=>true );
    return array( 'ok'=>false );
  }

  function post() {
  }

  function delete() {
    return array();
  }
  
  function checkAvail () {
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

  function facebook() {
    session_start();
    require 'lib/facebook.php';
    $return = $_SESSION['base_url'].'profiles/facebook';
    $f = new Facebook( FB_SEC, FB_AID, $return );
    if (!isset($_GET['oauth_token'])) {
      $token = $f->request_token();
      redirect_to( $token->authorize_url() );
    }
    list($userid,$token) = $f->authorize_from_access();
    if (empty($userid) || empty($token))
      trigger_error('error: could not get token or userid from Facebook',E_USER_ERROR);
    $conn = new Mullet(REMOTE_USER,REMOTE_PASSWORD);
    $coll = $conn->user->profiles;
    $cursor = $coll->find(array(
      'username' => $_SESSION['current_user']
    ));
    if ($cursor->hasNext()) {
      $user = $cursor->getNext();
      $user->facebook_token = $token;
      $user->facebook_uid = $userid;
      $result = $coll->update(
        array( 'username' => $_SESSION['current_user'] ),
        array($user)
      );
    } else {
      $user = array();
      $user['facebook_uid'] = $userid;
      $user['facebook_token'] = $token;
      $user['password'] = '';
      $user['username'] = $_SESSION['current_user'];
      $result = $coll->insert(
        $user
      );
    }
    redirect_to($_SESSION['base_url']);  
  }

  function facebookstream() {
    session_start();
    require 'lib/facebook.php';
    $return = $_SESSION['base_url'].'profiles/facebook';
    $conn = new Mullet(REMOTE_USER,REMOTE_PASSWORD);
    $coll = $conn->user->profiles;
    $cursor = $coll->find(array(
      'username' => $_SESSION['current_user']
    ));
    if ($cursor->hasNext()) {
      $user = $cursor->getNext();
      $f = new Facebook( FB_SEC, FB_AID, $return,  $user->facebook_token );
      echo $f->friends_timeline();
    }
    exit;
  }
  
  function twitter() {
    session_start();
  	require_once 'lib/twitter.php';
  	require_once 'lib/OAuth.php';
  	$t = new Twitter( TW_KEY, TW_SEC );
  	if (!isset($_GET['oauth_token'])) {
  		$token = $t->request_token();
  		$_SESSION['token_secret'] = $token->secret;
  		redirect_to( $token->authorize_url() );
  	}
    $conn = new Mullet(REMOTE_USER,REMOTE_PASSWORD);
  	$coll = $conn->user->twittokens;
    $result = $coll->find(array(
      'username' => $_SESSION['current_user']
    ));
  	if ($result->hasNext())
      $twittok = $result->getNext();
  	list($atoken,$asecret) = $t->authorize_from_request(
  	  $twittok->oauth_token,
  	  $_SESSION['token_secret'],
  	  $twittok->oauth_verifier
  	);
    $result = $coll->remove(array(
      'username' => $_SESSION['current_user']
    ));
    $conn = new Mullet(REMOTE_USER,REMOTE_PASSWORD);
    $coll = $conn->user->profiles;
    $cursor = $coll->find(array(
      'username' => $_SESSION['current_user']
    ));
    if ($cursor->hasNext()) {
      $user = $cursor->getNext();
      $user->twitter_token = $atoken;
      $user->twitter_secret = $asecret;
      $result = $coll->update(
        array( 'username' => $_SESSION['current_user'] ),
        array($user)
      );
    }
    redirect_to($_SESSION['base_url']);
  }

  function twitterstream() {
    session_start();
  	require_once 'lib/twitter.php';
  	require_once 'lib/OAuth.php';
    $conn = new Mullet(REMOTE_USER,REMOTE_PASSWORD);
    $coll = $conn->user->profiles;
    $cursor = $coll->find(array(
      'username' => $_SESSION['current_user']
    ));
    if ($cursor->hasNext()) {
      $user = $cursor->getNext();
    	$t = new Twitter( TW_KEY, TW_SEC );
    	$t->authorize_from_access(  $user->twitter_token, $user->twitter_secret );
      echo $t->friends_timeline();
    }
    exit;
  }
  
  function hastwitter() {
    session_start();
    $conn = new Mullet(REMOTE_USER,REMOTE_PASSWORD);
    $coll = $conn->user->profiles;
    $cursor = $coll->find(array(
      'username' => $_SESSION['current_user']
    ));
    if ($cursor->hasNext()) {
      $user = $cursor->getNext();
      if (!empty($user->twitter_token))
        return array('ok'=>true);
    }
    return array('ok'=>false,'user'=>$_SESSION['current_user']);
  }

  function hasfacebook() {
   session_start();
   $conn = new Mullet(REMOTE_USER,REMOTE_PASSWORD);
   $coll = $conn->user->profiles;
   $cursor = $coll->find(array(
     'username' => $_SESSION['current_user']
   ));
   if ($cursor->hasNext()) {
     $user = $cursor->getNext();
     if (!empty($user->facebook_token))
       return array('ok'=>true);
   }
   return array('ok'=>false,'user'=>$_SESSION['current_user']);
  }
  
  function savesettings() {
    $arr = json_decode(file_get_contents('php://input'));
    session_start();
    $conn = new Mullet();
    $coll = $conn->user->settings;
    $cursor = $coll->find(array(
      'username' => $_SESSION['current_user']
    ));
    if ($cursor->hasNext()) {
      $settings = array();
      $settings['email'] = $arr->email;
      $settings['username'] = $_SESSION['current_user'];
      $result = $coll->update(
        array('username'=>$_SESSION['current_user']),
        array($settings)
      );
    } else {
      $settings = array();
      $settings['email'] = '';
      $settings['username'] = $_SESSION['current_user'];
      $result = $coll->insert(
        $settings
      );
    }
    return array(
      'ok'=>true,
      'Email'=>$settings->email
    );
  }
  
  function hasgplus() {
   session_start();
   if (isset($_SESSION['g_token']))
     return array('ok'=>true);
   return array('ok'=>false,'user'=>$_SESSION['current_user']);
  }

  function gplusstream() {
    session_start();
  	require_once 'lib/buzz.php';
  	require_once 'lib/OAuth.php';
  	$b = new buzz(GG_KEY,GG_SEC,$return);
  	$b->authorize_from_access(  $_SESSION['g_token'], $_SESSION['g_secret'] );
    echo $b->friends_timeline();
    exit;
  }
    
  function gplus() {
    session_start();
    $return = $_SESSION['base_url'].'profiles/gplus';
  	require_once 'lib/buzz.php';
  	require_once 'lib/OAuth.php';
  	$b = new buzz(GG_KEY,GG_SEC,$return);
  	if (!isset($_GET['oauth_token'])) {
  		$token = $b->request_token();
  		$_SESSION['gtoken_secret'] = $token->secret;
  		redirect_to( $token->authorize_url() );
  	}
    $conn = new Mullet(REMOTE_USER,REMOTE_PASSWORD);
  	$coll = $conn->user->gtokens;
    $result = $coll->find(array(
      'username' => $_SESSION['current_user']
    ));
  	if ($result->hasNext())
      $gtok = $result->getNext();
  	list($atoken,$asecret) = $b->authorize_from_request(
  	  $gtok->oauth_token,
  	  $_SESSION['gtoken_secret'],
  	  $gtok->oauth_verifier
  	);
  	$_SESSION['g_token'] = $atoken;
    $_SESSION['g_secret'] = $asecret;
    $result = $coll->remove(array(
      'username' => $_SESSION['current_user']
    ));
    redirect_to($_SESSION['base_url'].'?stream=gplus');
  }
  
  function _gplus() {
    return array('username'=>$_SESSION['current_user']);
  }
  
  function followbutton() {
    session_start();
    $conn = new Mullet();
    $coll = $conn->user->bookmarks;
    $result = $coll->insert(array(
      'url' => $_POST['url'],
      'title' => $_POST['title']
    ));
    $contents = file_get_contents($_POST['url']);
    $pattern = '~(<link[^>]+)/?>~i';
    $feeds = array();
    $result = @preg_match_all($pattern, $contents, $matches);
    if (isset($matches[1]) && count($matches[1]) > 0) {
      foreach ($matches[1] as $link) {
        if (!mb_check_encoding($link, 'UTF-8'))
          $link = mb_convert_encoding($link, 'UTF-8');
        $link = html_entity_decode($link, ENT_QUOTES, "utf-8");
        $xml = @simplexml_load_string(rtrim($link, ' /') . ' />');
        if ($xml === false)
          continue;
        $attributes = $xml->attributes();
        if (!isset($attributes['rel']) || !@preg_match('~^(?:alternate|service\.feed)~i', $attributes['rel']))
          continue;
        if (!isset($attributes['type']) || !@preg_match('~^application/(?:atom|rss|rdf)\+xml~', $attributes['type']))
          continue;
        if (!isset($attributes['href']))
          continue;
        $feeds[] = $attributes['href'];
      }
    }
    return $feeds;
  }

}