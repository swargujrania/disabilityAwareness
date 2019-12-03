
var WIDTH = 2500;
var HEIGHT = 2000;

//original data
d3.csv('data/education2018.csv').then(data => {

    // //clean data
    // educationData = data;
    // educationData.forEach(e => { delete e.Section; delete e.age; })
    // educationData.columns.splice(3, 2);

    // eduDataWithoutTotal = educationData.filter(e => e.educationLevel != "");
    // eduDataWithoutTotal.forEach(e => {
    //     e.numbers = +e.numbers;
    //     e.percentage = +e.percentage;
    // });
    // console.log(eduDataWithoutTotal);

    // // generate nestedData for US
    // var nestedData = d3.nest()
    //     .key(d => d.educationLevel)
    //     .key(d => d.disabilityType)
    //     .rollup(d => { return {'numbers': d3.sum(d, v => {return v.numbers}), 'percentage': d3.mean(d, v => {return v.percentage})} })
    //     .entries(eduDataWithoutTotal);
    // console.log(nestedData);

    // // generate nestedData for US by State
    // var nestedDataByState = d3.nest()
    // .key(d => d.state)
    // .key(d => d.disabilityType)
    // .key(d => d.educationLevel)
    // .rollup(d => { return {'numbers': d3.sum(d, (v) => { return v.numbers}), 'percentage': d3.mean(d, v => { return v.percentage}) } })
    // .entries(eduDataWithoutTotal);

    // downloadObjectAsJson(nestedData, 'nestedEdu2018');
});


//US education data in total
d3.json('data/nestedEdu2018.json').then(nestedData => {
    var usEduData = nestedData;
    console.log(usEduData);
})

//US education data by State
d3.json('data/nestedEduByState2018.json').then(nestedData => {
    usStateEduData = nestedData;
    console.log(usStateEduData);
})

function downloadObjectAsJson(exportObj, exportName) {
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", exportName + ".json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}