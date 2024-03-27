const admin = require('firebase-admin');

const { URL } = require('url');

function getFileNameFromUrl(fileUrl) {
  const parsedUrl = new URL(fileUrl);
  const pathname = parsedUrl.pathname;
  // Extract filename from the pathname
  const filename = pathname.substring(pathname.lastIndexOf('/') + 1);
  return filename;
}

async function uploadFiles(req, res) {
  try {
    if (!req.files || req.files.length === 0) {
      return;
    }

    const bucket = admin.storage().bucket();

    const uploadPromises = req.files.map(async (file) => {
      const currentDate = new Date();
      const fileName = `${currentDate.getTime()}-${file.originalname
        .split(' ')
        .join('_')}`;
      const fileUpload = bucket.file(fileName);

      // Upload each file to Firebase Storage
      await fileUpload.save(file.buffer, {
        metadata: {
          contentType: file.mimetype,
        },
      });
      //expire after one year
      const aYearFromNow = new Date();
      aYearFromNow.setFullYear(aYearFromNow.getFullYear() + 1);

      // Generate download URL for the uploaded file
      const [url] = await fileUpload.getSignedUrl({
        action: 'read',
        expires: aYearFromNow,
      });

      return url;
    });

    const urls = await Promise.all(uploadPromises);
    return urls;
  } catch (error) {
    console.error('Error uploading files:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function deleteFile(fileUrl) {
  const fileName = getFileNameFromUrl(fileUrl);
  try {
    const bucket = await admin.storage().bucket();
    await bucket.file(fileName).delete();
  } catch (error) {
    throw new Error(`Failed to delete file ${fileName}: ${error.message}`);
  }
}

module.exports = {
  uploadFiles,
  deleteFile,
};
