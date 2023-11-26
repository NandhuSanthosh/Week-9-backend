const cloudinary = require('cloudinary')

cloudinary.config({ 
  cloud_name: 'dh1e66m8m', 
  api_key: '447619434375244', 
  api_secret: 'RdO-7Y-icKhU5_zvfj7Agsvvjpc' 
});

module.exports.uploadImage = async(tempFilePath) => {
    const result = await cloudinary.v2.uploader
    .upload( tempFilePath ,{
      resource_type: 'auto', 
    })
    console.log(result.secure_url)
    return result;
}