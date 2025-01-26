import cv2
import csv
import os
import sys
from PIL import Image


def extract_one_frame(video_file_name: str, save_dir: str, save_name: str):
    """
    Extract all frames from the input video.

    Args:
        video_file_name: a file path of the video

    Returns:
        A list of `Image` of the input video and the total number of frames.
    """
    video = cv2.VideoCapture(video_file_name)
    total_frames = int(video.get(cv2.CAP_PROP_FRAME_COUNT))
    target_frames = [total_frames // 2]
    target_frame = None
    for i in range(total_frames):
        ret, frame = video.read()
        pil_img = Image.fromarray(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))
        if not ret:
            continue
        if i in target_frames:
            target_frame = pil_img
    video.release()
    target_frame.save(os.path.join(save_dir, save_name))
    return


if __name__ == "__main__":
    video_dir = sys.argv[1]
    index_file = sys.argv[2]
    output_file = sys.argv[3]
    save_dir = sys.argv[4]
    video_file_path_column_num = int(sys.argv[5])

    with (
        open(index_file, "r") as infile,
        open(output_file, "w", newline="", encoding="utf-8") as outfile,
    ):
        reader = csv.reader(infile)
        # load header
        hader = next(reader)
        header = hader + ["clipped_file_name"]
        out_writer = csv.writer(outfile)

        for row in reader:
            video_file_path = os.path.join(video_dir, row[video_file_path_column_num])
            new_row = row
            clipped_file_name = row[video_file_path_column_num].split(".")[0] + "_1.jpg"
            extract_one_frame(video_file_path, save_dir, clipped_file_name)
            new_row.append(clipped_file_name)
            out_writer.writerow(new_row)
