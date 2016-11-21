# exif_keywords_generator
Generate keywords using Computer Vison API from Clarifai.com. Use exiftool for update metadata.

## How to use
1. Install last stable version of [NodeJS](https://nodejs.org) and npm.
2. Enter folder with exif_keywords_generator and install dependencies by command.

```
$ npm install
```
3. If you use Windows.
```
$ npm install --global --production windows-build-tools
```
4. Register on [clarifai.com](https://clarifai.com) and get ClientId and Secret from profile.
5. Open index.js in any text editor and enter change config params.
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
6. We are good to go.
```
$ node --harmony index.js
```