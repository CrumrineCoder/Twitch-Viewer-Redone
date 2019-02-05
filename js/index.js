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
        if (list[i].user === obj) {
            return true;
        } else { }
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
app.controller('streamController', function ($scope) {
    // The streams to be shown tot he user
    $scope.Streams = [];
    // This variable determines if we are condensing the stream previews as they are quite large but I find them useful. 
    $scope.Condensed = false;
    // Change streanNames to those of the current Streamers and run through the entire process again to renew the data. 
    $scope.refresh = function () {
        streamNames = [];
        //   console.log($scope.Streams);
        for (var i = 0; i < $scope.Streams.length; i++) {
            streamNames.push({ user: $scope.Streams[i].user, status: $scope.Streams[i].status });
        }
        console.log($scope.Streams);
        console.log(streamNames);
        //  $scope.Streams = [];
        //  getStreamData();
        function update(obj) {
            console.log(obj);
            var result = $scope.Streams.filter(object => {
                return object.user_id === obj.user_id
            });
            var index = $scope.Streams.indexOf(result);
            result[0].game = obj.game;
            result[0].viewers = obj.viewers;
            result[0].preview = obj.preview;
            result[0].title = obj.title;
            console.log(result);
            if (index !== -1) {
                $scope.$apply(function () {
                    $scope.Streams[index] = result[0];
                });
            }
        }

        for (var i = 0; i < streamNames.length; i++) {
            if (streamNames[i].status == "online") {
                $.ajax({
                    type: "GET",
                    url: 'https://api.twitch.tv/helix/streams?user_login=' + streamNames[i].user,
                    headers: {
                        "Client-ID": "qq6g00bkkiultjwkvpkewm5mkr44ock"
                    },
                    success: function (data) {
                        console.log(data);
                        if (data.data.length > 0) {
                            var obj = {
                                game: data.data[0].game_id,
                                viewers: data.data[0].viewer_count,
                                user_id: data.data[0].user_id,
                                preview: data.data[0].thumbnail_url,
                                title: data.data[0].title
                            }
                            update(obj);
                        }
                    }/* function (data) {
                        console.log($scope.Streams);
                        console.log(i);
                        var temp = $scope.Streams[i];
                        console.log(temp); */
                    /*
                         
                                    };
                    
                                    var temp = obj.preview.replace("{width}x{height}", "1920x1080")
                                    obj.preview = temp;
                                            if (data.data.length < 1) {
                                                if (containsObject(storage.display_name, $scope.Streams)) {
                                                    alert("Stream is already shown.")
                                                } else {
                                                    //   alert("Stream is offline");
                                                    var obj = {
                                                        desc: storage.description,
                                                        user: storage.id,
                                                        status: "offline",
                                                        profile: storage.profile_image_url,
                                                        offline: storage.offline_image_url,
                                                        views: storage.view_count
                                                    }
                            
                                                    var temp = obj.profile.replace("{width}x{height}", "1920x1080")
                                                    obj.profile = temp;
                            
                                                    getFollowers(obj);
                                                }
                                            } else {
                                                if (containsObject(data.data[0].user_name, $scope.Streams)) {
                                                    alert("Stream is already shown.")
                                                } else {
                                                    //    alert("Stream is online");
                                                    displayInitialStreams(data.data);
                                                }
                                            } */
                    //    displayStreams(searchValue, data);
                    //   },
                    ,
                    error: function (data) {
                        alert("Stream doesn't exist, sorry!")
                    }
                });
            }
            /*    $.ajax({
                    type: "GET",
                    url: 'https://api.twitch.tv/helix/users?login=' + streamNames[i].user,
                    headers: {
                        "Client-ID": "qq6g00bkkiultjwkvpkewm5mkr44ock"
                    },
                    success: function (data) {
                        console.log(data);
                        if (data.data.length < 1) {
                            alert("Streamer doesn't exist, sorry!")
                        } else {
                            displayStreams(streamNames[i], data);
                        }
                    },
                    error: function (data) {
                        alert("Stream doesn't exist, sorry!")
                    }
                }); */
        }
    }
    // On submission of the search form, add the streamer if found. 
    $('#twitchSearch').submit(function (e) {
        e.preventDefault();
        var searchValue = $("#searchBar").val();
        $.ajax({
            type: "GET",
            url: 'https://api.twitch.tv/helix/users?login=' + searchValue,
            headers: {
                "Client-ID": "qq6g00bkkiultjwkvpkewm5mkr44ock"
            },
            success: function (data) {
                if (data.data.length < 1) {
                    alert("Streamer doesn't exist, sorry!")
                } else {
                    displayStreams(searchValue, data);
                }
            },
            error: function (data) {
                alert("Stream doesn't exist, sorry!")
            }
        });
    });
    // Remove a streamer from the list. 
    $scope.remove = function (item) {
        var index = $scope.Streams.indexOf(item);
        $scope.Streams.splice(index, 1);
    }
    // We get the initial data from the official Twitch API
    function getStreamData() {
        /*     streamNames.forEach(function(data, i) {
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
             }); */
        //url: 'https://api.twitch.tv/helix/streams?first=20&game_id=509660',
        $.ajax({
            type: "GET",
            url: 'https://api.twitch.tv/helix/streams?first=3&game_id=509660',
            headers: {
                "Client-ID": "qq6g00bkkiultjwkvpkewm5mkr44ock"
            },
            success: function (data) {
                displayInitialStreams(data.data);
            }
        });

    }

    function getGameName(obj, callback) {
        $.ajax({
            type: "GET",
            url: 'https://api.twitch.tv/helix/games?id=' + obj.game,
            headers: {
                "Client-ID": "qq6g00bkkiultjwkvpkewm5mkr44ock"
            },
            success: function (data) {
                obj.game = data.data[0].name;
                getFollowers(obj);
            }
        });
    }

    function getFollowers(obj) {
        $.ajax({
            type: "GET",
            url: 'https://api.twitch.tv/helix/users/follows?to_id=' + obj.user_id,
            headers: {
                "Client-ID": "qq6g00bkkiultjwkvpkewm5mkr44ock"
            },
            success: function (data) {
                obj.followers = data.total;
                getUserData(obj);
            }
        });
    }

    function getUserData(obj, callback) {
        $.ajax({
            type: "GET",
            url: 'https://api.twitch.tv/helix/users?id=' + obj.user_id,
            headers: {
                "Client-ID": "qq6g00bkkiultjwkvpkewm5mkr44ock"
            },
            success: function (data) {
                obj.user = data.data[0].display_name;
                obj.profile = data.data[0].profile_image_url;
                obj.offline = data.data[0].offline_image_url;
                obj.stream = "https://www.twitch.tv/" + data.data[0].display_name;

                var temp = obj.profile.replace("{width}x{height}", "1920x1080")
                obj.profile = temp;

                apply(obj);
            }
        });
    }

    function apply(obj) {
        $scope.$apply(function () {
            $scope.Streams.push(obj);
            $scope.Streams.sort(compare);
        });
    }

    function displayInitialStreams(data) {
        if (data) {
            for (var i = 0; i < data.length; i++) {
                var obj = {
                    game: data[i].game_id,
                    viewers: data[i].viewer_count,
                    language: data[i].language,
                    user_id: data[i].user_id,
                    status: "online",
                    preview: data[i].thumbnail_url,
                    title: data[i].title
                };

                var temp = obj.preview.replace("{width}x{height}", "1920x1080")
                obj.preview = temp;

                getGameName(obj);
            }
        }
    }

    // get the initial data
    getStreamData();
    // Organize the data into objects.
    function displayStreams(name, data) {
        var storage = data.data[0];
        // If they are currently streaming

        $.ajax({
            type: "GET",
            url: 'https://api.twitch.tv/helix/streams?user_id=' + storage.id,
            headers: {
                "Client-ID": "qq6g00bkkiultjwkvpkewm5mkr44ock"
            },
            success: function (data) {
                if (data.data.length < 1) {
                    if (containsObject(storage.display_name, $scope.Streams)) {
                        alert("Stream is already shown.")
                    } else {
                        //   alert("Stream is offline");
                        var obj = {
                            desc: storage.description,
                            user: storage.id,
                            status: "offline",
                            profile: storage.profile_image_url,
                            offline: storage.offline_image_url,
                            views: storage.view_count
                        }

                        var temp = obj.profile.replace("{width}x{height}", "1920x1080")
                        obj.profile = temp;

                        getFollowers(obj);
                    }
                } else {
                    if (containsObject(data.data[0].user_name, $scope.Streams)) {
                        alert("Stream is already shown.")
                    } else {
                        //    alert("Stream is online");
                        displayInitialStreams(data.data);
                    }
                }
                //    displayStreams(searchValue, data);
            },
            error: function (data) {
                alert("Stream doesn't exist, sorry!")
            }
        });
        // Create an object of the data.
        /*      var obj = {
                  game: data.stream.game,
                  viewers: data.stream.viewers,
                  language: data.stream.channel.broadcaster_language,
                  user: data.stream.channel.display_name,
                  followers: data.stream.channel.followers,
                  profile: data.stream.channel.logo,
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
                  console.log(obj);
                  console.log( $scope.Streams);
                  console.log(containsObject(obj, $scope.Streams));
                  alert("Stream is already added.");
              }*/
        // If the streamer isn't streaming. We do this because the Official Twitch API doesn't give that much data on offline streams, but the other API doesn't give as much on online streams so I have to use both. 
    }

    // Get the data for offline streams. 
    function getOfflineStreamData(name) {
        $.ajax({
            type: "GET",
            url: "https://wind-bow.glitch.me/twitch-api/channels/" + name,
            success: function (data) {
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
                        $scope.$apply(function () {
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