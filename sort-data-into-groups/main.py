from get_file_sizes import get_file_sizes
from get_groups import get_groups
from generate_new_files import generate_new_files


data_folder = './data'
output_folder = './output'

file_sizes = get_file_sizes(data_folder=data_folder)
# file_sizes = {'file1.txt': 200, 'file2.txt': 200, 'file3.txt': 300, 'file4.txt': 400}
groups = get_groups(file_sizes=file_sizes, group_token_limit=70000)

print(groups)

generate_new_files(groups=groups, data_folder=data_folder, output_folder=output_folder)
