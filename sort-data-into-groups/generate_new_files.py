import os


def generate_new_files(groups, data_folder='./data', output_folder='./output'):
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    for i, group in enumerate(groups):
        i = i + 1
        with open(f'{output_folder}/group_{i}.txt', 'w') as f:
            for file_name in group:
                input_file_path = os.path.join(data_folder, file_name)
                with open(input_file_path, 'r') as input_file:
                    print(f'Writing {file_name} to group_{i}.txt')
                    f.write(input_file.read())
