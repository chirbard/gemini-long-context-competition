import os
from dotenv import load_dotenv

from scrape import scrape
from modify import modify_files

load_dotenv()

data_folder = './data/'
output_folder = './output/'

url = os.getenv('URL')


# scrape(data_folder, url, ".txt")
modify_files(data_folder, output_folder, 7, "§ 1.", "Seaduse jõustumine")
