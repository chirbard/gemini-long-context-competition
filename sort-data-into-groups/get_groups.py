def get_groups(file_sizes, group_token_limit=1000):
    sorted_file_sizes = dict(sorted(file_sizes.items(), key=lambda item: item[1], reverse=True))

    groups = []

    def add_to_group(file_name):
        for group in groups:
            if sum(group.values()) + file_sizes[file_name] < group_token_limit:
                group[file_name] = file_sizes[file_name]
                return
        groups.append({file_name: file_sizes[file_name]})

    for file_name in sorted_file_sizes:
        add_to_group(file_name)

    return groups
