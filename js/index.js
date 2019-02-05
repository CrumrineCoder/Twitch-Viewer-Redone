// The initial streams shown to the user.
var streamNames = ["FreeCodeCamp", "BobRoss"];
// The set up of Angular
var app = angular.module('stream', []);
// This variable keeps track of which streams we're showing the user. By default we show them all streams. Other settings are 'online', and 'offline' which respectively limit the streams to those two
var display = 'all';

// A useful function for comparing the followers of streams so the streams are put in order.
function compare(a, b) {
    if (a.followers < b.followers) return 1;
    if (a.followers > b.followers) return -1;
    return 0;
}

// Checks if two streams are the same for the purpose of no doubling up on streamers.
function containsObject(obj, list) {
    for (var i = 0; i < list.length; i++) {
        if (list[i].name === obj.name) {
            return true;
        } else {}
    }
    return false;
}

// Limit the streams shown to only online streams
function onlineOnly() {
    $('.online').show();
    $('.offline').hide();
    $('#onlineButton').addClass('active');
    $('#offlineButton').removeClass('active');
    $('#allButton').removeClass('active');
    display = 'online';
}
// Limit the streams shown to only offline streams
function offlineOnly() {
    $('.offline').show();
    $('.online').hide();
    $('#onlineButton').removeClass('active');
    $('#offlineButton').addClass('active');
    $('#allButton').removeClass('active');
    display = 'offline';
}
// No limits on the streams
function showAll() {
    $('.online').show();
    $('.offline').show();
    $('#onlineButton').removeClass('active');
    $('#offlineButton').removeClass('active');
    $('#allButton').addClass('active');
    display = 'all';
}
// Our angular controller. 
app.controller('streamController', function($scope) {
	// The streams to be shown tot he user
    $scope.Streams = [];
	// This variable determines if we are condensing the stream previews as they are quite large but I find them useful. 
    $scope.Condensed = false;
    // Change streanNames to those of the current Streamers and run through the entire process again to renew the data. 
    $scope.refresh = function() {
        streamNames = [];
        for (var i = 0; i < $scope.Streams.length; i++) {
            streamNames.push($scope.Streams[i].name);
        }
        $scope.Streams = [];
        getStreamData();
    }
	// On submission of the search form, add the streamer if found. 
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
	// Remove a streamer from the list. 
    $scope.remove = function(item) {
        var index = $scope.Streams.indexOf(item);
        $scope.Streams.splice(index, 1);
    }
	// We get the initial data from the official Twitch API
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
	// get the initial data
	 getStreamData();
	 // Organize the data into objects.
    function displayStreams(name, data) {
		// If they are currently streaming
        if (data.stream) {
			// Create an object of the data.
            var obj = {
                game: data.stream.game,
                viewers: data.stream.viewers,
                language: data.stream.channel.broadcaster_language,
                name: data.stream.channel.display_name,
                followers: data.stream.channel.followers,
                logo: data.stream.channel.logo,
                mature: data.stream.channel.mature,
                status: "online",
                url: data.stream.channel.url,
                preview: data.stream.preview.large,
                title: data.stream.channel.status
            };
			// If the stream hasn't already been put into the Streams array
            if (!containsObject(obj, $scope.Streams)) {
				// Add the obj to the streams array and resort it
                $scope.$apply(function() {
                    $scope.Streams.push(obj);
                    $scope.Streams.sort(compare);
                });
				// If the current display is set to offline, then we tell the user why the stream isn't going to show up
                if (display == 'offline') {
                    alert("Stream added, but only are showing Offline streams so it is not currently visible");
                    offlineOnly();
                }
			// Tell the user the stream is already added
            } else {
                alert("Stream is already added.");
            }
		// If the streamer isn't streaming. We do this because the Official Twitch API doesn't give that much data on offline streams, but the other API doesn't give as much on online streams so I have to use both. 
        } else {
            alert("Stream is offline, sorry!");
        //    getOfflineStreamData(name);
        }
    }
   
	// Get the data for offline streams. 
    function getOfflineStreamData(name) {
        $.ajax({
            type: "GET",
            url: "https://wind-bow.glitch.me/twitch-api/channels/" + name,
            success: function(data) {
				// If the streamer is found
                if (data.status != "404") {
					// Organize an object to be put into the Streams array
                    var obj = {
                        game: data.game,
                        language: data.broadcaster_language,
                        name: data.display_name,
                        followers: data.followers,
                        logo: data.logo,
                        mature: data.mature,
                        status: "offline",
                        url: data.url,
                        preview: data.video_banner,
                        title: data.status
                    }
					// If the object isn't already in the Streams array.
                    if (!containsObject(obj, $scope.Streams)) {
						// Add the object to the Streams array and resort it
                        $scope.$apply(function() {
                            $scope.Streams.push(obj);
                            $scope.Streams.sort(compare);
                        });
						// If the display is set to only show online streams, then tell the user why their stream isn't showing up
                        if (display == 'online') {
                            alert("Stream added, but only are showing Online streams so it is not currently visible");
                            onlineOnly();
                        }
						// If the object IS already in the Streams Array, tell the user. 
                    } else {
                        alert("Stream is already added.");
                    }
				// Tell the user the streamer isn't found if we can't find it with either API
                } else {
                    alert("Streamer not found. Search again.");
                }
            }
        });
    }

  
});