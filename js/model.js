

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