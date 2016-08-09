# Foursquare Search
Web application that integrates with the Foursquare API and allows you to search for a place by name and return the recommended or popular venues near the searched location.
This project uses Ionic library and AngularJS. 

## Running the project

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
$ ionic run browser
```

## Running gulp tasks

  ```bash
$ gulp
```

Running ionic serve inside app will run the app in browser -- uses livereload.



