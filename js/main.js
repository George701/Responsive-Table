/*
==================================================
                    Globals
==================================================
*/
let ajax = new XMLHttpRequest();
let method = "GET";
let url = "dataTable.php";
let test = 0;
let cur_length = 0;
let test_data = [];
let data = [];
let current_state = "Regular";

let status = 0;
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

timeVars[0] = c_year + "-" +(c_month + 1) + "-" + c_day;

/*
==================================================
                Past Date
==================================================
*/

let pastDate = new Date(new Date().setDate(new Date().getDate()-1));

let p_day = pastDate.getDate();
let p_month = pastDate.getMonth(); //Be careful! January is 0 not 1
let p_year = pastDate.getFullYear();

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

setInterval(checkData, 1000);

function checkData(){

    ajax.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            test_data = JSON.parse(this.responseText);
        }
        return test_data;
    };

    ajax.open(method, url, true);
    ajax.send();

    cur_length = test_data.length;

    if(test<cur_length || status===1) {

        data = limitData(test_data, timeVars[0], timeVars[1]);

        drawAndCheck(data, "dataTable");

        test = cur_length;
        status = 0;
    }
}

/*
==================================================
                Table Constructor
==================================================
*/
function buildTable(arr, id){
    let html = "";
    arr = arr.reverse();


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

    return temp_arr;
}

/*
==================================================
        Select Function Rebuild table
==================================================
*/

let changeState = function(){
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
    let expres_status = arr[parseInt(arr.length) - 1]['Status'];
    if(current_state === 'Success' && expres_status !== '2'){
        buildTable(buildNewArray(arr, '0'), id);
    } else if(current_state === 'Warning' && expres_status !== '2'){
        buildTable(buildNewArray(arr, '1'), id);
    }else if(current_state === 'Danger' && expres_status !== '2'){
        buildTable(buildNewArray(arr, '2'), id);
    }else if(current_state === 'Error' && expres_status !== '2'){
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

    status = 1;
    return [timeVars[0], timeVars[1]];
}

function limitData(arr, time1, time2){

    let temp_arr = [];

    // console.log(time1 + " - " + time2);

    for(let i = 0; i < arr.length; i++){
        let date_val = convertForInput(arr[i]['Time']);
        if(date_val <= time1 && date_val >= time2){
            temp_arr.push(arr[i]);
        }
    }

    return temp_arr;

}

