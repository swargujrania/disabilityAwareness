//data processing

//create state_latlong data
d3.json("state_boundaries.json").then(data => {
    // clean latlong Data
    for (var prop in data) {
        var newKey = data[prop]["name"];
        replaceKeys(data, prop, newKey);
        delete data[newKey]["name"];
    }
    downloadObjectAsJson(data, "states_latlong");
});

//add lat long limits to census data
d3.json("states_latlong.json").then(latLongData => {
    d3.csv("censusTotal.csv").then(censusData => {
        cData = censusData;
        lData = latLongData;
        console.log(censusData);
        for (var state in latLongData) {
            cData.filter(c => c["state"] == state).map(cd => {
                var newPro = {
                    "min_lat": lData[state]["min_lat"],
                    "max_lat": lData[state]["max_lat"],
                    "min_lng": lData[state]["min_lng"],
                    "max_lng": lData[state]["max_lng"],
                }
                return Object.assign(cd, newPro);
            })
            cData.columns.push("min_lat");
            cData.columns.push("max_lat");
            cData.columns.push("min_lng");
            cData.columns.push("max_lng");
        }
        console.log(cData);
        downloadObjectAsJson(cData, "censusDataWithLatLong");
    })
});

//generate coordinates for each hexagon
d3.json("censusDataWithLatLong.json").then(data => {
    cData = data;
    censusUnitData = []
    cData.forEach(d => {
        //var count = Math.ceil(+d["total_population"] / PEOPLE_UNIT);
        
        var withDisabilityCount = Math.ceil(+d["with_a_disability"] / PEOPLE_UNIT);
        var noDisabilityCount = Math.ceil(+d["no_disability"] / PEOPLE_UNIT);
        var count = withDisabilityCount + noDisabilityCount;

        var rectLen = (d["max_lng"] - d["min_lng"]);
        var rectWid = (d["max_lat"] - d["min_lat"]);

        var side = Math.sqrt((rectLen * rectWid) / count);
        
        var countLen = Math.ceil(rectLen / side);
        var countWid = Math.ceil(rectWid / side);

        for (var i = 0; i < countWid; i++) {
            for(var j=0; j< countLen; j++){
                censusUnitData.push({
                    "year": d["year"],
                    "state": d["state"],
                    "id": (countLen * i) + j,
                    "unit": PEOPLE_UNIT,
                    "status": "",
                    "lat": d["min_lat"] + ((i + 0.5) * side),
                    "lng": d["min_lng"] + ((j+0.5) * side),
                });
            }
        }

        //with disability
        for (var i = 0; i < withDisabilityCount; i++) {
            censusUnitData.find(u => u["year"] == d["year"] && u["state"] == d["state"] && u["id"] == i).status = disabilityStatus.WITH;
        }
        //no disability
        for (var j = i; j < i + noDisabilityCount; j++) {
            censusUnitData.find(u => u["year"] == d["year"] && u["state"] == d["state"] && u["id"] == j).status = disabilityStatus.NO;
        }

    });

    censusUnitData = censusUnitData.filter(c => c["status"] != "");
    console.log(censusUnitData);
    
    downloadObjectAsJson(censusUnitData.filter(c => c["year"] == "2018"), "unitDataWithLatLong2018");
    downloadObjectAsJson(censusUnitData.filter(c => c["year"] == "2016"), "unitDataWithLatLong2016");
    downloadObjectAsJson(censusUnitData.filter(c => c["year"] == "2014"), "unitDataWithLatLong2014");
    downloadObjectAsJson(censusUnitData.filter(c => c["year"] == "2012"), "unitDataWithLatLong2012");
    downloadObjectAsJson(censusUnitData.filter(c => c["year"] == "2010"), "unitDataWithLatLong2010");
});



const PEOPLE_UNIT = 50000;

let disabilityStatus = {
    "WITH": "with_a_disability",
    "NO": "no_disability"
}


function replaceKeys(o, old_key, new_key) {
    if (old_key !== new_key) {
        Object.defineProperty(o, new_key,
            Object.getOwnPropertyDescriptor(o, old_key));
        delete o[old_key];
    }

}

function downloadObjectAsJson(exportObj, exportName) {
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", exportName + ".json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}
