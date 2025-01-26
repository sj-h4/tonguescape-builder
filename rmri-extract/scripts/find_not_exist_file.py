import csv
import os

def check():
	data = []
	with open('data/trimmed/index.csv', 'r') as file:
		reader = csv.reader(file)
		for row in reader:
			data.append(row)
	
	# check if the file exist
	not_exist_path = []
	for i in range(1, len(data)):
		mp4_name = data[i][-1]
		mp4_path = os.path.join('', mp4_name)
		if not os.path.exists(mp4_path):
			not_exist_path.append(mp4_path)
	print('\n'.join(not_exist_path))

if __name__ == '__main__':
	check()
