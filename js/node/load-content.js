function loadJSONdata(){
    $.getJSON('../conf/ui.conf', function(data) {
        //token check
        var tokens = document.cookie.split(".");
        if (tokens.length != 3){
            document.cookie = "";
        }
        if(document.cookie == ""){
            document.location.href='login.html';
        }
        try {payload = JSON.parse(atob(tokens[1]));}
        catch(err) {document.cookie = ""; document.location.href='login.html';}

        //login button
                document.getElementById('dropdownMenuUser').innerHTML = document.getElementById('dropdownMenuUser').innerHTML + payload.user
        document.getElementById('loger-user-name').value = payload.user
        
        var ipLoad = document.getElementById('ip-master');
        ipLoad.value = data.master.ip;
        var portLoad = document.getElementById('port-master');
        portLoad.value = data.master.port;
        LoadFileLastLines();
        loadTitleJSONdata();
    });
}
var payload = "";
loadJSONdata();


function LoadFileLastLines() {
    document.getElementById('progressBar-options-div').style.display = "block";
    document.getElementById('progressBar-options').style.display = "block";

    var url = new URL(window.location.href);
    var uuid = url.searchParams.get("uuid");
    var line = url.searchParams.get("line");
    var path = url.searchParams.get("path");

    // if (line != "none"){
    //     document.getElementById('node-config-title').innerHTML = "Load last "+line+" lines from file: "+path;
    // }else{
    //     document.getElementById('node-config-title').innerHTML = "Load file: "+path;
    // }
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/node/wazuh/loadLines';

    var jsonWazuhFilePath = {}
    jsonWazuhFilePath["uuid"] = uuid;
    jsonWazuhFilePath["number"] = line;
    jsonWazuhFilePath["path"] = path;
    var dataJSON = JSON.stringify(jsonWazuhFilePath);

    axios({
        method: 'put',
        url: nodeurl,
        timeout: 30000,
            headers:{
                'token': document.cookie,
                'user': payload.user
                
            },
        data: dataJSON
    })
        .then(function (response) {
        document.getElementById('progressBar-options-div').style.display = "none";
        document.getElementById('progressBar-options').style.display = "none";
        if(response.data.token == "none"){document.cookie=""; document.location.href='login.html';}
        if(response.data.permissions == "none"){
            PrivilegesMessage();              
        }else{   
        //    console.log(JSON.stringify(response.data))
        const tableHtml = document.getElementById("table1");
        // const url = 'http://localhost:3000/api';
        
        // Tạo bảng HTML
        let tableContent = `
            <thead>
                <tr>
                    
                    <th>Id</th>
                    <th>Action</th>
                    <th>Category</th>
                    <th>Rev</th>
                    <th>Severity</th>
                    <th>Signature</th>
                    <th>SignatureId</th>
                    <th>Times</th>
                    <th>EventType</th>
                    <th>ContinentCode</th>
                    <th>CountryCode</th>
                    <th>CountryName</th>
                    <th>InIface</th>
                    <th>MacAddress</th>
                    <th>Proto</th>
                    <th>SrcIp</th>
                    <th>Timestamp</th>
                </tr>
            </thead>
            <tbody>
        `;

        response.data.forEach(item => {
            tableContent += `
                <tr>
                    <td>${item.Id}</td>
                    <td>${item.Action}</td>
                    <td>${item.Category}</td>
                    <td>${item.Rev}</td>
                    <td>${item.Severity}</td>
                    <td>${item.Signature}</td>
                    <td>${item.SignatureId}</td>
                    <td>${item.Times}</td>
                    <td>${item.EventType}</td>
                    <td>${item.ContinentCode}</td>
                    <td>${item.CountryCode}</td>
                    <td>${item.CountryName}</td>
                    <td>${item.InIface}</td>
                    <td>${item.MacAddress}</td>
                    <td>${item.Proto}</td>
                    <td>${item.SrcIp}</td>
                    <td>${item.Timestamp}</td>
                </tr>
            `;
        });

        tableContent += '</tbody>';
        tableHtml.innerHTML = tableContent;
        // const table1 = new DataTable('#table1');
        }
        })
        .catch(function (error) {
            document.getElementById('progressBar-options-div').style.display = "none";
            document.getElementById('progressBar-options').style.display = "none";
            $('html,body').scrollTop(0);
            var alert = document.getElementById('floating-alert');
            alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
                '<strong>Error: </strong>'+error+'.'+
                '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                    '<span aria-hidden="true">&times;</span>'+
                '</button>'+
            '</div>';
            setTimeout(function() {$(".alert").alert('close')}, 30000);
        });
    return false;
}

function saveCurrentContent() {
    document.getElementById('progressBar-options-div').style.display = "block";
    document.getElementById('progressBar-options').style.display = "block";
    var url = new URL(window.location.href);
    var uuid = url.searchParams.get("uuid");
    var path = url.searchParams.get("path");
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var contentFile = document.getElementById('inputTextTailLines').value;
    var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/node/wazuh/saveFileContentWazuh';

    var jsonWazuhFile = {}
    jsonWazuhFile["uuid"] = uuid;
    jsonWazuhFile["path"] = path;
    jsonWazuhFile["content"] = contentFile;
    var dataJSON = JSON.stringify(jsonWazuhFile);

    axios({
        method: 'put',
        url: nodeurl,
        timeout: 30000,
            headers:{
                'token': document.cookie,
                'user': payload.user
                
            },
        data: dataJSON
    })
    .then(function (response) {
        document.getElementById('progressBar-options-div').style.display = "none";
        document.getElementById('progressBar-options').style.display = "none";
        if(response.data.token == "none"){document.cookie=""; document.location.href='login.html';}
        if(response.data.permissions == "none"){
            PrivilegesMessage();              
        }else{   
            if(response.data.ack == "false"){
                $('html,body').scrollTop(0);
                var alert = document.getElementById('floating-alert');
                alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
                    '<strong>Error! </strong>'+response.data.error+'.'+
                    '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                        '<span aria-hidden="true">&times;</span>'+
                    '</button>'+
                '</div>';
                setTimeout(function() {$(".alert").alert('close')}, 30000);
            }else{
                $('html,body').scrollTop(0);
                var alert = document.getElementById('floating-alert');
                alert.innerHTML = '<div class="alert alert-success alert-dismissible fade show">'+
                    '<strong>Success! </strong>File modified successfully.'+
                    '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                        '<span aria-hidden="true">&times;</span>'+
                    '</button>'+
                '</div>';
                setTimeout(function() {$(".alert").alert('close')}, 30000);
    
                LoadFileLastLines();
            }
        }
    })
    .catch(function (error) {
        document.getElementById('progressBar-options-div').style.display = "none";
        document.getElementById('progressBar-options').style.display = "none";
        $('html,body').scrollTop(0);
        var alert = document.getElementById('floating-alert');
        alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
            '<strong>Error! </strong>'+error+'.'+
            '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                '<span aria-hidden="true">&times;</span>'+
            '</button>'+
        '</div>';
        setTimeout(function() {$(".alert").alert('close')}, 30000);
    });
}

function closeCurrentFile(){
    window.history.back();
}