const fs = require("fs");
const upload = require("../../utlis/Image/multerConfig");
const { uploadToCloudinary } = require("../../middleware/Media/cloudinaryMiddleware");

const handleImageUploads = (fields = []) => {
  return (req, res, next) => {
    const uploadMultiple = upload.fields(fields);

    uploadMultiple(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ success: false, message: err.message });
      }

      try {
        const uploadedFiles = {};

        for (const field of fields) {
          const { name, folder, transformation } = field;

          if (req.files && req.files[name]) {
            uploadedFiles[name] = [];

            for (const file of req.files[name]) {
              const result = await uploadToCloudinary(file.path, folder, transformation);
              uploadedFiles[name].push({
                secure_url: result.secure_url,
                public_id: result.public_id,
              });

              // Delete local file
              fs.unlinkSync(file.path);
            }
          }
        }

        req.cloudinaryUploads = uploadedFiles;
        next();
      } catch (error) {
        return res.status(500).json({
          success: false,
          message: "Image upload to Cloudinary failed.",
        });
      }
    });
  };
};

module.exports = handleImageUploads;
