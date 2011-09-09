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
	"click #start-upload"	  : "submitPhoto",
	"change #upload-video" 	  : "uploadVideo",
	//"click #submit-photo"	  : "submitPhoto",
	"click #submit-video"	  : "submitVideo",
	"click #shareVideo"   	  : "shareVideo",
	"click .share-button" 	  : "doTweet",
	"keyup #everyone-filter"  : "everyoneFilter",
	"keyup #me-filter"		  : "meFilter",
	"submit .fbComment" 	  : "comment",
	"click .fb-like"     	  : "like",
	"click .show-comment-box" : "showCommentBox",
	"click .show-retweet-box" : "showRetweetBox",
	"click .show-reply-box"   : "showReplyBox",
	"click .do-reply"         : "reply",
	"click .do-retweet"       : "doRetweet",
    "click #facebook-icon"    : "fbclick",
    "click #twitter-icon"     : "twclick",
    "click #saveSettings"     : "saveSettings",
    "click #gplus-icon"       : "gclick"
    
	},
	
	everyoneFilter: function(e) {
		var criteria = e.originalEvent.target.value;
		//alert(criteria);
	},
	
	meFilter: function(e) {
		var criteria = e.originalEvent.target.value;
		//alert(criteria);
	},
	
	submitPhoto: function() {
		//$("#submit-photo").show();
		 $('#upload-photo').fileupload({
        dataType: 'json',
        url: '/posts/fileUpload',
        done: function (data) {
			alert(data);
            $.each(data.result, function (index, file) {
                $('<p/>').text(file.name).appendTo('body');
            });
        }
    });
	return false;
	},
	
	submitVideo: function() {
		
		var uploader = new qq.FileUploader({
    // pass the dom node (ex. $(selector)[0] for jQuery users)
    element: document.getElementById('file-uploader'),
    // path to server-side upload script
    action: '../model/upload-video.php',
	
	onComplete: function(response) {
		alert(reponse);
	}
}); 
		//$("#submit-video").jsupload({
//			action: "..model/upload-video.php",
//			
//			onComplete: function(response) {
//				alert(response);
//			}
//		});
	},
	
	uploadPhoto: function(e) {
		var file = e.originalEvent.target.value;
		
		if (file.search(".jpeg") != -1) {$("#photo-error").hide(); $("#submit-photo").show(); return;}
		else if (file.search(".gif") != -1) {$("#photo-error").hide(); $("#submit-photo").show(); return;}
		else if (file.search(".png") != -1) {$("#photo-error").hide(); $("#submit-photo").show(); return;}
		
		$("#photo-error").fadeIn(1000);
	},
	
	uploadVideo: function(e) {
		var file = e.originalEvent.target.value;
		
		if (file.search(".mp4") != -1) {$("#video-error").hide(); $("#submit-video").show(); return;}
		else if (file.search(".mpg") != -1) {$("#video-error").hide(); $("#submit-video").show(); return;}
		else if (file.search(".ogg") != -1) {$("#video-error").hide(); $("#submit-video").show(); return;}
		else if (file.search(".ogv") != -1) {$("#video-error").hide(); $("#submit-video").show(); return;}
		
		$("#video-error").fadeIn(1000);
	},
	
	saveSettings: function(e) {
	  var email = $("#emailval").val();
		$.ajax({
      contentType: 'application/json',
      dataType: 'json',
			type : 'POST',
			data : JSON.stringify({'email':email}),
      url : '/profiles/savesettings',
			success: function(req){
        if (false == req['ok']) {
  			  alert('so not cool, bro');
        } else  {
	      }
			}
		});
	},
  
	doRetweet: function(e) {
	  var objid = e.originalEvent.target.parentNode.id;
		$.ajax({
      contentType: 'application/json',
      dataType: 'json',
			type : 'POST',
			data : JSON.stringify({'objid':objid}),
      url : '/posts/retweet',
			success: function(req){
			  alert(req['msg']);
        if (false == req['ok']) {
  			  alert('so not cool, bro');
        } else  {
  			  $("#retweet"+objid).hide();
	      }
			}
		});
		return false;
	},
	
	showRetweetBox: function(e) {
		var parentForm = "#" + e.originalEvent.target.parentNode.id;
		$(parentForm + " .retweet-textarea").show();
		$(parentForm + " .do-retweet").show();
		$(parentForm + " .show-retweet-box").hide();
	},
	
	showReplyBox: function(e) {
		var parentForm = "#" + e.originalEvent.target.parentNode.id;
		$(parentForm + " .reply-textarea").show();
		$(parentForm + " .reply-textarea").focus();
		$(parentForm + " .do-reply").show();
		$(parentForm + " .show-reply-box").hide();
		
		// Sets focus of textarea to the end of the text
		$(parentForm + " .reply-textarea").focus(); 
		var val = $(parentForm + " .reply-textarea").val(); 
		$(parentForm + " .reply-textarea").val(''); 
		$(parentForm + " .reply-textarea").val(val);

},
	
	status: function(){
		
		if ($("#statusInput").css('display') == 'none') { 
			$("#shareInput > div").each(function(){$(this).hide();});
			$("#statusInput").fadeIn(200); 
			$("#status-text").focus();
		}
		else $("#statusInput").hide();
		
	},
	
	shareLink: function() {
		
		$("#link-div").hide();
		$("#link-share").hide();
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
			url      : "/links/parseLink",
			data     : {"linkText":linkText},
			dataType : "json",
			success: function(data){
				
				$("#link-div").html('');
				$("#indicator").show();
				if (data["image"] != null) {
				$("#link-div").append('<img src=\"'+data["image"]+'\" style=\"max-width:100px;max-height:100px;margin-bottom:5px;float:left\" />');	
				}
				$("#link-div").append('<h3 style=\"font-weight:bold;\">'+data["title"]+'</h2><br />');
				$("#link-div").append('<h5 style=\"color:#555;\">'+data["link"]+'</h5><br />');
				$("#link-div").append('<h4>'+data["text"]+'</h3>');
				$("#indicator").hide();
				$("#link-share").show();
			}
		});	
		
		return false;
	},
	
	sharePhoto: function() {
		
		$("#upload-photo").val('');
		//$("#submit-photo").hide();
		if ($("#photoInput").css('display') == 'none') {
			
			$("#shareInput > div").each(function(){$(this).hide();});
			$("#photoInput").fadeIn(200);
			
		}
		else $("#photoInput").hide();
		
	},
	
	shareVideo: function() {
		
		$("#upload-video").val('');
		$("#submit-video").hide();
		if ($("#videoInput").css('display') == 'none') {
			
			$("#shareInput > div").each(function(){$(this).hide();});
			$("#videoInput").fadeIn(200);
			
		}
		else $("#videoInput").hide();
		
	},
	
	doTweet: function() {
	  
	  var fb = $("#shareToFacebook").attr('checked');
	  var sendfb = 0;
	  var tw = $("#shareToTwitter").attr('checked');
	  var sendtw = 0;
	  if (fb == true)
	    sendfb = 1;
	  if (tw == true)
	    sendtw = 1;
		$.ajax({
      contentType: 'application/json',
      dataType: 'json',
			type : 'POST',
			data : JSON.stringify({'title':$("#status-text").val(),'sendfb':sendfb,'sendtw':sendtw}),
      url : '/posts',
			success: function(req){
        if (false == req['ok']) {
  			  alert('not cool, bro');
        } else  {
  			  $("#status-text").val('');
	      }
			}
		});
			
	},
	
	reply: function(e) {
	  var objid = e.originalEvent.target.parentNode.id;
	  var comment = $("#twi-reply"+objid).val();
		$.ajax({
      contentType: 'application/json',
      dataType: 'json',
			type : 'POST',
			data : JSON.stringify({'title':comment,'objid':objid}),
      url : '/posts/reply',
			success: function(req){
        if (false == req['ok']) {
  			  alert('so not cool, bro');
        } else  {
  			  $("#twi-reply"+objid).val('');
	      }
			}
		});
		return false;
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
    $("#everyoneStream").html('');

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
         
               $.ajax({
                  type : 'GET',
                	 url : 'html/posts/_twitter.html',
                  success : function(html) {
                    var html = html;
                    $.ajax({
                       contentType: 'application/json',
                       dataType: 'json',
                       type : 'POST',
                       data : JSON.stringify({}),
                       url : '/profiles/twitterstream',
                       success : function(req) {
                         for (var item in req){
                           if (!(undefined == req[item]['user'])) {
                             var id = req[item]['id'];
                             var title = req[item]['text'];
                             var body = req[item]['user']['screen_name'];
                             var avatar = req[item]['user']['profile_image_url'];
                             var comments = '';
                             $("#everyoneStream").prepend($(Mustache.to_html(html,{'title':title,'body':body,'username':body,'avatar':avatar,'id':id,'comments':comments})));
                           }
                 			  }
                       }
                     });
                  }
                });
         
          }
     }
   })
      return false;
    },
	
	fbclick: function(){
   $("#everyoneStream").html('');
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
         
                  $.ajax({
                     type : 'GET',
                   	 url : 'html/posts/_facebook.html',
                     success : function(html) {
                       var html = html;
                       $.ajax({
                          contentType: 'application/json',
                          dataType: 'json',
                          type : 'POST',
                          data : JSON.stringify({}),
                          url : '/profiles/facebookstream',
                          success : function(req) {
                            var req = req['data'];
                            for (var item in req){
                                var id = req[item]['id'];
                                if (req[item]['type'] == 'status')
                                  var title = req[item]['message'];
                                if (req[item]['type'] == 'link')
                                  var title = req[item]['description'];
                                if (req[item]['type'] == 'photo' &&
                                !(undefined == req[item]['message']))
                                  var title = req[item]['message'];
                                var body = req[item]['from']['name'];
                                var avatar = 'http://graph.facebook.com/'+req[item]['from']['id']+'/picture?type=small';
                                var comments = [];
                                var likes = [];
                                var likecount = 0;
                                var haslikes = false;
                                var manylikes = false;
                                var onelike = false;
                                var hascomments = false;
                                var manyothers = false;
                                var haspic = false;
                                var pic = '';
                                var piclink = '';
                                var message = '';
                                if (!(undefined == req[item]['comments'])){
                                  if (req[item]['comments']['count'] > 0){
                                    var comms = req[item]['comments']['data'];
                                    for (comm in comms) {
                                      var commlikes = false;
                                      if (!(undefined == comms[comm]['likes'])) {
                                        commlikes = true;
                                        if (comms[comm]['likes'] > 1)
                                          var likes = comms[comm]['likes'] + ' people';
                                        else
                                          var likes = comms[comm]['likes'] + ' person';
                                      }
                                      comments.push(
                                        {
                                          'name':comms[comm]['from']['name'],
                                          'message':comms[comm]['message'],
                                          'avatar':'http://graph.facebook.com/'+comms[comm]['from']['id']+'/picture?type=small',
                                          'likes':likes,
                                          'haslikes':commlikes
                                        }
                                      );
                                    }
                                    hascomments = true;
                                  }
                                }
                                if (!(undefined == req[item]['likes'])){
                                  likes = req[item]['likes']['data'];
                                  likecount = req[item]['likes']['count'];
                                  if (likecount > 0)
                                    haslikes = true;
                                  if (likecount > 1)
                                    manylikes = true;
                                  else
                                    onelike = true;
                                  if (haslikes) {
                                    likecount = likecount - 1;
                                  }
                                  if (likecount > 1)
                                    manyothers = true;
                                }
                                if (!(undefined == req[item]['picture'])) {
                                  pic = req[item]['picture'];
                                  piclink = req[item]['link'];
                                  haspic = true;
                                }
                                $("#everyoneStream").prepend($(Mustache.to_html(html,{
                                  'title':title,
                                  'body':body,
                                  'username':body,
                                  'avatar':avatar,
                                  'id':id,
                                  'comments':comments,
                                  'likes':likes,
                                  'likecount':likecount,
                                  'haslikes':haslikes,
                                  'hascomments':hascomments,
                                  'manylikes':manylikes,
                                  'manyothers':manyothers,
                                  'onelike':onelike,
                                  'haspic':haspic,
                                  'pic':pic,
                                  'piclink':piclink
                                })));
                              }
                          }
                        });
                     }
                   });
         
         
          }
     }
   })
      return false;
    },
    
    gclick: function(){
      $("#everyoneStream").html('');

     $.ajax({
       contentType: 'application/json',
       dataType: 'json',
              type : 'POST',
              data : JSON.stringify({}),
       url : '/profiles/hasgplus',
       success : function(req) {
         if (false == req['ok']) {
           //window.location.href = 'http://'+req['user']+'.followbutton.com/profiles/gplus';
           
           
           $.ajax({
              type : 'GET',
            	 url : 'html/profiles/_gplus.html',
              success : function(html) {
                var html = html;
                $.ajax({
                   contentType: 'application/json',
                   dataType: 'json',
                   type : 'POST',
                   data : JSON.stringify({}),
                   url : '/profiles/_gplus',
                   success : function(req) {
                      $("#everyoneStream").prepend($(Mustache.to_html(html,req)));
                   }
                 });
              }
            });
           
         } else  {
           $("#twitter-icon img").attr('src',"image/twitter-grey.png");
           $("#gplus-icon img").attr('src',"image/gplus-color.png");
           $("#facebook-icon img").attr('src',"image/facebook-grey.png");

                 $.ajax({
                    type : 'GET',
                  	 url : 'html/posts/_gplus.html',
                    success : function(html) {
                      var html = html;
                      $.ajax({
                         contentType: 'application/json',
                         dataType: 'json',
                         type : 'POST',
                         data : JSON.stringify({}),
                         url : '/profiles/gplusstream',
                         success : function(req) {
                           for (var item in req){
                             if (!(undefined == req[item]['user'])) {
                               var id = req[item]['id'];
                               var title = req[item]['text'];
                               var body = req[item]['user']['screen_name'];
                               var avatar = req[item]['user']['profile_image_url'];
                               var comments = '';
                               $("#everyoneStream").prepend($(Mustache.to_html(html,{'title':title,'body':body,'username':body,'avatar':avatar,'id':id,'comments':comments})));
                             }
                   			  }
                         }
                       });
                    }
                  });

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
	  "click #username"  : "account",
	  "click #account"   : "account",
      "click #showhide"  : "showHide",
      "click #settings"  : "settings",
	  "click #privacy"   : "privacy",
	  "click #following" : "following",
      "click #logout"    : "logout",
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
      var activeFeed = 'facebook';
  	  if ($("#twitter-icon img").attr('src') == "image/twitter-color.png")
  	    activeFeed = 'twitter';

      $.ajax({
        contentType: 'application/json',
        dataType: 'json',
  			type : 'GET',
        url : '/changes',
        success : function(data) {
          var feeds=new Array();
    			for (var feed in data['updatedFeeds']['updatedFeed']){
    				feedtitle = data['updatedFeeds']['updatedFeed'][feed]['feedTitle'];





                				if (activeFeed == 'twitter' && feedtitle == 'twitter') {
                				  var everyoneItems = data['updatedFeeds']['updatedFeed'][feed]['item'];
                          $.ajax({
                            type : 'GET',
                          	url : 'html/posts/_twitter.html',
                            success : function(html) {
                      				for (var item in everyoneItems){
                      				  title = everyoneItems[item]['title'];
                      				  body = everyoneItems[item]['body'];
                      				  comments = everyoneItems[item]['comments'];
                      				  id = everyoneItems[item]['id'];
                      				  avatar = everyoneItems[item]['enclosure'][0]['url'];
                      				  var newc = true;
                      				  $('#everyoneStream li').each(function(index) {
                                  if ($(this).find(".twiReply").attr('id') == id) newc = false;
                                });
                                if (newc == true)
                                  $("#everyoneStream").prepend($(Mustache.to_html(html, {'title':title,'body':body,'username':body,'avatar':avatar,'id':id,'comments':comments})));
                      			  }
                            }
                          });
                				}

                				if (activeFeed == 'facebook' && feedtitle == 'facebook') {
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
      setInterval(this.poll, 20*1000);
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