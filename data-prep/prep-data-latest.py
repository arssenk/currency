import requests


def get_data_with_api(url):
    resp = requests.get(url)
    return resp.json()["date"]+ "\t" + str(resp.json()["rates"]["USD"]) + "\t" + str(resp.json()["rates"]["GBP"])  + "\t" +  str(resp.json()["rates"]["CAD"]) + "\n"


def get_data():
    url = "https://ratesapi.io/api/latest"
    header = "date\tUSD\tGBP\tCAD\n"
    with open("../data/data-latest.tsv", "w") as myfile:
        myfile.write(header)
        myfile.write(get_data_with_api(url))
    return 1

get_data()