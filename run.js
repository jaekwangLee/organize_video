const fs = require("fs");

// 아래 경로만 동영상들이 위치한 경로로 변경하면 됩니다.
const FOLDER_ROOT = "/";

async function main() {
  const videos = readVideos();
  if (videos.length > 0) organizeVideosByDay(videos, 0);
}

async function organizeVideosByDay(videos, index) {
  const video = videos[0];
  const currentVideoStats = fs.statSync(`${FOLDER_ROOT}/${video}`);
  const dirName = `${dateFormatting(currentVideoStats.birthtime)}_VIDEOS`;
  isDir(dirName);

  appendVideoToDir({ video, dir: dirName });

  if (videos.length > index + 1) {
    organizeVideosByDay(videos, index + 1);
  }
}

function isDir(dirName) {
  const root = `/${FOLDER_ROOT}/${dirName}`;
  try {
    fs.accessSync(root);
    return true;
  } catch (err) {
    console.log("err: ", err);
    fs.mkdirSync(root);
    return false;
  }
}

function appendVideoToDir({ video, dir }) {
  fs.renameSync(`${FOLDER_ROOT}/${video}`, `${FOLDER_ROOT}/${dir}/${video}`);
}

// 해당 함수의 확장자 세팅을 변경하면 추가적인 파일 정리가 가능합니다.
function readVideos() {
  const allFiles = fs.readdirSync(FOLDER_ROOT);
  const videos = allFiles.filter(
    (v) =>
      v &&
      (v.toLowerCase().includes(".mp4") ||
        v.toLowerCase().includes(".mov") ||
        v.toLowerCase().includes(".avi"))
  );
  return videos;
}

function dateFormatting(tDate) {
  const date = new Date(tDate);
  const YYYY = date.getFullYear().toString();
  const MM = date.getMonth().toString();
  const DD = date.getDate().toString();

  return `${YYYY}-${MM.length === 1 ? "0" + MM : MM}-${
    DD.length === 1 ? "0" + DD : DD
  }`;
}

main();
