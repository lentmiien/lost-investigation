let data = {
    entries: []
};
if (localStorage.hasOwnProperty("lost_data") == true) {
    data = JSON.parse(localStorage.getItem("lost_data"));
}
document.getElementById('total').innerHTML = 'Total entries: ' + data.entries.length;

let index = -1;
function NextUndone() {
    index++;
    if (index >= data.entries.length) {
        index = 0;
    }
    
    while(data.entries[index].enddate.length > 0) {
        index++;
        if (index >= data.entries.length) {
            index = -1;

            // Reset input fields
            document.getElementById("ordernumber").value = '';
            document.getElementById("country").value = '';
            document.getElementById("shippingmethod").value = '';
            document.getElementById("shippingdate").value = '';
            document.getElementById("jpresult").value = '';
            document.getElementById("where").value = '';
            document.getElementById("enddate").value = '';
            document.getElementById("notes").value = '';

            return;
        }
    }

    document.getElementById("ordernumber").value = data.entries[index].ordernumber;
    document.getElementById("country").value = data.entries[index].country;
    document.getElementById("shippingmethod").value = data.entries[index].shippingmethod;
    document.getElementById("shippingdate").value = data.entries[index].shippingdate;
    document.getElementById("jpresult").value = data.entries[index].jpresult;
    document.getElementById("where").value = data.entries[index].where;
    document.getElementById("enddate").value = data.entries[index].enddate;
    document.getElementById("notes").value = data.entries[index].notes;
}

function AddEntry() {
    // Get input data
    var ordernumber = document.getElementById("ordernumber").value;
    var country = document.getElementById("country").value.toLowerCase().split(',').join('');
    var shippingmethod = document.getElementById("shippingmethod").value.toLowerCase();
    var shippingdate = document.getElementById("shippingdate").value;
    var jpresult = document.getElementById("jpresult").value;
    var where = document.getElementById("where").value;
    var enddate = document.getElementById("enddate").value;
    var notes = document.getElementById("notes").value;

    // See if already exists
    let found = false;
    for(let i = 0; i < data.entries.length; i++) {
        if(data.entries[i].ordernumber === ordernumber) {
            found = true;
            // Update
            if (country.length > 0) { data.entries[i].country = country; }
            if (shippingmethod.length > 0) { data.entries[i].shippingmethod = shippingmethod; }
            if (shippingdate.length > 0) { data.entries[i].shippingdate = shippingdate; }
            if (jpresult.length > 0) { data.entries[i].jpresult = jpresult; }
            if (where.length > 0) { data.entries[i].where = where; }
            if (enddate.length > 0) { data.entries[i].enddate = enddate; }
            if (notes.length > 0) { data.entries[i].notes = notes; }
        }
    }

    // If not existing, add new
    if(found === false) {
        data.entries.push({
            ordernumber,
            country,
            shippingmethod,
            shippingdate,
            jpresult,
            where,
            enddate,
            notes
        });
    }

    // Reset input fields
    document.getElementById("ordernumber").value = '';
    document.getElementById("country").value = '';
    document.getElementById("shippingmethod").value = '';
    document.getElementById("shippingdate").value = '';
    document.getElementById("jpresult").value = '';
    document.getElementById("where").value = '';
    document.getElementById("enddate").value = '';
    document.getElementById("notes").value = '';

    // Update total entries
    document.getElementById('total').innerHTML = 'Total entries: ' + data.entries.length;
}

function BatchAdd() {
    let ordernumbers = document.getElementById("output").value.split('\n');
    document.getElementById("output").value = '';
    for(let i = 0; i < ordernumbers.length; i++) {
        let found = false;
        for (let j = 0; j < data.entries.length; j++) {
            if (data.entries[j].ordernumber === ordernumbers[i]) {
                found = true;
            }
        }

        // If not existing, add new
        if (found === false) {
            data.entries.push({
                ordernumber: ordernumbers[i],
                country: '',
                shippingmethod: '',
                shippingdate: '',
                jpresult: '',
                where: '',
                enddate: '',
                notes: ''
            });
        }
    }

    // Update total entries
    document.getElementById('total').innerHTML = 'Total entries: ' + data.entries.length;
}

function Output() {
    localStorage.setItem("lost_data", JSON.stringify(data));

    // Output as CSV in text area
    document.getElementById("output").value = 'ordernumber,country,shippingmethod,shippingdate,jpresult,where,enddate,notes\n';
    for(let i = 0; i < data.entries.length; i++) {
        document.getElementById("output").value += data.entries[i].ordernumber + ',' + data.entries[i].country + ',' + data.entries[i].shippingmethod + ',' + data.entries[i].shippingdate + ',' + data.entries[i].jpresult + ',' + data.entries[i].where + ',' + data.entries[i].enddate + ',' + data.entries[i].notes + '\n';
    }
}

function Analyze() {
    // Load shipping methods
    let shipping_methods = '';
    if (document.getElementById('ems').checked == true) { shipping_methods += 'ems,'; }
    if (document.getElementById('salsp').checked == true) { shipping_methods += 'sal registered,'; }
    if (document.getElementById('airsp').checked == true) { shipping_methods += 'air small packet,'; }
    if (document.getElementById('salparcel').checked == true) { shipping_methods += 'sal parcel,'; }
    if (document.getElementById('airparcel').checked == true) { shipping_methods += 'air parcel,'; }

    // Reports by month
    let output = '<table><tr><th>年</th>';
    for(let i = 1; i < 13; i++) { output += '<th>' + i + '月</th>'; }
    output += '</tr>';
    for(let year = 2017; year < 2020; year++) {
        output += '<tr><td>' + year + '</td>';
        for(let month = 1; month < 13; month++) {
            let s_str = year + '/' + (month < 10 ? '0' + month: month);
            let cnt = 0;
            let done_cnt = 0;
            for(let i = 0; i < data.entries.length; i++) {
                if(data.entries[i].shippingdate.indexOf(s_str) == 0) {
                    if (shipping_methods.indexOf(data.entries[i].shippingmethod) >= 0) {
                        cnt++;
                        if(data.entries[i].enddate.length > 0) {
                            done_cnt++;
                        }
                    }
                }
            }
            output += '<td>' + cnt + ' (' + done_cnt + ')</td>';
        }
        output += '</tr>';
    }
    output += '</table>';

    // Reports by country
    let output_data = {};
    for (let i = 0; i < data.entries.length; i++) {
        if (output_data.hasOwnProperty(data.entries[i].country) == false) {
            output_data[data.entries[i].country] = {
                total: 0,
                solved: 0,
                ems: { found: 0, compensation: 0 },
                salsp: { found: 0, compensation: 0 },
                asp: { found: 0, compensation: 0 },
                salparcel: { found: 0, compensation: 0 },
                airparcel: { found: 0, compensation: 0 }
            };
        }
        output_data[data.entries[i].country].total++;
        if (data.entries[i].enddate.length > 0) {
            output_data[data.entries[i].country].solved++;
            if (data.entries[i].shippingmethod.indexOf('ems') == 0) {
                output_data[data.entries[i].country].ems[data.entries[i].jpresult]++;
            }
            else if (data.entries[i].shippingmethod.indexOf('sal registered') == 0) {
                output_data[data.entries[i].country].salsp[data.entries[i].jpresult]++;
            }
            else if (data.entries[i].shippingmethod.indexOf('air small packet') == 0) {
                output_data[data.entries[i].country].asp[data.entries[i].jpresult]++;
            }
            else if (data.entries[i].shippingmethod.indexOf('sal parcel') == 0) {
                output_data[data.entries[i].country].salparcel[data.entries[i].jpresult]++;
            }
            else if (data.entries[i].shippingmethod.indexOf('air parcel') == 0) {
                output_data[data.entries[i].country].airparcel[data.entries[i].jpresult]++;
            }
        }
    }
    output += '<table><tr><th>国</th>';
    output += '<th class="col">申告件数</th><th class="col">解決件数</th><th>EMS</th><th>SAL SP</th><th>ASP</th><th>SAL Parcel</th><th>Air Parcel</th>';
    output += '</tr>';
    for(let e in output_data) {
        output += '<tr><td>' + e + '</td>';
        output += '<td class="col">' + output_data[e].total + '</td>';
        output += '<td class="col">' + output_data[e].solved + '</td>';
        output += '<td>' + output_data[e].ems.found + ' / ' + output_data[e].ems.compensation + '</td>';
        output += '<td>' + output_data[e].salsp.found + ' / ' + output_data[e].salsp.compensation + '</td>';
        output += '<td>' + output_data[e].asp.found + ' / ' + output_data[e].asp.compensation + '</td>';
        output += '<td>' + output_data[e].salparcel.found + ' / ' + output_data[e].salparcel.compensation + '</td>';
        output += '<td>' + output_data[e].airparcel.found + ' / ' + output_data[e].airparcel.compensation + '</td>';
        output += '</tr>';
    }
    output += '</table>';

    document.getElementById('dataoutput').innerHTML = output;
}

function ShowInput() {
	document.getElementById('analyze').style.display = 'none';
	document.getElementById('input').style.display = 'block';
}
function ShowAnalyze() {
    Analyze();
	document.getElementById('analyze').style.display = 'block';
	document.getElementById('input').style.display = 'none';
}