$(document).ready(function(){
  var gitRepoSearch = (function(){
    //retrieve elements
    var $repoContainer = $('.repoResults');
    var $searchBtn = $('.addon-custom');
    var $searchField = $('.searchField');
    var $repoDetails = $('.repoDetails');

    function init(){
      $searchBtn.on('click', runSearch)
    }

    function runSearch(){
      var repoName = $searchField.val();

      //check if user keyed values into input box
      if(repoName && !repoName.match(/^\s.*/)){

        $.ajax({
          type: "GET",
          url: "https://api.github.com/search/repositories",
          data: { q: repoName }
         }).done(function(data){
           data.items.forEach(function(repo){
             var repoObj = {};
             repoObj.name = repo.full_name;
             repoObj.language =  repo.language;
             repoObj.url = repo.html_url;

             //create new user block
             var newUserBlock = $('<div>', { class: "user-block" });
             newUserBlock.text(repo.full_name);
             newUserBlock.on('click', { repoDetails : repoObj }, retrieveGitDetails)
             $repoContainer.append(newUserBlock);
           })
         })


      } else {
        $repoDetails.text("No repository selected");
      }
    }

    function retrieveGitDetails(event){
      var repoDetails = event.data.repoDetails;

      var header = $('<h1>').text(repoDetails.name);
      $repoDetails.html(header)
      console.log(event.data.repoDetails);
    }
    return {
      init: init
    }
  })();

  gitRepoSearch.init();
})
