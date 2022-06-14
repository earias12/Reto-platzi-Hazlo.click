App = {
    contracts: {},
    init: async () => {
        console.log('Loaded')
        await App.loadEther()
        await App.loadAccount()
        await App.loadContracts()
        App.render()
        await App.renderTasks()
    },
    loadEther: async () => {
        if (window.ethereum) {
            console.log('ethereum exist')
            App.web3Provider = window.ethereum
            await window.ethereum.request({ method: 'eth_requestAccounts' })

        } else {
            console.log('No ethereum browser is installed.')
        }

    },

    loadAccount: async () => {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
        //console.log(accounts)
        App.account = accounts[0]

    },

    loadContracts: async () => {
        const res = await fetch("TasksContract.json")
        const tasksContractJSON = await res.json()

        App.contracts.tasksContract = TruffleContract(tasksContractJSON)

        App.contracts.tasksContract.setProvider(App.web3Provider)

        App.tasksContract = await App.contracts.tasksContract.deployed()
    },

    render: () => {
        document.getElementById("account").innerText = App.account
    },

    renderTasks: async () => {
        const taskCounter = await App.tasksContract.taskCounter()
        const taskCounterNumber = taskCounter.toNumber()

        let html = ''

        for (let i = 0; i < taskCounterNumber; i++) {

            const task = await App.tasksContract.tasks(i);
            console.log(task)
            const taskId = task[0]
            const taskTitle = task[1]
            const taskDescription = task[2]
            const taskAmount = task[3]
            const taskDone = task[4]
            const taskCreated = task[5]

            let taskElement = `
            <div class="card bg-dark rounded-0 mb-2">
            <div class="card-header d-flex justify-content-between align-items-center">
                <span>${taskTitle}</span>
                <div class="form-check form-switch">
                    <input class="form-check-input" data-id=${taskId} type="checkbox" ${taskDone && "checked" }
                    onchange = "App.toggleDone(this)"} />
                    
                </div>
            </div>                    
            
                <div class="card-body">
                    <span>${taskDescription}</span><br>
                    <span>Total a pagar ETH: ${taskAmount}</span>
                    <p class="text-muted">Invoce was created ${new Date(taskCreated * 1000).toLocaleDateString()}</p>
                </div>
            </div>
        
            
            `;

            html += taskElement;
        }
        document.querySelector('#tasksList').innerHTML = html;

    },

    createTask: async (title, description, amount) => {
        const result = await App.tasksContract.createTask(title, description, amount, {
            from: App.account
        })
        console.log(result.logs[0].args)
    },

    toggleDone: async (element) =>{
        const taskId = element.dataset.id

        await App.tasksContract.toggleDone(taskId, {
            from: App.account
        })
        window.location.reload()
    }

};