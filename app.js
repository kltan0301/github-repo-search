$(document).ready(function(){
  var gitRepoSearch = (function(){
    //retrieve elements
    var $matchedResults = $('.matched-results').find('ul');
    var $searchBtn = $('.addon-custom');
    var $searchField = $('.searchField');
    var $repoDetails = $('.repoDetails');

    var githubURL = "https://api.github.com/";

    function init(){
      $searchBtn.on('click', runSearch);
    }

    function runSearch(){
      var repoName = $searchField.val();
      //clear matched results container
      $matchedResults.html("");

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
             var userListItem = $('<li>');
             var newUserBlock = $('<div>', { class: "user-block" });
             var userRepoName = $('<div>', {class:"repo-description"}).html('<h2>' +repo.full_name + '</h2>')
             var userRepoDetails = $('<div>', {class:"repo-details hide"}).html('<p>'+ repo.language + '</p>');
             var arrow = $('<span>', {class: "glyphicon glyphicon-chevron-down right-arrow"})

             arrow.on('click',{ repoDetails : repoObj }, retrieveGitDetails);

             //append children to parent container
             userRepoName.append(userRepoDetails);
             newUserBlock.append(userRepoName).append(arrow);
             userListItem.append(newUserBlock);
            //  newUserBlock.on('click', { repoDetails : repoObj }, retrieveGitDetails)
             $matchedResults.append(userListItem);
           })
         })

      } else {
        $matchedResults.text("Please enter a repository in the search box");
      }
    }

    function retrieveGitDetails(event){
      var repoDetailContainer = $(this).siblings().find('.repo-details');
      //clear the repo details
      repoDetailContainer.html("").toggleClass('hide')
      //add all repo details
      var repoDetails = event.data.repoDetails;
    //   var header = $('<h1>').text("Repository Name: " + repoDetails.name);
      var language = $('<p>').text("Language: " + repoDetails.language);
      var description = $('<p>').text("Description: " + repoDetails.description);
      var url = $('<a>', { href: repoDetails.url }).text("Url: " + repoDetails.url)
      var user = repoDetails.user;
    //   //get followers
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
        repoDetailContainer.append(language, description, url, followerStr);
      })
    }
    return {
      init: init
    }
  })();

  gitRepoSearch.init();
})
