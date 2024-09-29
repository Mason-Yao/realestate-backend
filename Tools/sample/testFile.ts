import FileManager from "../../Backend/src/lambdas/service/file/file";

const fileManager = new FileManager(
  "CRM-allen-Property",
  "crm-allen-files.cyberlark.com.au"
);

// test presigned url
fileManager
  .getUploadPresignedUrl()
  .then((res) => {
    console.log("presigned url: ", res);
  })
  .catch((err) => console.log(err));

// test file CRUD
const filePath1 = "./testfile1.png";
const filePath2 = "./testfile2.png";

fileManager
  .addFiles([{ path: filePath1 }, { path: filePath2 }])
  .then((res) => {
    console.log("File upload response: ", res.files?.items);
    return res;
  })
  .then((res) => {
    if (res.files?.items) {
      fileManager.getFileById(res.files?.items?.[0].id);
      console.log("Get file response: ", res.files?.items?.[0]);
    }
    return res;
  })
  .then((res) => {
    if (res.files?.items) {
      for (let i = 0; i < res.files.items.length; i++) {
        fileManager.deleteFile(res.files.items[i].id);
        console.log("File deleted");
      }
    }
  })
  .catch((err) => console.log(err));
