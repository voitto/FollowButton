

var Post = Spine.Model.setup( "Post", [ "title", "body" ] );
Post.extend(Spine.Model.Ajax);
Post.bind("ajaxError", function(record, xhr, settings, error){ 
  alert("Error: "+error);
});

var Profile = Spine.Model.setup( "Profile", [ "username", "password" ] );
Profile.extend(Spine.Model.Ajax);
Profile.bind("ajaxError", function(record, xhr, settings, error){ 
  alert("Error: "+error);
});


jQuery(function($){

  window.Posts = Spine.Controller.create({
    
    tag: "li",
    
    elements: {
    },
    
    events: {
    },
    
    init: function(){
    },
    
    render: function(){
    },
    
    show: function(){
    },
    
    remove: function(){
    }
    
  });




  window.DomainEditorApp = Spine.Controller.create({
    
    el: $("body"),
    
    proxied: [],
    
    elements: {
    },
    
    events: {
      "click #showhide" : "showHide"
    },
  
    init: function() {
    },
    
    showHide: function() {
    }

  });



  
	window.Profiles = Spine.Controller.create({
    events: {
      "submit #login_form": "login",
      "keyup #login_form": "key",
      "click #logbtn": "logbtn",
      "click #signbtn": "signbtn"
    },
    key: function(e){
      if (e.keyCode == 13) $("#logbtn").trigger("click");
    },
    init: function(){
      $("#login_name").focus();
    },
    logbtn: function(e) {
      if ($("#logbtn").attr('value') == 'Logout') {
        this.leave();
      } else {
    	  this.login(e);
  	  }
    },
    signbtn: function(e) {
			window.location.href = 'https://followbutton.com/register.php';
    },
    leave: function(e) {
      $.ajax({
        contentType: 'application/json',
        dataType: 'json',
				type : 'POST',
				data : JSON.stringify({}),
        url : '/profiles/logout',
        success : function(req) {
	        if (false == req['ok']) {
     				alert('sorry, there was an error logging out');
	        } else  {
            $("#logbtn").attr('value','Login');
            $("#signbtn").show();
            $("#formhider").show();
            $("#thepitch").show();
            $("#editorhider").hide();
            $("#sublist").hide();
            $("#useremail").html('');
            $("#useremail").hide();
		      }
        }
      })
    },
    login: function(e){
      e.preventDefault();
      action = 'Login';
      if (action == 'Login') {
        res = this.auth({
          username:$("#login_name").val(),
          password:$("#login_pass").val(),
        });
      }
      if (action == 'Register') {
        res = this.reg({
          username:$("#login_name").val(),
          password:$("#login_pass").val(),
        });
      }
    },
    auth: function(obj) {
      var controller = this;
      var useremail = obj.username;
      $.ajax({
        contentType: 'application/json',
        dataType: 'json',
				type : 'POST',
				data : JSON.stringify({ 'username': obj.username, 'password': obj.password }),
        url : '/profiles/login',
        success : function(req) {
	        if (false == req['ok']) {
     				alert('sorry, your username or password was incorrect');
	        } else  {
            $("#logbtn").attr('value','Logout');
            $("#signbtn").hide();
            $("#formhider").hide();
            $("#useremail").html(useremail);
            $("#useremail").show();
            controller.after();
		      }
		      $("#login_pass").val('');
		      $("#login_name").val('');
        }
      })
    },
    reg: function(obj) {
      var controller = this;
      $.ajax({
        contentType: 'application/json',
        dataType: 'json',
				type : 'POST',
				data : JSON.stringify({ 'username': obj.username, 'password': obj.password }),
        url : '/profiles/register',
        success : function(req) {
	        if (false == req['ok']) {
     				alert('sorry, your new account could not be created');
	        } else  {
            $("#logbtn").attr('value','Logout');
            $("#formhider").hide();
            $("#signbtn").hide();
            controller.after();
		      }
		      $("#login_pass").val('');
		      $("#login_name").val('');
        }
      })
    },
    after: function() {
      var resource = 'subdomains';
      var action = 'index';
      $.ajax({
        type : 'GET',
				url : '/templates/'+resource+'/'+action+'.html',
        success : function(req) {
        }
      })
    }
  });

  window.App = DomainEditorApp.init();
 


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




