# exif_keywords_generator
Generate keywords using Computer Vison API from Clarifai.com. Use exiftool for update metadata.

## How to use
##### Install last stable version of [NodeJS](https://nodejs.org) and npm.
##### Enter folder with exif_keywords. Use bash in Linux, Terminal in MacOs and cmd.exe in Windows
```
$ npm install
```
##### If you use Windows. This can take a while
```
$ npm install --global --production windows-build-tools
```
##### Register on [clarifai.com](https://clarifai.com) and get ClientId and Secret from profile.

##### Open index.js in any text editor and enter change config params.
```
config = {
    clarifaiClientId: '',
    clarifaiSecret: '',
    imagesDir: 'files',
    resizedImageWidth: 1000,
    resizedImageQuality: 100,
    minimumPredictPercent: 0.5
}
```
##### We are good to go.
```
$ node --harmony index.js
```