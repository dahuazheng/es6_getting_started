// function* fibs() {
//     let a = 0;
//     let b = 1;
//     while (true) {
//         yield a;
//         [a, b] = [b, a + b];
//     }
// }

// let [first, second, third, fourth, fifth, sixth] = fibs();
// let [...arr] = fibs();
// console.log(arr) // 5

const dates = [
    {
        "gmtCreate": 1599191278000,
        "gmtUpdate": 1599631110000,
        "delete": false,
        "startDate": "2020-09-01",
        "endDate": "2020-09-15"
    },
    {
        "gmtCreate": 1598864169000,
        "gmtUpdate": 1599631131000,
        "delete": false,
        "startDate": "2020-09-09",
        "endDate": "2020-09-28"
    },
    {
        "gmtCreate": 1594626155000,
        "gmtUpdate": 1599190963000,
        "delete": false,
        "startDate": "2020-09-10",
        "endDate": "2020-09-16"
    },
    {
        "gmtCreate": 1594626155000,
        "gmtUpdate": 1599190963000,
        "delete": false,
        "startDate": "2020-09-06",
        "endDate": "2020-09-16"
    },
    {
        "gmtCreate": 1594626155000,
        "gmtUpdate": 1599190963000,
        "delete": false,
        "startDate": "2020-10-13",
        "endDate": "2020-10-45"
    },
    {
        "gmtCreate": 1594626155000,
        "gmtUpdate": 1599190963000,
        "delete": false,
        "startDate": "2020-10-01",
        "endDate": "2020-10-04"
    },
    {
        "gmtCreate": 1594626155000,
        "gmtUpdate": 1599190963000,
        "delete": false,
        "startDate": "2020-10-04",
        "endDate": "2020-10-05"
    },
    {
        "gmtCreate": 1594626155000,
        "gmtUpdate": 1599190963000,
        "delete": false,
        "startDate": "2020-09-28",
        "endDate": "2020-10-01"
    },
]

const mergeData = function (dates) {
    dates.sort(function (a, b) { return +new Date(a.startDate) - +new Date(b.startDate) })
    const result = []
    dates.forEach(ele => {
        const index = result.findIndex(item => {
            return !(+new Date(item.startDate) > +new Date(ele.endDate) || +new Date(item.endDate) < +new Date(ele.startDate))
        })
        if (index > -1) {
            result[index].startDate = +new Date(result[index].startDate) < +new Date(ele.startDate) ? result[index].startDate : ele.startDate
            result[index].endDate = +new Date(result[index].endDate) > +new Date(ele.endDate) ? result[index].endDate : ele.endDate
        } else {
            result.push({ startDate: ele.startDate, endDate: ele.endDate })
        }
    });
    return result
}

mergeData(dates)

// [34, 23, 45, 22].sort((a, b) => a - b)