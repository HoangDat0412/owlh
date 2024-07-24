document.addEventListener("DOMContentLoaded", function() {
    // URL của file JSON
    const url = 'http://localhost:3000/api';

    // Lấy dữ liệu từ file JSON và render ra bảng
    fetch(url)
        .then(response => response.json())
        .then(data => {
            // Lấy phần tử table
            const tableHtml = document.getElementById("table1");

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

            // Khởi tạo DataTable
            const table1 = new DataTable('#table1');

            table1.on('click', 'tbody tr', (e) => {
                let classList = e.currentTarget.classList;

                if (classList.contains('selected')) {
                    classList.remove('selected');
                } else {
                    table1.rows('.selected').nodes().each((row) => row.classList.remove('selected'));
                    classList.add('selected');
                }
            });

            // Mở và đóng modal
            const popup = document.getElementById("filterPopup");
            const btn = document.getElementById("filterBtn");
            const span = document.getElementsByClassName("close")[0];

            btn.onclick = function() {
                popup.style.display = "block";
            };

            span.onclick = function() {
                popup.style.display = "none";
            };

            window.onclick = function(event) {
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
        })
        .catch(error => console.error('Error fetching data:', error));


       
    });
const table_node_monitor = new DataTable('#table_node_monitor')

