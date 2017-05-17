

Here are two setups I use for my new React projects: 


I use node 7 currently. If you're not already using Node Version Manager, start :) 


### Front-end bundling: 

I'm using Gulp for now. Webpack is common and fine too, I just liked Gulp's flexibility and that everything is in one file (webpack always seems to separate config into dev/prod files). 

`gulp` - development, builds the frontend javascript files from a directory (all of the individual files) and watches for changes, rebuilding when necessary, does NOT minify output 

`gulp build` - production, builds the JS files from a directory and minifies/uglifies them (make them small for production). It also uses React's minified build (the NODE_ENV variable has to be set to 'production'). 

I also have a commented-out part in the gulpfile that you could use for building multiple javascript files at once. 

#### LiveReload 

You want your browser to automatically refresh when changes are made. I'm just using the LiveReload extension for Chrome at the moment (the gulpfile starts the livereload server and the extension connects to it and listens for changes). 


### Server-side express.js server: 

Look into the package.json file for the "scripts". Run them with `npm run scriptname` 

`start` - for development. nodemon watches for changes and restarts the server when necessary. It also uses "babel-node" to do the bundling.  

`build` - for production, builds the server javascript bundle and puts it into /dist directory 

`serve` - for production, runs the now-bundled server javascript 


### Other notes: 

If you're using Sublime Text, get the Babel package for syntax highlighting. 

Note: commenting sucks in files that have javascript and jsx mixed (use {/* ... */} for JSX comments) 