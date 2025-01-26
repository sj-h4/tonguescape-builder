import ffmpeg from "fluent-ffmpeg";

export function trimVideo(
	inputPath: string,
	outputPath: string,
	start: number,
	end: number,
) {
	return new Promise((resolve, reject) => {
		ffmpeg()
			.input(inputPath)
			.inputOptions([`-ss ${start}`, `-to ${end}`])
			.output(outputPath)
			.on("end", resolve)
			.on("error", reject)
			.run();
	});
}
