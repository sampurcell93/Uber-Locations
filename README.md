Uber Locations
=============

A RESTful API for storing, viewing, deleting, and modifying favorite locations.

Hey Uber, thanks for giving me this assignment. It was a great exercise in programming, and I've already thought of some improvements I could make to my own workflow and style. 

About 
=====
As you can see, this is written in PHP and MySQL, and I'm using JSON for the data transfer protocol.

You can access the live application at http://sampurcell.net/UberLocations.

I did not use any frameworks, even lightweight solutions like Slim. REST is an interesting concept, and implementing the URI structure through .htaccess manipulation was a worthwhile, if trying, experience. In the future, I'd definitely use a framework.

An unfortunate pitfall I ran into was that NONE of backbone's database functions (save, sync, fetch, etc) worked for me... I got a variety of errors in the console. I implemented these functions with ajax queries, but I wish I could have gotten the native functions to work.

URL Structure: 
 ./locations/ to get a JSON object of all the user's locations
 ./location/#id/ to get a JSON object with the matching id

UI Tested in Chrome current, Safari current, and Firefox 17