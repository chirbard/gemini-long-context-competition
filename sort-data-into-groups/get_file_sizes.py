import os
import google.generativeai as genai
from dotenv import load_dotenv

def get_file_sizes(data_folder='./data'):
    load_dotenv()
    api_key = os.getenv('GOOGLE_API_KEY')

    file_sizes = {}
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel("gemini-1.5-flash")

    for filename in os.listdir(data_folder):
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