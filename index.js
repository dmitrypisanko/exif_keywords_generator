'use strict'

//npm install --global --production windows-build-tools

const Clarifai = require('clarifai'),
    fs = require('fs'),
    _ = require('lodash'),
    sharp = require("sharp"),
    shell = require("shelljs"),

    config = {
        clarifaiClientId: '', 
        clarifaiSecret: '', 
        imagesDir: 'files',
        resizedImageWidth: 1000,
        resizedImageQuality: 100,
        minimumPredictPercent: 0.5
    },

    predictModels = [
        Clarifai.GENERAL_MODEL,
        Clarifai.TRAVEL_MODEL,
        Clarifai.WEDDINGS_MODEL,
        Clarifai.COLOR_MODEL,
        //Clarifai.FOOD_MODEL
    ]

const app = new Clarifai.App(config.clarifaiClientId, config.clarifaiSecret)

let main = async function() {
    try {
        //Detect os and prepare files list and path to exiftool
        let os = require('os').platform()
        let exiftool
        let files

        if ( os === 'win32' ) {
            exiftool = "exiftool\\exiftool.exe"
            files = shell.exec(`dir /s /b ${config.imagesDir}\\*.jpg`, {silent: true}).stdout.trim().split("\n")
        } else {
            exiftool = './exiftool/exiftool'
            files = shell.exec(`find ${config.imagesDir} -name '*.jpg'`, {silent: true}).stdout.trim().split("\n")
        }

        for( let file of files ) {
            file = file.trim()
            let tags = {}

            //Get EXIF data from file
            let info = {}
            let out = shell.exec(`${exiftool} ${file}`, {silent: true}).stdout.trim().split("\n")

            for( let line of out ) {
                let parts = line.split(":")

                if ( parts.length === 2 ) {
                    info[parts[0].trim()] = parts[1].trim()
                }
            }

            //If title and description exists, create keywords from them. Use only words with length >= 4 characters
            if ( info.Title || info.Description ) {
                let description = (info['Title'] || ' ') + ' ' + (info.Description || ' ')

                description.trim().replace(/\W+/g, ' ').split(" ").forEach( item => {
                    if ( item.length >= 4 ) {
                        tags[item.toLowerCase()] = 1;
                    }
                })
            }

            //Create resized copy of image
            let img = (await sharp(file).resize(config.resizedImageWidth).quality(config.resizedImageQuality).toBuffer()).toString('base64')

            //Get keywords for each model
            for( let model of predictModels ) {
                let res = await app.models.predict(model, img)
                let data = _.get(res, "data.outputs[0].data.concepts", [])

                for( let item of data ) {
                    if ( parseFloat(item.value) > config.minimumPredictPercent && item.name ) {
                        tags[item.name.toLowerCase()] = item.value
                    }
                }
            }

            //save keywords to file
            let cmd = exiftool + ' -m -overwrite_original_in_place -Keywords="' + Object.keys(tags).join(";") + '" "' + file + '"'
            console.log(file, shell.exec(cmd, {silent: true}).stdout.trim())
        }
    } catch (err) {
        console.log('Fatal Error. Something Went Terribly Wrong')
        console.log(err)
    }
}

main()