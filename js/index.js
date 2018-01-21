// Allow users to see a condensed view with ng-repeat that will not show the preview or the small details
// Search bar
// Get the value from the user. Get the data. Push the obj into the array and sort it. 
// All, Online, Offline
// Mature Only
// Language select
// Refresh the streams every 5 minutes? Reload button as well.
var streamNames = ["Jerma985", "BabaYetu_", "Starladder5", "Resonance22", "TPangolin", "FreeCodeCamp", "VooblyOfficial"];
var app = angular.module('stream', []);

function compare(a, b) {
    if (a.followers < b.followers) return 1;
    if (a.followers > b.followers) return -1;
    return 0;
}


app.controller('streamController', function($scope) {
    $scope.Streams = [];
	$('#twitchSearch').submit(function(e) {
		e.preventDefault();
		var searchValue = $("#searchBar").val();
		console.log("Test"); 
		console.log(searchValue); 
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
                mature: data.stream.channel.mature,
                online: true,
                url: data.stream.channel.url,
                preview: data.stream.preview.large,
                title: data.stream.channel.status
            };
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
                        mature: data.mature,
                        online: false,
                        url: data.url,
                        preview: data.video_banner,
                        title: data.status
                    }
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