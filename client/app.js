App = {
    init: () =>{
        console.log('Loaded')
        App.loadEther()
    },
    loadEther:()=>{
        if (window.ethereum) {
            App.web3Provider = window.ethereum
            await window.ethereum.request()
            
        } else{
            console.log('No ethereum browser is installed.')
        }

    }
}

App.init()