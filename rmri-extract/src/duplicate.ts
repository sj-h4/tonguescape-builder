import * as sqlite3 from "sqlite3";
import { open } from "sqlite";
import * as fs from "node:fs";

import { trimVideo } from "./trimVideo";
import type { RtMRIRecord } from "./RtMRIRecord";

type TrimmedRtMRIRecord = {
  /** The ID of the original rtMRIDB */
  parentId: number;
  file: string;
  phoneme: string;
};

async function getRtMRIRecords(targertIDs: number[]) {
  const db = await open({
    filename: "data/rtMRIDB.sqlite3",
    driver: sqlite3.Database,
  });

  const conditions = targertIDs
    .map((element) => `id LIKE '${element}'`)
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

function oldOutputFileName(videoName: string, suffix: string) {
  return `data/trimmed/mp4/${suffix}_${videoName}.mp4`;
}

const taeget_id = [
  810, 811, 1637, 1638, 2734, 2735, 2736, 2737, 2746, 2747, 2748, 2749, 2769,
  2770, 2771, 2772, 2773, 2774, 2775, 2776, 2777, 2778, 2779, 2780, 2781, 2782,
  2783, 2784, 2785, 2786, 2787, 3126, 3127, 3128, 3129, 3130, 3131, 3132, 3133,
  3134, 3135, 3136, 3137, 3138, 3139, 3140, 3141, 3142, 3143, 3144, 3145, 3146,
  3147, 3148, 3149, 4068, 4069, 4748, 4749, 5802, 5803, 6314, 6315, 6316, 6405,
  6406, 6407, 6408, 6409, 6410, 6411, 6412, 6413, 6414, 6415, 6416, 6417, 6418,
  6419, 6420, 6421, 6422, 6423, 6424, 6425, 6426, 6443, 6444, 6445, 6446, 6448,
  6449, 6450, 6451, 6452, 6453, 6454, 6455, 6456, 6457, 6458, 6459, 6478, 6479,
  6481, 6482, 6484, 6485, 6487, 6488, 6490, 6491, 7181, 7182, 7185, 7186, 7189,
  7190, 8209, 8210, 8211, 8212, 8213, 8214, 8222, 8223, 8224, 8225, 8226, 8227,
  8235, 8236, 8237, 8238, 8247, 8248, 8249, 8250, 8251, 8252, 8253, 8254, 8255,
  8256, 8257, 8258, 8259, 8260, 8261, 8262, 8263, 8264, 8265, 8266, 8267, 8268,
  9170, 9171, 9172, 9173, 9174, 9175, 9176, 9177, 9178, 9179, 9180, 9181, 9182,
  9183, 9184, 9185, 9186, 9187, 9188, 9189, 9202, 9203, 11318, 11319, 11322,
  11323, 11355, 11356, 11639, 11640, 11642, 11643, 11645, 11646, 11647, 11648,
  11649, 11650, 11652, 11653, 12293, 12294, 12295, 12296, 12297, 12298, 12299,
  12300, 12301, 12302, 12303, 12429, 12430, 12431, 12432, 12433, 12434, 12435,
  12436, 12437, 12438, 12439, 12440, 12441, 12442, 12443, 12444, 12445, 12446,
  12447, 12448, 12449, 12538, 12539, 12540, 12541, 12542, 12543, 12544, 12545,
  12546, 12547, 12548, 12549, 12550, 12551, 12552, 12553, 12554, 12555, 12556,
  12557, 12558, 12559, 12560, 12561, 12562, 12563, 12564, 13210, 13211, 13212,
  13213, 13214, 13215, 13333, 13334, 13769, 13770, 15041, 15042, 15043, 15044,
  15045, 15046, 15047, 15048, 15049, 15050, 15051, 15052, 15053, 15054, 15055,
  15155, 15156, 15157, 15158, 15559, 15560, 15561, 15562, 15563, 15736, 15737,
  15739, 15740, 15742, 15743, 15745, 15746, 16064, 16065, 16583, 16584, 17388,
  17389, 17390, 17391, 17392, 17393, 17394, 17395, 17396, 17397, 17398, 17399,
  17400, 17401, 17402, 17403, 17404, 17405, 17406, 17407, 18029, 18030, 18031,
  18032, 18033, 18034, 18035, 18036, 18037, 18038, 18039, 18040, 18041, 18042,
  18043, 18044, 18706, 18707, 18708, 18709, 18710, 18711, 18712, 18713, 18714,
  18715, 18716, 18717, 18718, 18719, 18720, 18721, 18722, 18723, 18724, 18725,
  18726, 21132, 21133, 21156, 21157, 21550, 21551, 21759, 21760, 21761, 21762,
  21763, 21764, 21765, 21766, 21767, 21768, 21769, 21770, 21771, 21772, 21773,
  21774, 21775, 21776, 21777, 21778, 21779, 21780, 21781, 21782, 21783, 21784,
  21789, 21790, 21791, 21792, 21793, 21794, 21795, 21796, 21797, 21798, 21799,
  21800, 21801, 21802, 21803, 21804, 21805, 21806, 21807, 21808, 21809, 21810,
  21811, 24023, 24024, 24341, 24342, 24343, 24344, 24345, 24346, 24347, 24348,
  24349, 24350, 24351, 24352, 24353, 24354, 24355, 24356, 24357, 24358, 24359,
  24360, 24361, 24362, 24363, 24364, 24365, 24366, 24531, 24532, 24542, 24543,
  24544, 25711, 25712,
];

const allTrimmedRecords = await getAllRtMRIRecords();

const trimmedRecords: RtMRIRecord[] = [];
for (const record of allTrimmedRecords) {
  const videoName = record.file;
  const phoneme = record.phoneme;
  const parentId = record.id;

  const inputPath = videoFilePath(videoName);
  const outputName = outputFileName(videoName, phoneme, parentId);
  const outputPath = `data/trimmed/mp4/${outputName}`;

  if (!taeget_id.includes(parentId)) {
    const oldName = oldOutputFileName(videoName, phoneme);
    if (fs.existsSync(oldName)) {
      fs.renameSync(oldName, outputPath);
    }
  } else {
    if (fs.existsSync(outputFileName(videoName, phoneme, parentId))) {
      fs.unlinkSync(oldOutputFileName(videoName, phoneme));
    }
    await trimVideo(inputPath, outputPath, 0, 1);
  }

  record.trimmed_path = outputPath;
  trimmedRecords.push(record);
}

const csvHeader =
  "1,1,1,1,1,1,phoneme,1,1,1,1,1,1,1,fps,1,1,1,1,subject_id,id,trimmed_path";
const csvContent = trimmedRecords
  .map((record) => Object.values(record).join(","))
  .join("\n");
const csvData = `${csvHeader}\n${csvContent}`;

Bun.write("data/trimmed/index.csv", csvData);
