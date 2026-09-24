import ImageKit, { toFile } from "@imagekit/nodejs";

const imagekit = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
});

function hasImageKitConfig() {
  return Boolean(process.env.IMAGEKIT_PRIVATE_KEY);
}

function createFileName(originalName = "upload") {
  const safeName = originalName.replace(/[^a-zA-Z0-9._-]/g, "_");

  return `chat-${Date.now()}-${safeName}`;
}

async function uploadChatMedia(file) {
  if (!file) {
    throw new Error("No file received");
  }

  const fileName = createFileName(file.originalname);

  console.log("Uploading media to ImageKit:");
  console.log("File:", file.originalname);
  console.log("MIME:", file.mimetype);
  console.log("Size:", file.size);

  const uploadFile = await toFile(file.buffer, fileName, {
    type: file.mimetype,
  });

  const result = await imagekit.files.upload({
    file: uploadFile,
    fileName,
    folder: "/chat",
  });

  console.log("ImageKit upload successful:", result.url);

  return result.url;
}

export { hasImageKitConfig, uploadChatMedia };
