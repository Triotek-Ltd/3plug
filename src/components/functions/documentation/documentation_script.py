import os
import json

def find_readme_files(current_path, current_depth=0, max_depth=20):
    documentation_data = []

    # Check for maximum depth
    if current_depth > max_depth:
        return documentation_data

    # Search for README files in the current directory
    for root, dirs, files in os.walk(current_path):
        for file in files:
            if file.lower() == "readme.md":  # Check for case-insensitive match
                file_path = os.path.join(root, file)
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.readlines()
                    title = content[0].strip() if content else "Untitled"
                    steps = [{"step": i + 1, "title": line.strip(), "description": "", "caution": ""}
                             for i, line in enumerate(content[1:6]) if line.strip()]  # Preview next five lines
                    documentation_data.append({
                        "sectionTitle": title,
                        "sectionLink": file_path,
                        "steps": steps
                    })

    return documentation_data

def search_upwards(current_path, max_depth=20):
    documentation_data = []

    for depth in range(max_depth):
        parent_dir = os.path.dirname(current_path)
        if parent_dir and parent_dir != current_path:
            # Search in the parent directory
            documentation_data.extend(find_readme_files(parent_dir))
            current_path = parent_dir  # Move up to the parent directory
        else:
            break  # Stop if no more parent directory

    return documentation_data

def search_downwards(root_path):
    documentation_data = []
    for root, dirs, files in os.walk(root_path):
        for file in files:
            if file.lower() == "readme.md":  # Check for case-insensitive match
                file_path = os.path.join(root, file)
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.readlines()
                    title = content[0].strip() if content else "Untitled"
                    steps = [{"step": i + 1, "title": line.strip(), "description": "", "caution": ""}
                             for i, line in enumerate(content[1:6]) if line.strip()]  # Preview next five lines
                    documentation_data.append({
                        "sectionTitle": title,
                        "sectionLink": file_path,
                        "steps": steps
                    })

    return documentation_data

def save_to_json(data, output_file):
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=4)

if __name__ == "__main__":
    current_script_path = os.path.dirname(os.path.abspath(__file__))  # Get the directory of the script
    output_file = os.path.join(current_script_path, 'documentation_data.json')
    
    # First, search upwards to collect data from parent directories
    documentation_data = search_upwards(current_script_path)

    # After reaching the top, search downwards from the top directory
    documentation_data.extend(search_downwards(current_script_path))

    save_to_json(documentation_data, output_file)

    print(f"Documentation data has been saved to {output_file}")
