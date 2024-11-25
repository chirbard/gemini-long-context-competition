import os


def remove_first_n_lines(input_file_path, output_file_path, n):
    try:
        # Open the input file and read all lines
        with open(input_file_path, "r", encoding="utf-8") as file:
            lines = file.readlines()

        # Skip the first `n` lines
        remaining_lines = lines[n:]

        # Write the remaining lines to the output file
        with open(output_file_path, "w", encoding="utf-8") as output_file:
            output_file.writelines(remaining_lines)

        print(f"First {n} lines removed. The new content is saved to {
              output_file_path}.")

    except FileNotFoundError:
        print(f"File not found at {input_file_path}.")
    except Exception as e:
        print(f"An error occurred: {e}")


def remove_section(input_file_path, output_file_path, end_text):
    try:
        # Open the input file and read all lines
        with open(input_file_path, "r", encoding="utf-8") as file:
            lines = file.readlines()

        # Initialize variables for keeping track of the lines to keep
        result_lines = []
        section_started = False  # Flag to check if we are in the section to remove
        add_rest = False

        for line in lines:
            if not section_started:
                result_lines.append(line)  # Keep the first line
                section_started = True  # Start removing lines after the first line

            # Stop adding lines once we find the line with § 1.
            if end_text in line:
                add_rest = True  # Start adding lines again

            if add_rest:
                result_lines.append(line)

        # Write the result to a new file
        with open(output_file_path, "w", encoding="utf-8") as output_file:
            output_file.writelines(result_lines)

        print(f"Section after the first line has been removed. The new content is saved to {
              output_file_path}.")

    except FileNotFoundError:
        print(f"File not found at {input_file_path}.")
    except Exception as e:
        print(f"An error occurred: {e}")


def remove_lines_with_brackets(input_file_path, output_file_path):
    try:
        # Open the input file and read all lines
        with open(input_file_path, "r", encoding="utf-8") as file:
            lines = file.readlines()

        # Initialize a list to store lines that do not contain brackets
        filtered_lines = []

        # Iterate through each line and check for brackets
        for line in lines:
            if "[" not in line and "]" not in line:
                # Add line if it doesn't contain '[' or ']'
                filtered_lines.append(line)

        # Write the filtered lines to the output file
        with open(output_file_path, "w", encoding="utf-8") as output_file:
            output_file.writelines(filtered_lines)

        print(f"Lines containing '[' or ']' have been removed. The new content is saved to {
              output_file_path}.")

    except FileNotFoundError:
        print(f"File not found at {input_file_path}.")
    except Exception as e:
        print(f"An error occurred: {e}")


def remove_blank_lines(input_file_path, output_file_path):
    try:
        # Open the input file and read all lines
        with open(input_file_path, "r", encoding="utf-8") as file:
            lines = file.readlines()

        # Initialize a list to store lines that are not empty
        filtered_lines = []

        # Iterate through each line and remove blank lines
        for line in lines:
            if line.strip():  # Only add the line if it is not empty
                filtered_lines.append(line)

        # Write the filtered lines to the output file
        with open(output_file_path, "w", encoding="utf-8") as output_file:
            output_file.writelines(filtered_lines)

        print(f"Blank lines have been removed. The new content is saved to {
              output_file_path}.")

    except FileNotFoundError:
        print(f"File not found at {input_file_path}.")
    except Exception as e:
        print(f"An error occurred: {e}")


def remove_lines_after(input_file_path, output_file_path, start_text):
    try:
        # Open the input file and read all lines
        with open(input_file_path, "r", encoding="utf-8") as file:
            lines = file.readlines()

        # Initialize variables for keeping track of the lines to keep
        result_lines = []

        for line in lines:
            if start_text not in line:
                result_lines.append(line)

            if start_text in line:
                break

        # Write the result to a new file
        with open(output_file_path, "w", encoding="utf-8") as output_file:
            output_file.writelines(result_lines)

        print(f"Lines after '{
              start_text}' have been removed. The new content is saved to {output_file_path}.")

    except FileNotFoundError:
        print(f"File not found at {input_file_path}.")
    except Exception as e:
        print(f"An error occurred: {e}")


def clean_text(input_file_path, output_file_path):
    try:
        # Open the input file and read all lines
        with open(input_file_path, "r", encoding="utf-8") as file:
            lines = file.readlines()

        # Initialize a list to store cleaned lines
        cleaned_lines = []

        # Iterate through each line to remove unwanted characters
        for line in lines:
            cleaned_line = line.lstrip("(")
            cleaned_line = cleaned_line.lstrip(")")
            cleaned_line = cleaned_line.replace(") ", ")")
            cleaned_lines.append(cleaned_line)

        # Write the cleaned lines to the output file
        with open(output_file_path, "w", encoding="utf-8") as output_file:
            output_file.writelines(cleaned_lines)

        print(f"Text has been cleaned. The result is saved to {
              output_file_path}.")

    except FileNotFoundError:
        print(f"File not found at {input_file_path}.")
    except Exception as e:
        print(f"An error occurred: {e}")


def modify_files(data_folder, output_folder, n, end_text, start_text):
    for i in os.listdir(data_folder):
        if i.endswith(".txt"):
            input_path = data_folder + i
            output_path = output_folder + i
            remove_first_n_lines(input_path, output_path, n)
            remove_section(output_path, output_path, end_text)
            remove_lines_with_brackets(output_path, output_path)
            remove_blank_lines(output_path, output_path)
            remove_lines_after(output_path, output_path, start_text)
            clean_text(output_path, output_path)
