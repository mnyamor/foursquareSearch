# foursquareSearch
Web application that integrates with the Foursquare API and allows you to search for a place by name and return the recommended or popular venues near that location.
This project uses Ionic library and AngularJS.

## Running the project

```bash
$ npm install -g ionic
```
Then run: 

```bash
$ ionic serve
```

```bash
$ sudo npm install -g ionic cordova
$ git clone https://github.com/mnyamor/foursquareSearch.git  
```

Then, to run it, cd into `foursquareSearch/app ` and run:

```bash
$ ionic platform add ios
$ ionic build ios
$ ionic emulate ios
```

In case of browser 

```bash
$ ionic platform add browser
$ ionic build browser
$ ionic run browser
```

Substitute ios for android if not on a Mac, but if you can, the ios development toolchain is a lot easier to work with.
