function getRangeOfYears() {
    var months = [];
    var years = ["2016", "2017"];
    var dates = [];
    for (var i = 1; i < 13; i++) {
        if (i.toString().length === 1) {
            months.push("0" + i.toString())
        }
        else {
            months.push(i.toString())
        }
    }
    for (i = 0; i < years.length; i++) {
        for (var months_ind = 0; months_ind < months.length; months_ind++) {
            dates.push(years[i] + "-" + months[months_ind] + '-05')
        }
    }
    return dates;
}

function parse_json(fileData){
    console.log("finnalt", fileData.rates)
}

