import csv
import sys


def filter_csv(
    input_file: str, output_file: str, column_name: str, filter_values: list
):
    with (
        open(input_file, "r", newline="", encoding="utf-8") as infile,
        open(output_file, "w", newline="", encoding="utf-8") as outfile,
    ):
        reader = csv.DictReader(infile)

        fieldnames = reader.fieldnames

        writer = csv.DictWriter(outfile, fieldnames=fieldnames)
        writer.writeheader()

        for row in reader:
            if row[column_name] in filter_values:
                writer.writerow(row)


if __name__ == "__main__":
    input_file = sys.argv[1]
    output_file = sys.argv[2]
    column_name = "phoneme"
    filter_value = ["a", "i", "u", "e", "o"]

    filter_csv(input_file, output_file, column_name, filter_value)
