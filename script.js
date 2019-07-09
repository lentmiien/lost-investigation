let data = {
    entries: []
};

function AddEntry() {
    // Get input data
    var ordernumber = document.getElementById("ordernumber").value;
    var country = document.getElementById("country").value;
    var shippingmethod = document.getElementById("shippingmethod").value;
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
}

function Output() {
    document.getElementById("output").value = JSON.stringify(data);
}