import requests


def get_data_with_api(url):
    resp = requests.get(url)
    return resp.json()["date"]+ "\t" + str(resp.json()["rates"]["USD"]) + "\t" + str(resp.json()["rates"]["GBP"])  + "\t" +  str(resp.json()["rates"]["CAD"]) + "\n"

def get_range_of_dates():
    years = ["2016", "2017"]
    months = range(1,13)
    result = []
    for year in years:
        for month in months:
            if len(str(month)) == 1:
                result.append(year+"-0"+ str(month) + "-05")
            else:
                 result.append(year+"-"+ str(month) + "-05")
    return result

def get_data():
    url = "https://ratesapi.io/api/"
    header = "date\tUSD\tGBP\tCAD\n"
    with open("../data/data.tsv", "w") as myfile:
        myfile.write(header)
        for date in get_range_of_dates():

            myfile.write(get_data_with_api(url +date))
    return 1

get_data()