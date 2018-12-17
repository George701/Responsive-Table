/*
==================================================
                    Globals
==================================================
*/
let ajax = new XMLHttpRequest();
let method = "POST";
let url = "dataTable.php";
let _TABLE_DATA = [];
let data = [];
let current_state = "Regular";
let timeVars = [];

let action_msge = [
    "Action № 1",
    "Action № 2",
    "Action № 3",
    "Action № 4",
    "Action № 5"
];

let message_msge = [
    "Message № 1",
    "Message № 2",
    "Message № 3",
    "Message № 4",
    "Message № 5",
    "Message № 6",
    "Message № 7",
    "Message № 8",
    "Message № 9",
    "Message № 10"
];

let status_msge = [
    "OK",
    "Alert",
    "Danger",
    "Error",
];

/*
==================================================
                Current Date
==================================================
*/

let currentDate = new Date();

let c_day = currentDate.getDate();
let c_month = currentDate.getMonth(); //Be careful! January is 0 not 1
let c_year = currentDate.getFullYear();

if(c_day < 10){
    c_day = "0"+c_day;
} else if(c_month < 10){
    c_month = "0"+c_month;
}
timeVars[0] = c_year + "-" +(c_month + 1) + "-" + c_day;

/*
==================================================
                Past Date
==================================================
*/

let pastDate = new Date(new Date().setDate(new Date().getDate()-7));

let p_day = pastDate.getDate();
let p_month = pastDate.getMonth(); //Be careful! January is 0 not 1
let p_year = pastDate.getFullYear();

if(p_day < 10){
    p_day = "0"+p_day;
} else if(p_month < 10){
    p_month = "0"+p_month;
}
timeVars[1]  = p_year + "-" +(p_month + 1) + "-" + p_day;

/*
==================================================
                Insert with no refresh
==================================================
*/

$("form").submit(function(e){
    e.preventDefault();

    $.post(
        'insert.php',
        // $("form").attr('action'),
        // $("form:input").serializeArray(),
        {
            name:$("#name").val(),
            action:$("#action").val(),
            message:$("#message").val(),
            status:$("#status").val()
        }
        ,

        function(result){
            if(result === "success"){
                $("#result").html("Values inserted successfully");
            }else{
                $("#result").html("Error");
            }
        }
    );
});

/*
==================================================
                Main
==================================================
*/
dataToIn("dateFrom", "dateUntil", timeVars[0], timeVars[1]);
let last_id = 0;
let readyState = true;
let params;
let primordial = 0;

setInterval(function(){
    console.log(_TABLE_DATA);
    console.log(primordial);
    if(readyState === true){
        readyState = false;

        try{
            last_id = _TABLE_DATA[0]['id'];
            console.log("Trying to make val to last_id: "+last_id);
        }catch{
            console.log("Ooops");
        }

        params = "last_id="+last_id;

        ajax.open(method, url, true);

        ajax.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

        if(last_id === 0){
            console.log("Undefined");
            ajax.send();
        }else{
            console.log("Defined");
            last_id = parseInt(last_id);
            ajax.send(params);
        }
        ajax.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                console.log(current_state);

                let raw_array = JSON.parse(this.responseText);
                console.log(raw_array);

                if (raw_array.length !== 0) {

                    if (primordial !== 0) {
                        for (let i = 0; i < raw_array.length ; i++) {
                            _TABLE_DATA.unshift(raw_array[i]);
                        }
                    } else {

                        for (let i = 0; i < raw_array.length; i++) {
                            _TABLE_DATA.push(raw_array[i]);
                        }
                        primordial++;
                    }
                }
                data = limitData(_TABLE_DATA);

                drawAndCheck(data, "dataTable");
            }
            readyState = true;
        };
    }

},1000);


/*
==================================================
                Table Constructor
==================================================
*/
function buildTable(arr, id){
    let html = "";
    // arr = arr.reverse();


    for (let i = 0; i < arr.length; i++) {
        let column_One = arr[i].Time;
        let column_Two = arr[i].Name;
        let column_Three = arr[i].Action;
        let column_Four = arr[i].Message;
        let column_Five = arr[i].Status;



        html += "<tr>";
        html += "<td>" + column_One + "</td>";
        html += "<td>" + column_Two + "</td>";
        html += "<td>" + actionMsg(column_Three) + "</td>";
        html += "<td>" + messageMsg(column_Four) + "</td>";
        html += statusMsg(column_Five);
        html += "</tr>";
    }

    document.getElementById(id).innerHTML = html;
}

/*
==================================================
            User Friendly data output
==================================================
*/
function actionMsg(attr){
    switch(attr){
        case '0':
            return action_msge[0];
        case '1':
            return action_msge[1];
        case '2':
            return action_msge[2];
        case '3':
            return action_msge[3];
        case '4':
            return action_msge[4];
        default:
            return "Error";
    }
}

function messageMsg(attr){
    switch(attr){
        case '0':
            return message_msge[0];
        case '1':
            return message_msge[1];
        case '2':
            return message_msge[2];
        case '3':
            return message_msge[3];
        case '4':
            return message_msge[4];
        case '5':
            return message_msge[5];
        case '6':
            return message_msge[6];
        case '7':
            return message_msge[7];
        case '8':
            return message_msge[8];
        case '9':
            return message_msge[9];
        default:
            return "Error";
    }
}

function statusMsg(attr){
    let str = "";
    switch(attr){
        case '0':
            str += "<td class='ok txt-td-decor'> " + status_msge[0];
            break;
        case '1':
            str += "<td class='warning txt-td-decor'> " + status_msge[1];
            break;
        case '2':
            str += "<td class='danger txt-td-decor'> " + status_msge[2];
            break;
        case '3':
            str += "<td class='eer txt-td-decor'> " + status_msge[3];
            break;
        default:
            str += "<td> Error";
    }

    str += "</td>";
    return str;
}

/*
==================================================
        Make and array based on downloaded
==================================================
*/

function buildNewArray(old_arr, index){
    let temp_arr = [];
    for(let i = 0; i< old_arr.length; i++){
        if(old_arr[i]["Status"] === index){
            temp_arr.push(old_arr[i]);
        }
    }
    // temp_arr = temp_arr.reverse();
    return temp_arr;
}

/*
==================================================
        Select Function Rebuild table
==================================================
*/

function changeState(){
    let selected_state = document.getElementById('selectState').value;

    switch(selected_state){
        case '0':
            buildTable(buildNewArray(data, '0'), "dataTable");
            current_state = "Success";
            break;
        case '1':
            buildTable(buildNewArray(data, '1'), "dataTable");
            current_state = "Warning";
            break;
        case '2':
            buildTable(buildNewArray(data, '2'), "dataTable");
            current_state = "Danger";
            break;
        case '3':
            buildTable(buildNewArray(data, '3'), "dataTable");
            current_state = "Error";
            break;
        default:
            buildTable(data, "dataTable");
            current_state = "Regular";
    }
};

function drawAndCheck(arr, id){
    let express_status = arr[0]['Status'];
    if(current_state === 'Success' && express_status !== '2'){
        console.log("Hello form success");
        buildTable(buildNewArray(arr, '0'), id);
    } else if(current_state === 'Warning' && express_status !== '2'){
        console.log("Hello form warning");
        buildTable(buildNewArray(arr, '1'), id);
    }else if(current_state === 'Danger' && express_status !== '2'){
        console.log("Hello form danger");
        buildTable(buildNewArray(arr, '2'), id);
    }else if(current_state === 'Error' && express_status !== '2'){
        console.log("Hello form error");
        buildTable(buildNewArray(arr, '3'), id);
    }else{
        buildTable(arr, id);
        current_state = 'Regular';
        document.getElementById('selectState').value = 'default';
    }
}


/*
==================================================
        Put the actual data to date inputs
==================================================
*/

function convertForInput(x){
    // console.log(x);
    x = String(x);
    x = x.slice(0,10);
    x = x.split("/").reverse().join("-");
    return x;
}

function dateInput(idFrom, val){
    val = convertForInput(val);
    document.getElementById(idFrom).value = val;
}

function dataToIn(id_1, id_2, var1, var2){
    dateInput(id_1, var1);
    dateInput(id_2, var2);
}


/*
==================================================
                 Change by date
==================================================
*/

function calendarHandler(){

    timeVars[0] = document.getElementById("dateFrom").value;
    timeVars[1] = document.getElementById("dateUntil").value;

    // status = 1;
    return [timeVars[0], timeVars[1]];
}

function limitData(arr){
    let temp_arr = [];

    for(let i = 0; i < arr.length; i++){
        let date_val = convertForInput(arr[i]['Time']);
        if(date_val <= timeVars[0] && date_val >= timeVars[1]){
            temp_arr.push(arr[i]);
        }
    }

    return temp_arr;

}