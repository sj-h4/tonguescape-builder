import csv

def check():
	data = []
	with open('data/trimmed/index.csv', 'r') as file:
		reader = csv.reader(file)
		for row in reader:
			data.append(row)
	
	found_path = []
	duplicated_path = []
	for i in range(1, len(data)):
		mp4_path = data[i][-1]
		if mp4_path in found_path:
			print(f'{data[i][-2]},{mp4_path}')
			duplicated_path.append(mp4_path)
		else:
			found_path.append(mp4_path)
			
	
	duplicated_id = []
	for i in range(1, len(data)):
		mp4_path = data[i][-1]
		if mp4_path in duplicated_path:
			duplicated_id.append(data[i][-2])
	# print(','.join(duplicated_id))
	return data, duplicated_id

if __name__ == '__main__':
	check()
