// Allow users to see a condensed view with ng-repeat that will not show the preview or the small details
// Remove button
// All, Online, Offline
// Mature Only
// Language select
// Refresh the streams every 5 minutes? Reload button as well.
var streamNames = [ "FreeCodeCamp", "Jerma985", "DDRJake", "handmade_hero"];
var app = angular.module('stream', []);

function compare(a, b) {
    if (a.followers < b.followers) return 1;
    if (a.followers > b.followers) return -1;
    return 0;
}


app.controller('streamController', function($scope) {
    $scope.Streams = [];
	$scope.Filter = new Object();
  $scope.Filter.status = {
    "online": "online", 
    "offline": "offline"
  };
 $scope.OrderFilter = 'status';
	$('#twitchSearch').submit(function(e) {
		e.preventDefault();
		var searchValue = $("#searchBar").val();
		 $.ajax({
                type: "GET",
                url: 'https://api.twitch.tv/kraken/streams/' + searchValue,
                headers: {
                    "Client-ID": "qq6g00bkkiultjwkvpkewm5mkr44ock"
                },
                success: function(data) {
                    displayStreams(searchValue, data);
                }
         });
	});
    function displayStreams(name, data) {
        if (data.stream) {
            var obj = {
                game: data.stream.game,
                viewers: data.stream.viewers,
                language: data.stream.channel.broadcaster_language,
                name: data.stream.channel.display_name,
                followers: data.stream.channel.followers,
                logo: data.stream.channel.logo,
               
                status: "online",
                url: data.stream.channel.url,
                preview: data.stream.preview.large,
                title: data.stream.channel.status
            };
			console.log(obj);
            $scope.$apply(function() {
                $scope.Streams.push(obj);
                $scope.Streams.sort(compare);
            });
        } else {
            getOfflineStreamData(name);
        }
    }
    getStreamData();
	
    function getOfflineStreamData(name) {
        $.ajax({
            type: "GET",
            url: "https://wind-bow.glitch.me/twitch-api/channels/" + name,
            success: function(data) {
                if (data.status != "404") {
                    var obj = {
                        game: data.game,
                        language: data.broadcaster_language,
                        name: data.display_name,
                        followers: data.followers,
                        logo: data.logo,
                       
                        status: "offline",
                        url: data.url,
                        preview: data.video_banner,
                        title: data.status
                    }
					console.log(obj);
                    $scope.$apply(function() {
                        $scope.Streams.push(obj);
                        $scope.Streams.sort(compare);
                    });
                } else {
                    alert("Streamer not found. Search again.");
                }
            }
        });
    }

    function getStreamData() {
        streamNames.forEach(function(data, i) {
            $.ajax({
                type: "GET",
                url: 'https://api.twitch.tv/kraken/streams/' + streamNames[i],
                headers: {
                    "Client-ID": "qq6g00bkkiultjwkvpkewm5mkr44ock"
                },
                success: function(data) {
                    displayStreams(streamNames[i], data);
                }
            });
        });
    }
});

/*
app.filter('searchFilter', function($filter) {
  return function(items, searchfilter) {
    console.log("item");
console.log(items); 	
    var isSearchFilterEmpty = true;
	// Figure out if there's a filter
    angular.forEach(searchfilter, function(searchstring) {
      if (searchstring != null && searchstring != "") {
        isSearchFilterEmpty = false;
      }
    });
	// If there's a filter
    if (!isSearchFilterEmpty) {
	// The filtered streams
      var result = [];
	  // For each stream. items = all streams
      angular.forEach(items, function(item) {
        var isFound = false;
		// Go through each value in the Angular, eg. the logo, true, and the title of the streamer
		// item = current stream
        angular.forEach(item, function(term, key) {
          if (term != null && !isFound) {
            term = term.toString();
            term = term.toLowerCase();
			// Add the stream to the list of streams if it matches the filter
			// Term = current item, like twitch.tv/freecodecamp, freecodecamp, en. It's the value
			// Key = current item, like url, preview, title. It's the key, duh. 
            angular.forEach(searchfilter, function(searchstring) {
              if (searchstring != "" && term.indexOf(searchstring) != -1 && !isFound) {
                result.push(item);
                isFound = true;
				
              }
            });
          }
        });
      });
	 // If things are filtered
	  console.log(result); 
      return result;
	  // If things aren't filtered
    } else {
	  console.log("items");
	  console.log(items);
      return items;
    }
  }
}); */


// Global search filter
app.filter('searchFilter', function($filter) {
  return function(items, searchfilter) {
    var isSearchFilterEmpty = true;
    angular.forEach(searchfilter, function(searchstring) {
      if (searchstring != null && searchstring != "") {
        isSearchFilterEmpty = false;
      }
    });
    if (!isSearchFilterEmpty) {
      var result = [];
      angular.forEach(items, function(item) {
        var isFound = false;
        angular.forEach(item, function(term, key) {
          if (term != null && !isFound) {
            term = term.toString();
            term = term.toLowerCase();
            angular.forEach(searchfilter, function(searchstring) {
          
              searchstring = searchstring.toLowerCase();
              if (searchstring != "" && term.indexOf(searchstring) != -1 && !isFound) {
                result.push(item);
                isFound = true;
              }
            });
          }
        });
      });

      return result;
    } else {
      return items;
    }
  }
});
