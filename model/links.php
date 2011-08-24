<?php

if (isset($_POST['linkText']) && !isset($session)) {

$link = $_POST['linkText'];

if (!strstr($link, 'http://')) $link = 'http://' . $link;

$buffer = file_get_contents($link);

$session = $_SESSION[$buffer];

}

	// Find the title of the page.
	
	$titleRegex = "<title>(.*)";
	
	preg_match("/$titleRegex/",$buffer,$titleMatch);
	$title = $titleMatch[1];


	// Find the description of the page.
	
	$regex1 = "<meta name=[\"].*description[\"].*content=[\"]([^\"]*).*[\"]";
	
	$regex2 = "<meta\sproperty=[\"].*description[\"].*content=[\"]([^\"]*)[\"]";
	
	$regex3 = "<p.*>([^>]*)";
	
	if (preg_match("/$regex2/i",$buffer,$descMatches)) {
		$text = $descMatches[1];
	}
	
	else if (preg_match("/$regex1/i",$buffer,$descMatches)) {
		$text = $descMatches[1];
	}
	
	else if (preg_match("/$regex3/i",$buffer,$descMatches)) {
		$text = $descMatches[0];
	}
	
	
	
	// Find an image associated with the page.

	$imgRegex1 = "<meta\sproperty=\".*image\".*content=\"([^\"]*)\"";
	
	$imgRegex2 = "<img.*src=\"([^\"]*)\"";

	if (preg_match("/$imgRegex1/i", $buffer, $imgMatches)) {
		//echo $imgMatches[0];
		$image = $imgMatches[1];
	}
	
	else if (preg_match("/$imgRegex2/i", $buffer, $imgMatches)) {
		//echo $imgMatches[0];
		$image = $imgMatches[1];
	}	
	
	
	$data = array("title"=>$title,"text"=>$text,"image"=>$image,"link"=>$link);
	$data = json_encode($data);
	
	echo $data;

?>