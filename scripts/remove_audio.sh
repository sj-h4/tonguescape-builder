#!/bin/bash

input_dir=$1
output_dir=$2

for input_file in "$input_dir"/*.mp4; do
  filename=$(basename "$input_file" .mp4)
  output_file="$output_dir/${filename}_silent.mp4"
  ffmpeg -i "$input_file" -an "$output_file"
done

echo "All done!"
