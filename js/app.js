
jQuery(function($){

	//These determine which content page is active. 0 = not active, 1 = active.
	var maincont = 1;
	var followcont = 0;
	var privacycont = 0;
	var appearancecont = 0;
	var activitycont = 0;
	
	$('.hovertip').hoverbox();
	
		
	$('#fancylink').fancybox({
		
		
		scrolling: 'no'
		
		
		});
		
	$('#photobtn').click(function(){
		
		$('#upvideo').fadeOut(400, function(){$('#upphoto').fadeIn()});

		
		
	});
	
	$('#videobtn').click(function(){
				
				
		$('#upphoto').fadeOut(400, function(){$('#upvideo').fadeIn()});

		
		
	});
	
	$('#hideshare').click(function(){
		
		
		//$('#tohide').fadeOut();
		$('#tohide').hide(0, function(){
			
			$('#hideshare').fadeOut(200, function(){
				
				$('#showshare').fadeIn(200);
				
			});
		
		});
		
	});
	
	$('#showshare').click(function(){
		
		
		//$('#tohide').fadeOut();
		$('#tohide').show(0, function(){
			
			$('#showshare').fadeOut(200, function(){
				
				$('#hideshare').fadeIn(200);
				
			});
		
		});
		
	});
	
	$('#username').click(function(){
		
		if (followcont == 1 && maincont == 0)		{
		
			$('#followstuff').fadeOut(100, function(){
				
				$('#mainstuff').show();
				
			});
			
			followcont = 0;
			maincont = 1;
			
		}
		
		if (privacycont == 1 && maincont == 0)		{
		
			$('#privacystuff').fadeOut(100, function(){
				
				$('#mainstuff').show();
				
			});
			
			privacycont = 0;
			maincont = 1;
			
		}
		
		if (appearancecont == 1 && maincont == 0)		{
		
			$('#appearancestuff').fadeOut(100, function(){
				
				$('#mainstuff').show();
				
			});
			
			appearancecont = 0;
			maincont = 1;
			
		}
		
		if (activitycont == 1 && maincont == 0)		{
		
			$('#activitystuff').fadeOut(100, function(){
				
				$('#mainstuff').show();
				
			});
			
			activitycont = 0;
			maincont = 1;
			
		}
		
	});
	
	
	$('#following').click(function(){
		
		if (maincont == 1 && followcont == 0)		{
		
			$('#mainstuff').fadeOut(100, function(){
				
				$('#followstuff').show();
				
			});
			
			maincont = 0;
			followcont = 1;
			
		}
		
		if (privacycont == 1 && followcont == 0)		{
		
			$('#privacystuff').fadeOut(100, function(){
				
				$('#followstuff').show();
				
			});
			
			privacycont = 0;
			followcont = 1;
			
		}
		
		if (appearancecont == 1 && followcont == 0)		{
		
			$('#appearancestuff').fadeOut(100, function(){
				
				$('#followstuff').show();
				
			});
			
			appearancecont = 0;
			followcont = 1;
			
		}
		
		if (activitycont == 1 && followcont == 0)		{
		
			$('#activitystuff').fadeOut(100, function(){
				
				$('#followstuff').show();
				
			});
			
			activitycont = 0;
			followcont = 1;
			
		}
		
	});
	
	$('#privacy').click(function(){
		
		if (followcont == 1 && privacycont == 0)		{
		
			$('#followstuff').fadeOut(100, function(){
				
				$('#privacystuff').show();
				
			});
			
			followcont = 0;
			privacycont = 1;
			
		}
		
		if (maincont == 1 && privacycont == 0)		{
		
			$('#mainstuff').fadeOut(100, function(){
				
				$('#privacystuff').show();
				
			});
			
			maincont = 0;
			privacycont = 1;
			
		}
		
		if (appearancecont == 1 && privacycont == 0)		{
		
			$('#appearancestuff').fadeOut(100, function(){
				
				$('#privacystuff').show();
				
			});
			
			appearancecont = 0;
			privacycont = 1;
			
		}
		
		if (activitycont == 1 && privacycont == 0)		{
		
			$('#activitystuff').fadeOut(100, function(){
				
				$('#privacystuff').show();
				
			});
			
			activitycont = 0;
			privacycont = 1;
			
		}
		
	});
	
	$('#appearance').click(function(){
		
		if (followcont == 1 && appearancecont == 0)		{
		
			$('#followstuff').fadeOut(100, function(){
				
				$('#appearancestuff').show();
				
			});
			
			followcont = 0;
			appearancecont = 1;
			
		}
		
		if (privacycont == 1 && appearancecont == 0)		{
		
			$('#privacystuff').fadeOut(100, function(){
				
				$('#appearancestuff').show();
				
			});
			
			privacycont = 0;
			appearancecont = 1;
			
		}
		
		if (maincont == 1 && appearancecont == 0)		{
		
			$('#mainstuff').fadeOut(100, function(){
				
				$('#appearancestuff').show();
				
			});
			
			maincont = 0;
			appearancecont = 1;
			
		}
		
		if (activitycont == 1 && appearancecont == 0)		{
		
			$('#activitystuff').fadeOut(100, function(){
				
				$('#appearancestuff').show();
				
			});
			
			activitycont = 0;
			appearancecont = 1;
			
		}
		
	});
	
	$('#activity').click(function(){
		
		if (followcont == 1 && activitycont == 0)		{
		
			$('#followstuff').fadeOut(100, function(){
				
				$('#activitystuff').show();
				
			});
			
			followcont = 0;
			activitycont = 1;
			
		}
		
		if (privacycont == 1 && activitycont == 0)		{
		
			$('#privacystuff').fadeOut(100, function(){
				
				$('#activitystuff').show();
				
			});
			
			privacycont = 0;
			activitycont = 1;
			
		}
		
		if (appearancecont == 1 && activitycont == 0)		{
		
			$('#appearancestuff').fadeOut(100, function(){
				
				$('#activitystuff').show();
				
			});
			
			appearancecont = 0;
			activitycont = 1;
			
		}
		
		if (maincont == 1 && activitycont == 0)		{
		
			$('#mainstuff').fadeOut(100, function(){
				
				$('#activitystuff').show();
				
			});
			
			maincont = 0;
			activitycont = 1;
			
		}
		
	});
	
	
	$('#submitbtn').click(function(){
		
		var postTitle = document.getElementById('thetitle').value;
		var postStuff = document.getElementById('thepost').value;
		
		var newstuff = document.getElementById('newstuff');
		var newtitle = document.createElement('h1');
		var newpost = document.createElement('p');
		
		newtitle.appendChild(document.createTextNode(postTitle));
		newpost.appendChild(document.createTextNode(postStuff));
		newstuff.appendChild(newtitle);
		newstuff.appendChild(newpost);
		
	});
	
	
	
	$('.getrid').click(function(){
		
		$(this).fadeOut();
		
	});
	
	//if (document.getElementById('groupcheck').checked == 'yes') {alert('hi');}
//	
	$('#groupcheck').click(function(){
		
		
		
		$('#options').show();
		
	});

  /* Tabs Activiation
	================================================== */
	var tabs = $('ul.tabs'),
	    tabsContent = $('ul.tabs-content');
	
	tabs.each(function(i) {
		//Get all tabs
		var tab = $(this).find('> li > a');
		tab.click(function(e) {
			
			//Get Location of tab's content
			var contentLocation = $(this).attr('href') + "Tab";
			
			//Let go if not a hashed one
			if(contentLocation.charAt(0)=="#") {
			
				e.preventDefault();
			
				//Make Tab Active
				tab.removeClass('active');
				$(this).addClass('active');
				
				//Show Tab Content
				$(contentLocation).show().siblings().hide();
				
			} 
		});
	}); 
	
	
});

var timeout    = 500;
var closetimer = 0;
var ddmenuitem = 0;

function jsddm_open()
{  jsddm_canceltimer();
   jsddm_close();
   ddmenuitem = $(this).find('ul').css('visibility', 'visible');}

function jsddm_close()
{  if(ddmenuitem) ddmenuitem.css('visibility', 'hidden');}

function jsddm_timer()
{  closetimer = window.setTimeout(jsddm_close, closetimer);}

function jsddm_canceltimer()
{  if(closetimer)
   {  window.clearTimeout(closetimer);
      closetimer = null;}}

$(document).ready(function()
{  $('#jsddm > li').bind('mouseover', jsddm_open)
   $('#jsddm > li').bind('mouseout',  jsddm_timer)});

document.onclick = jsddm_close;




