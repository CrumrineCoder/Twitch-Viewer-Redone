// Refresh the streams every 5 minutes? Reload button as well.
var streamNames = ["Jerma985", "BabaYetu_", "TrumpSC"];
var app = angular.module('stream', []);
var display = 'all';

function compare(a, b) {
    if (a.followers < b.followers) return 1;
    if (a.followers > b.followers) return -1;
    return 0;
}

function containsObject(obj, list) {
    for (var i = 0; i < list.length; i++) {
        if (list[i].name === obj.name) {
            return true;
        } else {}
    }
    return false;
}

function onlineOnly() {
    $('.online').show();
    $('.offline').hide();
	$('#onlineButton').addClass('active');
    $('#offlineButton').removeClass('active');
	$('#allButton').removeClass('active');
    display = 'online';
}

function offlineOnly() {
    $('.offline').show();
    $('.online').hide();
	$('#onlineButton').removeClass('active');
    $('#offlineButton').addClass('active');
	$('#allButton').removeClass('active');
    display = 'offline';
}

function showAll() {
    $('.online').show();
    $('.offline').show();
    $('#onlineButton').removeClass('active');
    $('#offlineButton').removeClass('active');
	$('#allButton').addClass('active');
	display = 'all';
}


app.controller('streamController', function($scope) {
    $scope.Streams = [];
	$scope.Condensed = false; 
	
	// change streamNames to the streams names in $scope.Streams and redo everything
	
	$scope.refresh = function(){
		console.log("hey"); 
		console.log(streamNames); 
		streamNames = [];
		
		for(var i=0; i<$scope.Streams.length; i++){
			streamNames.push($scope.Streams[i].name);
		}
		console.log(streamNames)
		$scope.Streams = [];
		getStreamData();
	}
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
	$scope.remove = function(item) { 
		var index = $scope.Streams.indexOf(item);
		$scope.Streams.splice(index, 1);     
	}
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
                status: "online",
                url: data.stream.channel.url,
                preview: data.stream.preview.large,
                title: data.stream.channel.status
            };
            if (!containsObject(obj, $scope.Streams)) {
                $scope.$apply(function() {
                    $scope.Streams.push(obj);
                    $scope.Streams.sort(compare);
                });
                if (display == 'offline') {
                    alert("Stream added, but only are showing Offline streams so it is not currently visible");
                    offlineOnly();
                }
            } else {
               alert("Stream is already added.");
            }
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
                        status: "offline",
                        url: data.url,
                        preview: data.video_banner,
                        title: data.status
                    }
                    if (!containsObject(obj, $scope.Streams)) {
                        $scope.$apply(function() {
                            $scope.Streams.push(obj);
                            $scope.Streams.sort(compare);
                        });
                        if (display == 'online') {
                            alert("Stream added, but only are showing Online streams so it is not currently visible");
                            onlineOnly();
                        }
                    } else {
                       alert("Stream is already added.");
                    }
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