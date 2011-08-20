<?php

if (isset($_POST['linkText']) && !isset($_SESSION[$buffer])) {

$link = $_POST['linkText'];

if (!strstr($link, 'http://')) $link = 'http://' . $link;


$buffer = file_get_contents($link);

$session = $_SESSION[$buffer];

}




//$finfo = new finfo(FILEINFO_MIME_TYPE);
//
//$MIME = $finfo->buffer($buffer);

//function catch_image() {
	
	//.*name=[\"].*description[\"].*content=[\"]([\"]*)[\"]>
	
	$regex1 = "<meta name=[\"][^\"]*[\"].*content=[\"]([^\"]*).*[\"]";
	
	$regex2 = "<meta\sproperty=[\"].*description[\"].*content=[\"]([^\"]*)[\"]";
	
	$regex3 = "<p.*>([^w]*)";
	
	if (preg_match("/$regex2/i",$buffer,$descMatches)) {
		echo $descMatches[1];
	}
	
	else if (preg_match("/$regex1/i",$buffer,$descMatches)) {
		echo $descMatches[1];
	}
	
	else if (preg_match("/$regex3/i",$buffer,$descMatches)) {
		echo $descMatches[1];
	}
	
	
	
	//print_r($descMatches[1]);

	$image = preg_match('/<img.+src=[\"]([^\'"]+)[\"].*>/i', $buffer, $imgMatches);
	//$first_img = $matches [1] [0];
	
	//echo "\n" . $imgMatches[0];
	
	//foreach ($matches as $a) {
//		echo $a . "\n";	
//	}
	
	//echo $matches[0];
	
	//if (empty($first_img)) $first_img = "../image/follow.png";
//	return $first_img;


?>