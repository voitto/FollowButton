<?php

if (isset($_POST['linkText'])) {

$link = $_POST['linkText'];

if (!strstr($link, 'http://')) $link = 'http://' . $link;

$buffer = file_get_contents($link);


//$finfo = new finfo(FILEINFO_MIME_TYPE);
//
//$MIME = $finfo->buffer($buffer);

//function catch_image() {
	
	//.*name=[\'"].*description[\'"].*content=[\'"]([\'"]*)[\'"]>
	
	$description = preg_match('/<meta/i',$buffer,$descMatches);
	
	echo $descMatches[0];

	$image = preg_match('/<img.+src=[\'"]([^\'"]+)[\'"].*>/i', $buffer, $imgMatches);
	//$first_img = $matches [1] [0];
	
	//echo "\n" . $imgMatches[0];
	
	//foreach ($matches as $a) {
//		echo $a . "\n";	
//	}
	
	//echo $matches[0];
	
	//if (empty($first_img)) $first_img = "../image/follow.png";
//	return $first_img;
	




}

?>