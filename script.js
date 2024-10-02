
    // 分頁切換功能
    document.querySelectorAll('.tab-btn').forEach(button => {
        button.addEventListener('click', function() {
            document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));

            this.classList.add('active');
            document.getElementById(this.getAttribute('data-tab')).classList.add('active');
        });
    });

    // Firebase 假設的更新代碼，需換成你實際的 Firebase 整合邏輯
    function updateTableWithFirebase() {
        // 模擬股票表格資料來自Firebase
        const stocksData = [
            { type: '科技股', name: 'XX公司', shares: 100, amount: 50000 },
            { type: '金融股', name: 'YY公司', shares: 50, amount: 25000 }
        ];

        const stocksBody = document.getElementById('stocks-body');
        stocksData.forEach(stock => {
            const row = `<tr>
                <td>${stock.type}</td>
                <td>${stock.name}</td>
                <td>${stock.shares}</td>
                <td>${stock.amount}</td>
            </tr>`;
            stocksBody.innerHTML += row;
        });

        // 模擬基金表格資料來自Firebase
        const fundsData = [
            { type: '股票型基金', name: 'ZZ基金', amount: 10000 },
            { type: '債券型基金', name: 'WW基金', amount: 15000 }
        ];

        const fundsBody = document.getElementById('funds-body');
        fundsData.forEach(fund => {
            const row = `<tr>
                <td>${fund.type}</td>
                <td>${fund.name}</td>
                <td>${fund.amount}</td>
            </tr>`;
            fundsBody.innerHTML += row;
        });

        // 模擬負債表格資料來自Firebase
        const liabilitiesData = [
            { type: '房貸', name: '住宅A', loanAmount: 2000000, term: 20, monthlyPayment: 10000, remainingTerms: 180 }
        ];

        const liabilitiesBody = document.getElementById('liabilities-body');
        liabilitiesData.forEach(debt => {
            const row = `<tr>
                <td>${debt.type}</td>
                <td>${debt.name}</td>
                <td>${debt.loanAmount}</td>
                <td>${debt.term}</td>
                <td>${debt.monthlyPayment}</td>
                <td>${debt.remainingTerms}</td>
            </tr>`;
            liabilitiesBody.innerHTML += row;
        });
    }

    // 假設已經從Firebase拿到資料
    updateTableWithFirebase();
