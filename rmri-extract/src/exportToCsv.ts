import * as sqlite3 from "sqlite3";
import { open } from "sqlite";
import * as fs from "node:fs";

export async function exportToCSV(
	databasePath: string,
	tableName: string,
	columnName: string,
	targetElements: string[],
) {
	const db = await open({
		filename: databasePath,
		driver: sqlite3.Database,
	});

	const conditions = targetElements
		.map((element) => `${columnName} LIKE '${element}'`)
		.join(" OR ");
	const query = `SELECT * FROM ${tableName} WHERE ${conditions}`;

	const records = await db.all(query);

	const csvContent = records
		.map((record) => Object.values(record).join(","))
		.join("\n");
	const csvHeader = Object.keys(records[0]).join(",");
	const csvData = `${csvHeader}\n${csvContent}`;

	fs.writeFileSync("data/output.csv", csvData);

	await db.close();
}
