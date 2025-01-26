#!/bin/bash

input_dir=$1
output_dir=$2

for input_file in "$input_dir"/*.jpg; do
  filename=$(basename "$input_file" .jpg)
  output_file="$output_dir/${filename}_video.mp4"
  ffmpeg -i "$input_file" -c:v libx264 -pix_fmt yuv420p "$output_file"
done

echo "All done!"
