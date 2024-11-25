import requests
from bs4 import BeautifulSoup


def scrape_links(url):
    grab = requests.get(url)
    soup = BeautifulSoup(grab.text, 'html.parser')

    links = []

    for link in soup.find_all("a"):
        data = link.get('href')
        links.append(data)

    return links
