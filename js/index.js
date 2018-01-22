// Allow users to see a condensed view with ng-repeat that will not show the preview or the small details
// Remove button
// All, Online, Offline
// Mature Only
// Language select
// Refresh the streams every 5 minutes? Reload button as well.
var streamNames = ["FreeCodeCamp", "Jerma985", "DDRJake", "handmade_hero"];
var app = angular.module('stream', ['ngMaterial']);

function compare(a, b) {
    if (a.followers < b.followers) return 1;
    if (a.followers > b.followers) return -1;
    return 0;
}
app.controller('streamController', function($scope) {
    $scope.Streams = [];
    $scope.filter = {};
    $scope.categories = ['status'];

        $scope.addProps = function(obj, array) {
            console.log('addProps');
            console.log(obj);
            console.log(array);
            if (typeof array === 'undefined') {
                return false;
            }
            return array.reduce(function(prev, item) {
                if (typeof item[obj] === 'undefined') {
                    return prev;
                }
                return prev + parseFloat(item[obj]);
            }, 0);
        }
        $scope.getItems = function(obj, array) {
            console.log("getItems");
            console.log(obj);
            console.log(array);
            return (array || []).map(function(w) {
                return w[obj];
            }).filter(function(w, idx, arr) {
                if (typeof w === 'undefined') {
                    return false;
                }
                return arr.indexOf(w) === idx;
            });
        };
        // matching with AND operator
        $scope.filterByPropertiesMatchingAND = function(data) {
            console.log("filterByPropertiesAnd");
            console.log(data);
            var matchesAND = true;
            for (var obj in $scope.filter) {
                if ($scope.filter.hasOwnProperty(obj)) {
                    if (noSubFilter($scope.filter[obj])) continue;
                    if (!$scope.filter[obj][data[obj]]) {
                        matchesAND = false;
                        break;
                    }
                }
            }
            return matchesAND;
        };
        // matching with OR operator
        $scope.filterByPropertiesMatchingOR = function(data) {
            console.log("filterByPropertiesOr");
            console.log(data);
            var matchesOR = true;
            for (var obj in $scope.filter) {
                if ($scope.filter.hasOwnProperty(obj)) {
                    if (noSubFilter($scope.filter[obj])) continue;
                    if (!$scope.filter[obj][data[obj]]) {
                        matchesOR = false;
                    } else {
                        matchesOR = true;
                        break;
                    }
                }
            }
            return matchesOR;
        };

        function noSubFilter(obj) {
            console.log("noSubFilter");
            console.log(obj);
            for (var key in obj) {
                if (obj[key]) return false;
            }
            return true;
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
                    };
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