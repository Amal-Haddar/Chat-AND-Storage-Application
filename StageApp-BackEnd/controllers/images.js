const cloudinary = require('cloudinary')
const HttpStatus = require('http-status-codes')

const User = require('../models/userModels')

cloudinary.config({
    cloud_name:'dxlpuufpr',
    api_key: '142142121694942',
    api_secret: 'd4RY_yXCxqqij3G3KHXbSMjg7oA',
})


module.exports = {
    UploadImage(req, res){
        // console.log(req.body);
        cloudinary.uploader.upload(req.body.image, async(result) => {
        

            await User.update({
                _id: req.user._id
            }, 
            {
                $push:{
                    images: {
                        imgId: result.public_id,
                        imgVersion: result.version
                    }
                }
            }
        )

        
            .then(() => res.status(HttpStatus.OK).json({message: 'Image Uploaded Successfully'}))
            .catch( err => res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: "Error uploading image"}))
        });
     },

     async SetDefaultImage(req, res) {
         const {imgId, imgVersion} = req.params;

         await User.update({
            _id: req.user._id
        }, 
        {
            picId: imgId,
            picVersion: imgVersion
        }
    )

        .then(() => res.status(HttpStatus.OK).json({message: 'Default image set'}))
        .catch( err => res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: "Error occured"}))
    
     }
};