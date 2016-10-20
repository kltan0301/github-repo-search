$(document).ready(function() {
      var gitRepoSearch = (function() {
          //retrieve elements
          var $matchedResults = $('.matched-results').find('ul');
          var $searchBtn = $('.addon-custom');
          var $searchField = $('.searchField');
          var $repoDetails = $('.repoDetails');
          var $paginationScroll = $('.pagination-scroll');

          var githubURL = "https://api.github.com/";

          function init() {
            // $searchBtn.on('click', runSearch);
            $searchBtn.on('click', runSearch);
          }

          function template(data) {
            var ulBlock = $('<ul>');
            $.each(data, function(index, item) {

              var repoObj = {};
              repoObj.user = item.owner.login;
              repoObj.name = item.full_name;
              repoObj.language = item.language || "none";
              repoObj.url = item.html_url;
              repoObj.description = item.description || "none";

              var userListItem = $('<li>');
              var newUserBlock = $('<div>', {
                class: "user-block"
              });
              var userRepoName = $('<div>', {
                class: "repo-description"
              }).html('<h2>' + item.full_name + '</h2>')
              var userRepoDetails = $('<div>', {
                class: "repo-details hide"
              })
              var arrow = $('<span>', {
                class: "glyphicon glyphicon-chevron-down right-arrow"
              })

              arrow.on('click', {
                repoDetails: repoObj
              }, retrieveGitDetails);

              userRepoName.append(userRepoDetails);
              newUserBlock.append(userRepoName).append(arrow);
              userListItem.append(newUserBlock);
              ulBlock.append(userListItem)
            });

            return ulBlock;
          }

          function runSearch() {
            var repoName = $searchField.val();
            //clear matched results container
            $matchedResults.html("<h1 class='center-align'>Loading from Github...</h1>");

            //check if user keyed values into input box
            if (repoName && !repoName.match(/^\s.*/)) {
              $.ajax({
                type: "GET",
                url: githubURL + "search/repositories",
                data: {
                  q: repoName
                }
              }).done(function(data) {
                  $paginationScroll.pagination({
                    dataSource: data,
                    pageSize: 10,
                    locator: 'items',
                    callback: function(data, pagination) {
                      // template method of yourself
                      var html = template(data);
                      $matchedResults.html(html);
                    }
                  })
                })
              }
            }
            
            function retrieveGitDetails(event) {
              var repoDetailContainer = $(this).siblings().find('.repo-details');
              //clear the repo details
              repoDetailContainer.html("").toggleClass('hide')
                //add all repo details
              var repoDetails = event.data.repoDetails;
              //   var header = $('<h1>').text("Repository Name: " + repoDetails.name);
              var language = $('<p>').text("Language: " + repoDetails.language);
              var description = $('<p>').text("Description: " + repoDetails.description);
              var url = $('<a>', {
                href: repoDetails.url
              }).text("Url: " + repoDetails.url)
              var user = repoDetails.user;
              //   //get followers
              $.ajax({
                type: "GET",
                url: githubURL + 'users/' + user + '/followers'
              }).done(function(data) {
                var followerStr = "";

                if (data.length > 0) {
                  data.forEach(function(follower) {
                    followerStr += follower.login + " | "
                  })
                } else {
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
