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

  window.Share = Spine.Controller.create({

	events: {
	"click #status"      	  : "status",
	"click #shareLink"   	  : "shareLink",
	"click #attachLink"  	  : "attachLink",
	"click #sharePhoto" 	  : "sharePhoto",
	"click #shareVideo"   	  : "shareVideo",
	"click .shareBtn"    	  : "doTweet",
	"submit .fbComment" 	  : "comment",
	"click .fb-like"     	  : "like",
	"click .show-comment-box" : "showCommentBox",
    "click #facebook-icon"    : "fbclick",
    "click #twitter-icon"     : "twclick"
	},
	
	status: function(){
		
		if ($("#statusInput").css('display') == 'none') { 
			$("#shareInput > div").each(function(){$(this).hide();});
			$("#statusInput").fadeIn(200); 
			$("#statusText").focus();
		}
		else $("#statusInput").hide();
		
	},
	
	shareLink: function() {
		
		$("#link-div").hide();
		if ($("#linkInput").css('display') == 'none') { 
			$("#shareInput > div").each(function(){$(this).hide();});
			$("#linkInput").fadeIn(200); 
			$("#linkText").focus();
		}
		else $("#linkInput").hide();
		
	},
	
	attachLink: function(){
		$("#link-div").fadeIn(200);
		$("#indicator").show();
		var linkText = $("#linkText").val();
		$.ajax({
			type     : "POST",
			url      : "../model/links.php",
			data     : {"linkText":linkText},
			dataType : "json",
			success: function(data){
				//alert(data["title"]);
				//alert(data["title2"]);
				
				$("#link-div").html('');
				$("#indicator").show();
				if (data["image"] != null) {
				$("#link-div").append('<img src=\"'+data["image"]+'\" style=\"max-width:100px;max-height:100px;margin-bottom:5px;float:left\" />');	
				}
				$("#link-div").append('<h2 style=\"font-weight:bold;\">'+data["title"]+'</h2><br />');
				$("#link-div").append('<h5 style=\"color:#555;\">'+data["link"]+'</h5><br />');
				$("#link-div").append('<h3>'+data["text"]+'</h3>');
				$("#indicator").hide();
			}
		});	
		
		return false;
	},
	
	sharePhoto: function() {
		
		if ($("#photoInput").css('display') == 'none') {
			
			$("#shareInput > div").each(function(){$(this).hide();});
			$("#photoInput").fadeIn(200);
			
		}
		else $("#photoInput").hide();
		
	},
	
	shareVideo: function() {
		
		
		if ($("#videoInput").css('display') == 'none') {
			
			$("#shareInput > div").each(function(){$(this).hide();});
			$("#videoInput").fadeIn(200);
			
		}
		else $("#videoInput").hide();
		
	},
	
	doTweet: function() {
	  
	  var fb = $("#shareToFacebook").attr('checked');
	  var sendfb = 0;
	  if (fb == true)
	    sendfb = 1;
		$.ajax({
      contentType: 'application/json',
      dataType: 'json',
			type : 'POST',
			data : JSON.stringify({'title':$("#statusText").val(),'sendfb':sendfb}),
      url : '/posts',
			success: function(req){
        if (false == req['ok']) {
  			  alert('not cool, bro');
        } else  {
  			  $("#statusText").val('');
	      }
			}
		});
			
	},
	
	comment: function(e) {
	  var objid = e.originalEvent.target.id;
	  var comment = $("#comment"+objid).val();
		$.ajax({
      contentType: 'application/json',
      dataType: 'json',
			type : 'POST',
			data : JSON.stringify({'title':comment,'objid':objid}),
      url : '/posts/comment',
			success: function(req){
        if (false == req['ok']) {
  			  alert('so not cool, bro');
        } else  {
  			  $("#comment"+objid).val('');
	      }
			}
		});
		return false;
	},

	like: function(e) {
	  var objid = e.originalEvent.target.parentNode.id;
		$.ajax({
      contentType: 'application/json',
      dataType: 'json',
			type : 'POST',
			data : JSON.stringify({'objid':objid}),
      url : '/posts/like',
			success: function(req){
        if (false == req['ok']) {
  			  alert('so not cool, bro');
        } else  {
  			  $("#likebtn"+objid).hide();
	      }
			}
		});
		return false;
	},
	
	
	showCommentBox: function(e) {
		var some = "#" + e.originalEvent.target.parentNode.id;
		$(some + " textarea").show();
	},
	
	twclick: function(){

   $.ajax({
     contentType: 'application/json',
     dataType: 'json',
            type : 'POST',
            data : JSON.stringify({}),
     url : '/profiles/hastwitter',
     success : function(req) {
       if (false == req['ok']) {
         window.location.href = 'http://'+req['user']+'.followbutton.com/profiles/twitter';
       } else  {
         $("#twitter-icon img").attr('src',"image/twitter-color.png");
         $("#facebook-icon img").attr('src',"image/facebook-grey.png");
          }
     }
   })
      return false;
    },
	
	fbclick: function(){

   $.ajax({
     contentType: 'application/json',
     dataType: 'json',
            type : 'POST',
            data : JSON.stringify({}),
     url : '/profiles/hasfacebook',
     success : function(req) {
       if (false == req['ok']) {
         window.location.href = 'http://'+req['user']+'.followbutton.com/profiles/facebook';
       } else  {
         $("#twitter-icon img").attr('src',"image/twitter-grey.png");
         $("#facebook-icon img").attr('src',"image/facebook-color.png");
          }
     }
   })
      return false;
    }
	
  });


  window.FollowButtonApp = Spine.Controller.create({
  
    el: $("body"),
  
    proxied: [],
  
    elements: {
    },
  
    events: {
	  "click #account"   : "account",
      "click #showhide"  : "showHide",
      "click #settings"  : "settings",
	  "click #privacy"   : "privacy",
	  "click #following" : "following",
      "click #logout"    : "logout"
    },
    
    logout: function() {
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
            window.location.href = 'http://followbutton.com/';
  	      }
        }
      })
    },
    poll: function() {


      $.ajax({
        contentType: 'application/json',
        dataType: 'json',
  			type : 'GET',
        url : '/changes',
        success : function(data) {
          var feeds=new Array();
    			for (var feed in data['updatedFeeds']['updatedFeed']){
    				feedtitle = data['updatedFeeds']['updatedFeed'][feed]['feedTitle'];

            /*
                				if (feedtitle == 'twitter') {
                				  var everyoneItems = data['updatedFeeds']['updatedFeed'][feed]['item'];
                          $.ajax({
                            type : 'GET',
                          	url : 'html/posts/_twitter.html',
                            success : function(html) {
                      				for (var item in everyoneItems){
                      				  if (everyoneItems[item]['type'] == 'twitter') {
                        				  title = everyoneItems[item]['title'];
                        				  body = everyoneItems[item]['body'];
                        				  comments = everyoneItems[item]['comments'];
                        				  id = everyoneItems[item]['id'];
                        				  avatar = everyoneItems[item]['enclosure'][0]['url'];
                                  $("#everyoneStream").prepend($(Mustache.to_html(html, {'title':title,'body':body,'username':body,'avatar':avatar,'id':id,'comments':comments})));
                                }
                      			  }
                            }
                          });
                				}*/

                				if (feedtitle == 'facebook') {
                				  var everyoneItems = data['updatedFeeds']['updatedFeed'][feed]['item'];
                          $.ajax({
                            type : 'GET',
                          	url : 'html/posts/_facebook.html',
                            success : function(html) {
                      				for (var item in everyoneItems){
                      				  title = everyoneItems[item]['title'];
                      				  body = everyoneItems[item]['body'];
                      				  comments = everyoneItems[item]['comments'];
                      				  id = everyoneItems[item]['id'];
                      				  avatar = everyoneItems[item]['enclosure'][0]['url'];
                      				  var newc = true;
                      				  $('#everyoneStream li').each(function(index) {
                                  if ($(this).find(".fbComment").attr('id') == id) newc = false;
                                });
                                if (newc == true)
                                  $("#everyoneStream").prepend($(Mustache.to_html(html, {'title':title,'body':body,'username':body,'avatar':avatar,'id':id,'comments':comments})));
                      			  }
                            }
                          });
                				}

    				/*
    				 else {


      				for (var item in data['updatedFeeds']['updatedFeed'][feed]['item']){
      				  title = data['updatedFeeds']['updatedFeed'][feed]['item'][item]['title'];
      				  //alert(title);
      				  body = data['updatedFeeds']['updatedFeed'][feed]['item'][item]['body'];
      				  if (undefined !== title)
      						feeds[feedtitle] = true;
      			  }
  			    }
  			    */
    			}
    			sources = new Array();
    			feedarr = new Array();
    			var id = 0;
    			for(var f in feeds) {
    				var a = new Array();
    				a['name'] = f;
    				a['id'] = id;
    				feedarr[id] = f;
    				sources.push(a);
    				id++;
    			}
//    			$(this).data('feeds',feedarr);
//          return {
//    	      sources : sources
//          };
        }
      });



      //alert('poll');
    },
	
	account: function() {
	$.ajax({
        type : 'GET',
      	url : 'html/_index.html',
        success : function(html) {
          var tpl = html;
          $.ajax({
            contentType: 'application/json',
            dataType: 'json',
      			type : 'POST',
      			data : JSON.stringify({}),
            url : '/_index',
            success : function(req) {
              if (false == req['ok']) {
         				alert('sorry, there was an error loading the page');
              } else  {
                $("#partials").html($(Mustache.to_html(tpl, req)));
      	      }
            }
          })
        }
      });
	},
    
    settings: function() {
      $.ajax({
        type : 'GET',
      	url : 'html/profiles/_settings.html',
        success : function(html) {
          var tpl = html;
          $.ajax({
            contentType: 'application/json',
            dataType: 'json',
      			type : 'POST',
      			data : JSON.stringify({}),
            url : '/profiles/_settings',
            success : function(req) {
              if (false == req['ok']) {
         				alert('sorry, there was an error loading the page');
              } else  {
                $("#partials").html($(Mustache.to_html(tpl, req)));
      	      }
            }
          })
        }
      });
    },
	
	 privacy: function() {
      $.ajax({
        type : 'GET',
      	url : 'html/profiles/_privacy.html',
        success : function(html) {
          var tpl = html;
          $.ajax({
            contentType: 'application/json',
            dataType: 'json',
      			type : 'POST',
      			data : JSON.stringify({}),
            url : '/profiles/_privacy',
            success : function(req) {
              if (false == req['ok']) {
         				alert('sorry, there was an error logging out');
              } else  {
                $("#partials").html($(Mustache.to_html(tpl, req)));
      	      }
            }
          })
        }
      });
    },
	
	 following: function() {
      $.ajax({
        type : 'GET',
      	url : 'html/profiles/_following.html',
        success : function(html) {
          var tpl = html;
          $.ajax({
            contentType: 'application/json',
            dataType: 'json',
      			type : 'POST',
      			data : JSON.stringify({}),
            url : '/profiles/_following',
            success : function(req) {
              if (false == req['ok']) {
         				alert('sorry, there was an error logging out');
              } else  {
                $("#partials").html($(Mustache.to_html(tpl, req)));
      	      }
            }
          })
        }
      });
    },

    init: function() {
      setInterval(this.poll, 15*1000);
      this.poll();
      
      Profiles.init({ el:$("body") });
	  Share.init({ el:$("body") });
      $.ajax({
        type : 'GET',
      	url : 'html/_index.html',
        success : function(html) {
          
          var tpl = html;
          $.ajax({
            contentType: 'application/json',
            dataType: 'json',
      			type : 'POST',
      			data : JSON.stringify({}),
            url : '/profiles/index',
            success : function(req) {
              if (false == req['ok']) {
         				alert('sorry, there was an error loading the page');
              } else  {
                $("#partials").html($(Mustache.to_html(tpl, req)));
      	      }
            }
          })
          
        }
      });
    },
  
    showHide: function() {
    }

  });

  window.Profiles = Spine.Controller.create({
    events: {
  
    },
    init: function(){
      $("#login_name").focus();
    },
    signbtn: function(e) {
//  		window.location.href = 'https://followbutton.com/';
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
      var resource = 'posts';
      var action = 'index';
      $.ajax({
        type : 'GET',
  			url : '/templates/'+resource+'/'+action+'.html',
        success : function(req) {
        }
      })
    }
  });

  window.App = FollowButtonApp.init();

});