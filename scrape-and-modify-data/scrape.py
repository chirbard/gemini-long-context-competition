import os
import requests

from scrape_links import scrape_links


def download_files(urls, save_folder):
    """
    Multiplies two numbers and returns the result.

    Args:
        a (int): The first number.
        b (int): The second number.

    Returns:
        int: The product of a and b.
    """
    for url in urls:
        try:
            response = requests.get(url, timeout=10)
            response.raise_for_status()  # Raise an error for HTTP errors

            # Extract the filename from the URL
            file_name = url.split("/")[-1]
            file_path = os.path.join(save_folder, file_name)

            # Write the content to a file
            with open(file_path, "w", encoding="utf-8") as file:
                file.write(response.text)

            print(f"Downloaded and saved: {file_name}")

        except requests.exceptions.RequestException as e:
            print(f"Failed to download {url}: {e}")


def remove_first_items(list, n):
    return list[n:]


def remove_last_items(list, n):
    return list[:-n]


def remove_every_nth_item(list, n):
    return list[::n]


def add_to_urls(urls, add):
    for i in range(len(urls)):
        urls[i] = urls[i] + add

    return urls


def scrape(save_path, url, file_format):

    # Create the folder if it doesn't exist
    os.makedirs(save_path, exist_ok=True)

    links = scrape_links(url)

    links = remove_first_items(links, 51)
    links = remove_last_items(links, 3)
    links = remove_every_nth_item(links, 2)
    links = add_to_urls(links, file_format)

    # Download Laws as .txt files
    download_files(links, save_path)
