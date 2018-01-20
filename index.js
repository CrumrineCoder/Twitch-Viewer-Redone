// Array of default streamers
// Call to each streamer, and if they're offline make a call to the freecodecamp api.
// Add each stream to an anchor point
var streams = ["Starladder5", "Resonance22", "FreeCodeCamp"];

function displayStreams(name, data) {
  if (data.stream) {
    console.log(name + " is online");
  } else {
    getOfflineStreamData(name);
    console.log(name + " is offline");
  }
}
getStreamData();
function getOfflineStreamData(name) {
  $.ajax({
    type: "GET",
    url: "https://wind-bow.glitch.me/twitch-api/channels/" + name,
    success: function(data) {
      console.log(name);
      console.log(data);
    }
  });
}

function getStreamData() {
  streams.forEach(function(data, i) {
    $.ajax({
      type: "GET",
      url: 'https://api.twitch.tv/kraken/streams/' + streams[i],
      headers: {
        "Client-ID": "qq6g00bkkiultjwkvpkewm5mkr44ock"
      },
      success: function(data) {
        // Turn on and Off streams that are English only
        /*        document.getElementById('english').onclick = function() {
                    if (data.stream && !$("#'" + i + "'").hasClass("test")) $(".:not(.en)").toggle();
                }; */
        // Sort the new stream
        console.log(streams[i]);
        console.log(data);
        displayStreams(streams[i], data);
        /*        $(".remove-link").click(function(e) {
					console.log("Visionary"); 
                    e.preventDefault();
                    $(this).closest(".box").remove();
                }); */
        // Toggle the English Only Text
        /*        document.getElementById('english').onclick = function() {
                    if (document.getElementById("english").textContent == "English Only: No") {
                        $(".online").not(".en").fadeOut(300);
                        document.getElementById("english").textContent = "English Only: Yes";
                    } else if (document.getElementById("english").textContent == "English Only: Yes") {
                        $(".online").not(".en").fadeIn(300);
                        document.getElementById("english").textContent = "English Only: No";
                    }
                } */
        // Toggle the Mature Streams
        /*   document.getElementById('mature').onclick = function() {
                    if (document.getElementById("mature").textContent == "Mature Only: No") {
                        $(".false").fadeOut(300);
                        document.getElementById("mature").textContent = "Mature Only: Yes";
                    } else if (document.getElementById("mature").textContent == "Mature Only: Yes") {
                        $(".false").fadeIn(300);
                        document.getElementById("mature").textContent = "Mature Only: No";
                    }
                } */
      }
    });
  });
}
