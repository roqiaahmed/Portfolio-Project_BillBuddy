const admin = require("firebase-admin");

const { URL } = require("url");

function getFileNameFromUrl(fileUrl) {
  const parsedUrl = new URL(fileUrl);
  const pathname = parsedUrl.pathname;
  // Extract filename from the pathname
  const filename = pathname.substring(pathname.lastIndexOf("/") + 1);
  return filename;
}

async function uploadFiles(req, res, folderPath) {
  try {
    if (!req.files || req.files.length === 0) {
      return;
    }

    const bucket = admin.storage().bucket();

    const uploadPromises = req.files.map(async (file) => {
      const filePath = `${folderPath}/${file.originalname}`; /////// add folder path
      const fileUpload = bucket.file(filePath);
      // const fileUpload = bucket.file(file.originalname);

      // Upload each file to Firebase Storage
      await fileUpload.save(file.buffer, {
        metadata: {
          contentType: file.mimetype,
        },
      });
      // Generate download URL for the uploaded file
      const [url] = await fileUpload.getSignedUrl({
        action: "read",
        expires: "01-01-2025",
      });

      return url;
    });

    const urls = await Promise.all(uploadPromises);
    return urls;
  } catch (error) {
    console.error("Error uploading files:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function deleteFile(fileUrl, folderPath) {
  const fileName = getFileNameFromUrl(fileUrl);

  try {
    const bucket = await admin.storage().bucket();
    const filePath = `${folderPath}/${fileName}`;
    await bucket.file(filePath).delete();
    console.log(`File ${fileName} deleted successfully.`);
  } catch (error) {
    console.error(`Error deleting file ${fileName}:`, error);
    throw new Error(`Failed to delete file ${fileName}: ${error.message}`);
  }
}

async function updateFile(file) {
  try {
    const bucket = admin.storage().bucket();
    const fileUpload = bucket.file(file.originalname);

    // Delete existing file if it exists
    await fileUpload.delete().catch((error) => {
      // Ignore "Not Found" error if file doesn't exist
      if (error.code !== 404) {
        throw error;
      }
    });

    // Upload new file to Firebase Storage
    await fileUpload.save(file.buffer, {
      metadata: {
        contentType: file.mimetype,
      },
    });

    // Generate download URL for the uploaded file
    const [url] = await fileUpload.getSignedUrl({
      action: "read",
      expires: "01-01-2025",
    });

    return url;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error; // Rethrow the error to handle it elsewhere
  }
}

module.exports = {
  uploadFiles,
  deleteFile,
  updateFile,
};
