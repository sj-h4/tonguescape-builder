import * as sqlite3 from "sqlite3";
import { open } from "sqlite";

import { trimVideo } from "./trimVideo";
import type { RtMRIRecord } from "./RtMRIRecord";

async function getRtMRIRecords(targerPhoemes: string[]) {
  const db = await open({
    filename: "data/rtMRIDB.sqlite3",
    driver: sqlite3.Database,
  });

  const conditions = targerPhoemes
    .map((element) => `phoneme LIKE '${element}'`)
    .join(" OR ");
  const query = `SELECT * FROM rtmri WHERE ${conditions}`;

  const records = await db.all(query);

  await db.close();

  return records;
}

async function getAllRtMRIRecords(): Promise<RtMRIRecord[]> {
  const db = await open({
    filename: "data/rtMRIDB.sqlite3",
    driver: sqlite3.Database,
  });

  const query = "SELECT * FROM rtmri";

  const records = await db.all(query);
  await db.close();

  return records;
}

function videoFilePath(videoName: string) {
  return `data/rtmridb_v1_mp4/${videoName}.mp4`;
}

function outputFileName(videoName: string, suffix: string, id: number) {
  return `${suffix}_${id}_${videoName}.mp4`;
}

const rtMRIRecords = await getAllRtMRIRecords();

const trimmedRecords: RtMRIRecord[] = [];
const totalRecords = rtMRIRecords.length;
let completedRecords = 0;

console.log("Trimming started");
for (const record of rtMRIRecords) {
  const videoName = record.file;
  const phoneme = record.phoneme;
  const start = record.start;
  const end = record.end;
  const id = record.id;

  const inputPath = videoFilePath(videoName);
  const outputName = outputFileName(videoName, phoneme, id);
  const outputPath = `data/trimmed/mp4/${outputName}`;

  await trimVideo(inputPath, outputPath, start, end);
  const trimmedRecord = record;
  trimmedRecord.trimmed_path = outputName;
  trimmedRecords.push(trimmedRecord);

  completedRecords++;
  if (completedRecords % 10 === 0 || completedRecords === totalRecords) {
    const percentage = ((completedRecords / totalRecords) * 100).toFixed(2);
    console.log(
      `Progress: ${completedRecords}/${totalRecords} (${percentage}%)`,
    );
  }
}
console.log("Trimming completed");

const csvHeader =
  "1,1,1,1,1,1,phoneme,1,1,1,1,1,1,1,fps,1,1,1,1,subject_id,id,trimmed_path";
const csvContent = trimmedRecords
  .map((record) => Object.values(record).join(","))
  .join("\n");
const csvData = `${csvHeader}\n${csvContent}`;

Bun.write("data/trimmed/index.csv", csvData);
console.log("Index CSV file created");
