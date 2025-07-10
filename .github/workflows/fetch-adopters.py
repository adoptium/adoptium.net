#!/usr/bin/env python3

import json
import os

import requests


def check_value(data, val):
    return any(adopter["name"] == val for adopter in data)


# Load the local Adopters JSON file in src/data/adopters.json
with open("src/data/adopters.json") as f:
    data = list(json.load(f))
    current_adopters = data

page = requests.get(
    "https://api.eclipse.org/adopters/projects?working_group=adoptium".format(
        **locals()
    )
)

# Find project with project_id for temurin
temurin_project = next(
    (project for project in page.json() if project["project_id"] == "adoptium.temurin"),
    None,
)

# check if temurin_project is not None (it will be until the API is added)
if temurin_project is not None:
    # Loop through Adopters and print their names
    for adopter in temurin_project["adopters"]:
        # check if adopter['name'] is already in src/json/adopters.json
        if not check_value(current_adopters, adopter["name"]):
            adopter_logo = (
                "https://api.eclipse.org/adopters/assets/images/adopters/"
                + adopter["logo"]
            )
            # add adopter to src/json/adopters.json
            new_adopter = {
                "name": adopter["name"],
                "logo": "adopters/" + adopter["logo"],
                "url": adopter["homepage_url"],
                "tier": "adopter",
            }
            current_adopters.append(new_adopter)

            # Download the logo and save it to public/images/adopters/
            logo = requests.get(adopter_logo)
            # check if public/images/adopters/ exists
            if not os.path.exists("public/images/adopters/"):
                os.makedirs("public/images/adopters/")
            open("public/images/adopters/" + adopter["logo"], "wb").write(logo.content)

            # optionally download logo_white if it exists
            if "logo_white" in adopter and adopter["logo_white"] != "":
                logo_white = requests.get(
                    "https://api.eclipse.org/adopters/assets/images/adopters/"
                    + adopter["logo_white"]
                )
                open("public/images/adopters/" + adopter["logo_white"], "wb").write(
                    logo_white.content
                )
                new_adopter["logo_white"] = "adopters/" + adopter["logo_white"]

    # Write the updated list of adopters to src/data/adopters.json
    with open("src/data/adopters.json", "w") as f:
        # Sort the list of adopters alphabetically
        current_adopters.sort(key=lambda x: x["name"].lower())
        # format JSON to be human readable
        json.dump(current_adopters, f, indent=2)
        # Add a newline at the end of the file
        f.write("\n")
