<?php

if (isset($_POST['linkText'])) {

$link = $_POST['linkText'];

if (!strstr($link, 'http://')) $link = 'http://' . $link;

$buffer = file_get_contents($link);


//$finfo = new finfo(FILEINFO_MIME_TYPE);
//
//$MIME = $finfo->buffer($buffer);

//function catch_image() {
	
	$description = preg_match('/<meta.*name=[\'"].*description[\'"].*content=[\'"]([\'"]*)[\'"].*>/i',$buffer,$descMatches);
	
	echo $descMatches[0];

	$image = preg_match_all('/<img.+src=[\'"]([^\'"]+)[\'"].*>/i', $buffer, $imgMatches);
	//$first_img = $matches [1] [0];
	
	foreach ($matches as $a) {
		echo $a . "\n";	
	}
	
	//echo $matches[0];
	
	//if (empty($first_img)) $first_img = "../image/follow.png";
//	return $first_img;
	




}

?>