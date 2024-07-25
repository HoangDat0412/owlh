function loadJSONdata() {
    $.getJSON('../conf/ui.conf', function (data) {
        //token check
        var tokens = document.cookie.split(".");
        if (tokens.length != 3) {
            document.cookie = "";
        }
        if (document.cookie == "") {
            document.location.href = 'login.html';
        }
        try { payload = JSON.parse(atob(tokens[1])); }
        catch (err) { document.cookie = ""; document.location.href = 'login.html'; }

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
        headers: {
            'token': document.cookie,
            'user': payload.user

        },
        data: dataJSON
    })
        .then(function (response) {
            document.getElementById('progressBar-options-div').style.display = "none";
            document.getElementById('progressBar-options').style.display = "none";
            if (response.data.token == "none") { document.cookie = ""; document.location.href = 'login.html'; }
            if (response.data.permissions == "none") {
                PrivilegesMessage();
            } else {
                //    console.log(JSON.stringify(response.data))
                
                const tableHtml = document.getElementById("table1");
                const data = [
                    {
                        "Id": 1,
                        "Action": "allowed",
                        "Category": "Potentially Bad Traffic",
                        "Rev": 1,
                        "Severity": 8,
                        "Signature": "OwlH HWADD - new mac detected - fa:16:3e:87:3e:2f",
                        "SignatureId": 1150001,
                        "Times": 1,
                        "EventType": "alert",
                        "ContinentCode": "AS",
                        "CountryCode": "VN",
                        "CountryName": "Vietnam",
                        "InIface": "enp0s3",
                        "MacAddress": "fa:16:3e:87:3e:2f",
                        "Proto": "ARP",
                        "SrcIp": "171.254.92.97",
                        "Timestamp": "2024-07-03T10:54:23.45477218+07:00",
                        "id": "0311"
                    },
                    {
                        "Id": 2,
                        "Action": "allowed",
                        "Category": "Potentially Bad Traffic",
                        "Rev": 1,
                        "Severity": 6,
                        "Signature": "OwlH HWADD - new mac detected - fa:16:3e:9f:f4:e4",
                        "SignatureId": 1150001,
                        "Times": 5,
                        "EventType": "alert",
                        "ContinentCode": "AS",
                        "CountryCode": "TH",
                        "CountryName": "Thailand",
                        "InIface": "enp0s3",
                        "MacAddress": "fa:16:3e:9f:f4:e4",
                        "Proto": "ARP",
                        "SrcIp": "171.254.92.255",
                        "Timestamp": "2024-07-03T10:54:56.846779248+07:00",
                        "id": "e4ab"
                    },
                    {
                        "Id": 3,
                        "Action": "allowed",
                        "Category": "Potentially Bad Traffic",
                        "Rev": 1,
                        "Severity": 3,
                        "Signature": "OwlH HWADD - new mac detected - 20:20:00:00:00:aa",
                        "SignatureId": 1150001,
                        "Times": 4,
                        "EventType": "alert",
                        "ContinentCode": "AS",
                        "CountryCode": "LA",
                        "CountryName": "Laos",
                        "InIface": "enp0s3",
                        "MacAddress": "20:20:00:00:00:aa",
                        "Proto": "ARP",
                        "SrcIp": "171.254.95.254",
                        "Timestamp": "2024-07-03T11:41:30.270841095+07:00",
                        "id": "82b9"
                    }
                ]
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

                data.forEach(item => {
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
                const table1 = new DataTable('#table1');
                const popup = document.getElementById("filterPopup");
                const btn = document.getElementById("filterBtn");
                const span = document.getElementsByClassName("close")[0];

                btn.onclick = function () {
                    popup.style.display = "block";
                };

                span.onclick = function () {
                    popup.style.display = "none";
                };

                window.onclick = function (event) {
                    if (event.target == popup) {
                        popup.style.display = "none";
                    }
                };
// Thêm filter mới
                const addFilterBtn = document.getElementById("addFilterBtn");
                const filterContainer = document.getElementById("filterContainer");
    
                addFilterBtn.onclick = function() {
                    const filterRow = document.createElement("div");
                    filterRow.className = "filter-options";
    
                    filterRow.innerHTML = `
                        <select class="filter-column">
                            <option value="">-- Select option --</option>
                            <option value="Id">Id</option>
                            <option value="Action">Action</option>
                            <option value="Category">Category</option>
                            <option value="Rev">Rev</option>
                            <option value="Severity">Severity</option>
                            <option value="Signature">Signature</option>
                            <option value="Times">Times</option>
                            <option value="EventType">EventType</option>
                            <option value="ContinentCode">ContinentCode</option>
                            <option value="CountryCode">CountryCode</option>
                            <option value="CountryName">CountryName</option>
                            <option value="InIface">InIface</option>
                            <option value="MacAddress">MacAddress</option>
                            <option value="Proto">Proto</option>
                            <option value="SrcIp">SrcIp</option>
                            <option value="Timestamp">Timestamp</option>
                        </select>
    
                        <select class="filter-operator">
                            <option value="">-- Select Operator --</option>
                            <option value="contains">Contains</option>
                            <option value="does-not-contain">Does not contain</option>
                            <option value="is">Is</option>
                            <option value="is-not">Is not</option>
                            <option value="starts-with">Starts with</option>
                            <option value="ends-with">Ends with</option>
                            <option value="is-empty">Is empty</option>
                            <option value="is-not-empty">Is not empty</option>
                        </select>
    
                        <input type="text" class="filter-value" placeholder="Type to filter ...">
                        <button class="remove-filter" style="padding-left: 16px; padding-right: 16px">&times;</button>
                    `;
                    
                    filterRow.querySelector('.filter-value').addEventListener('input', applyFilters);
                    filterRow.querySelector('.filter-column').addEventListener('change', applyFilters);
                    filterRow.querySelector('.filter-operator').addEventListener('change', applyFilters);
                    filterContainer.appendChild(filterRow);
    
                    // Thêm sự kiện cho nút xóa filter
                    filterRow.querySelector('.remove-filter').onclick = function() {
                        filterContainer.removeChild(filterRow);
                        applyFilters(); // Cập nhật bảng khi xóa bộ lọc
                    };
                };

                // Áp dụng các filter
                function applyFilters() {
                    const filters = Array.from(document.querySelectorAll('.filter-options')).map(filter => {
                        return {
                            column: filter.querySelector('.filter-column').value,
                            operator: filter.querySelector('.filter-operator').value,
                            value: filter.querySelector('.filter-value').value
                        };
                    }).filter(filter => filter.column && filter.operator);

                    table1.columns().every(function () {
                        const column = this;
                        const filter = filters.find(f => f.column === column.header().textContent.trim());

                        if (filter) {
                            switch (filter.operator) {
                                case 'contains':
                                    column.search(filter.value, true, false).draw();
                                    break;
                                case 'does-not-contain':
                                    column.search(`^(?!.*${filter.value}).*`, true, false).draw();
                                    break;
                                case 'is':
                                    column.search(`^${filter.value}$`, true, false).draw();
                                    break;
                                case 'is-not':
                                    column.search(`^(?!${filter.value}$).*$`, true, false).draw();
                                    break;
                                case 'starts-with':
                                    column.search(`^${filter.value}`, true, false).draw();
                                    break;
                                case 'ends-with':
                                    column.search(`${filter.value}$`, true, false).draw();
                                    break;
                                case 'is-empty':
                                    column.search('^$', true, false).draw();
                                    break;
                                case 'is-not-empty':
                                    column.search('^(?!$).+', true, false).draw();
                                    break;
                            }
                        } else {
                            column.search('').draw();
                        }
                    });
                }
                // Khi người dùng thay đổi filter
                document.getElementById("filterContainer").addEventListener('change', applyFilters);
                document.getElementById("filterContainer").addEventListener('input', applyFilters);
            }
        })
        .catch(function (error) {
            document.getElementById('progressBar-options-div').style.display = "none";
            document.getElementById('progressBar-options').style.display = "none";
            $('html,body').scrollTop(0);
            var alert = document.getElementById('floating-alert');
            alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">' +
                '<strong>Error: </strong>' + error + '.' +
                '<button type="button" class="close" data-dismiss="alert" aria-label="Close">' +
                '<span aria-hidden="true">&times;</span>' +
                '</button>' +
                '</div>';
            setTimeout(function () { $(".alert").alert('close') }, 30000);
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
        headers: {
            'token': document.cookie,
            'user': payload.user

        },
        data: dataJSON
    })
        .then(function (response) {
            document.getElementById('progressBar-options-div').style.display = "none";
            document.getElementById('progressBar-options').style.display = "none";
            if (response.data.token == "none") { document.cookie = ""; document.location.href = 'login.html'; }
            if (response.data.permissions == "none") {
                PrivilegesMessage();
            } else {
                if (response.data.ack == "false") {
                    $('html,body').scrollTop(0);
                    var alert = document.getElementById('floating-alert');
                    alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">' +
                        '<strong>Error! </strong>' + response.data.error + '.' +
                        '<button type="button" class="close" data-dismiss="alert" aria-label="Close">' +
                        '<span aria-hidden="true">&times;</span>' +
                        '</button>' +
                        '</div>';
                    setTimeout(function () { $(".alert").alert('close') }, 30000);
                } else {
                    $('html,body').scrollTop(0);
                    var alert = document.getElementById('floating-alert');
                    alert.innerHTML = '<div class="alert alert-success alert-dismissible fade show">' +
                        '<strong>Success! </strong>File modified successfully.' +
                        '<button type="button" class="close" data-dismiss="alert" aria-label="Close">' +
                        '<span aria-hidden="true">&times;</span>' +
                        '</button>' +
                        '</div>';
                    setTimeout(function () { $(".alert").alert('close') }, 30000);

                    LoadFileLastLines();
                }
            }
        })
        .catch(function (error) {
            document.getElementById('progressBar-options-div').style.display = "none";
            document.getElementById('progressBar-options').style.display = "none";
            $('html,body').scrollTop(0);
            var alert = document.getElementById('floating-alert');
            alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">' +
                '<strong>Error! </strong>' + error + '.' +
                '<button type="button" class="close" data-dismiss="alert" aria-label="Close">' +
                '<span aria-hidden="true">&times;</span>' +
                '</button>' +
                '</div>';
            setTimeout(function () { $(".alert").alert('close') }, 30000);
        });
}

function closeCurrentFile() {
    window.history.back();
}