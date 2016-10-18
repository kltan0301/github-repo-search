$(document).ready(function(){
  var gitRepoSearch = (function(){
    //retrieve elements
    var $repoContainer = $('.repoResults');
    var $searchBtn = $('.addon-custom');
    var $searchField = $('.searchField');
    var $repoDetails = $('.repoDetails');

    var githubURL = "https://api.github.com/";

    function init(){
      $searchBtn.on('click', runSearch)
    }

    function runSearch(){
      var repoName = $searchField.val();

      //check if user keyed values into input box
      if(repoName && !repoName.match(/^\s.*/)){

        $.ajax({
          type: "GET",
          url: githubURL + "search/repositories",
          data: { q: repoName }
         }).done(function(data){
           data.items.forEach(function(repo){
             var repoObj = {};
             repoObj.user = repo.owner.login;
             repoObj.name = repo.full_name;
             repoObj.language =  repo.language || "none";
             repoObj.url = repo.html_url;
             repoObj.description = repo.description || "none";

             //create new user block
             var newUserBlock = $('<div>', { class: "user-block" }).text(repo.full_name);
             newUserBlock.on('click', { repoDetails : repoObj }, retrieveGitDetails)
             $repoContainer.append(newUserBlock);
           })
         })

      } else {
        $repoDetails.text("Please enter a repository in the search box");
      }
    }

    function retrieveGitDetails(event){
      //add all repo details
      var repoDetails = event.data.repoDetails;
      var header = $('<h1>').text("Repository Name: " + repoDetails.name);
      var language = $('<p>').text("Language: " + repoDetails.language);
      var description = $('<p>').text("Description: " + repoDetails.description);
      var url = $('<a>', { href: repoDetails.url }).text(repoDetails.url)
      var user = repoDetails.user;
      //get followers
      $.ajax({
        type: "GET",
        url: githubURL + 'users/' + user + '/followers'
      }).done(function(data){
        var followerStr = "";

        if(data.length > 0){
          data.forEach(function(follower){
            followerStr += follower.login + " | "
          })
        }else{
          followerStr = "none";
        }        
        var followerStr = $('<p>').text("Followers: " + followerStr)
        var userDiv = $('<div>').append(header, language, description, url, followerStr);
        $repoDetails.html(userDiv);
      })
    }
    return {
      init: init
    }
  })();

  gitRepoSearch.init();
})
