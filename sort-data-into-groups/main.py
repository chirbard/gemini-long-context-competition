from get_file_sizes import threaded_get_file_sizes
from get_groups import get_groups
from generate_new_files import generate_new_files


data_folder = './data'
output_folder = './output'

file_sizes = threaded_get_file_sizes(data_folder=data_folder)
# Note: the token limit should also fit the system prompt and user prompt
groups = get_groups(file_sizes=file_sizes, group_token_limit=938000)
generate_new_files(groups=groups, data_folder=data_folder,
                   output_folder=output_folder)
