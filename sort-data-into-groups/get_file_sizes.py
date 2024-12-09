import os
import google.generativeai as genai
from dotenv import load_dotenv
from concurrent.futures import ThreadPoolExecutor


def __get_file_size(filename, data_folder, model):
    file_path = os.path.join(data_folder, filename)
    if os.path.isfile(file_path):
        print(f'Processing file: {file_path}')
        with open(file_path, 'r') as my_file:
            my_file_content = my_file.read()
        token_count = model.count_tokens(my_file_content).total_tokens
        return filename, token_count
    return filename, 0


def threaded_get_file_sizes(data_folder='./data'):
    load_dotenv()
    api_key = os.getenv('GOOGLE_API_KEY')

    file_sizes = {}
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel("gemini-1.5-flash")

    with ThreadPoolExecutor() as executor:
        futures = []
        for filename in os.listdir(data_folder):
            if filename.endswith('.txt'):
                futures.append(executor.submit(
                    __get_file_size, filename, data_folder, model))

        for future in futures:
            filename, token_count = future.result()
            file_sizes[filename] = token_count

    print(file_sizes)
    return file_sizes


def get_file_sizes(data_folder='./data'):
    load_dotenv()
    api_key = os.getenv('GOOGLE_API_KEY')

    file_sizes = {}
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel("gemini-1.5-flash")

    for filename in os.listdir(data_folder):
        if not filename.endswith('.txt'):
            continue
        file_path = os.path.join(data_folder, filename)
        if os.path.isfile(file_path):
            print(f'Processing file: {file_path}')
            my_file = open(file_path, 'r')
            my_file_content = my_file.read()
            my_file.close()
            token_count = model.count_tokens(my_file_content).total_tokens
            file_sizes[filename] = token_count

    print(file_sizes)
    return file_sizes
