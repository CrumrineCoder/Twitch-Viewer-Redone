# Twitch.Tv Viewer

This is a front end project built as part of FreeCodeCamp's cirriculum. The website initially shows the user a few streams with information such as the name of the streamer, how many people are watching if they're online, how many followers they're in, what language it is, the title, what game they're playing, if the stream is for mature audiences only, and a preview of the stream. The website shows different information for online and offline streamers.The user can use buttons to only see Online, only see Offline, or see both streams. The user can search for streams. The user can remove streams. The user can refresh streams while saving the streams they've added. There is also a toggle preview button if people find the previews annoying.

This was built as part of FreeCodeCamp's frontend curriculum. I revisited this project and am incredibly proud how much I've grown since I made this. I decided to display the data with Angular this time and this was the first time I've used a one page design with Angular, which meant I had to be sending data back and forth. This was the main struggle with this project but the rest which would've taken me weeks to do now took me only two days.

## User Stories

### FreeCodeCamp

* User Story: I can see whether Free Code Camp is currently streaming on Twitch.tv.
* User Story: I can click the status output and be sent directly to the Free Code Camp's Twitch.tv channel.
* User Story: if a Twitch user is currently streaming, I can see additional details about what they are streaming.

### Personal User Stories

* User Story: I can tell whether the streamer is online and offline by pure colours alone. 
* User Story: I can search for streams and have them added. 
* User Story: I can refresh the streams without losing the streams I've added. 
* User Story: I can choose to only see online, offline, or all streams. 
* User Story: The information I can see is: the name of the streamer; the game they're playing, the title of the stream, and how many viewers if they're online. If they're offline, I can stll see the last played game and the title of the stream; the amount of followers, the language, and whether it's for mature audiences only; and a preview of the stream which I can choose not to see if I don't want to. 

## Built With

* [Twitch.tv API](https://dev.twitch.tv/) - The api used to get information of the stream initially. 
* [Secondary Twitch.tv API](https://wind-bow.glitch.me/) - The api used to get information of offline streams. 
* [Angular](https://angularjs.org/) - Used to display data.
* [jQuery](https://jquery.com/) - Used to change HTML classes and other little things  that I didn't need to rewrite functions for. 
* [FontAwesome] (https://fontawesome.com/) - Used for various icons. Love these guys. 

##  Authors

* **Nicolas Crumrine** - *EVERYTHING* - [CrumrineCoder](https://github.com/CrumrineCoder)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* r/freecodecamp for reviewing my project and giving suggestions. I also looked at other Twitch.tv apps on the subreddit for ideas after making my own design. 
