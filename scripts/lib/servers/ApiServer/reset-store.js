const path = require("path");
const fs = require("fs-extra");

const resest = async () => {
  const backupFile = path.join(
    __dirname,
    "api",
    "Storage",
    "stores",
    "mockData-backup.json"
  );
  const storeFile = path.join(
    __dirname,
    "api",
    "Storage",
    "stores",
    "mockData.json"
  );
  const content = await fs.readFile(backupFile, "utf8");
  await fs.writeFile(storeFile, content);
};

resest();
