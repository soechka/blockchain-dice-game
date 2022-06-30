let images = [
'dice-01.svg',
'dice-02.svg',
'dice-03.svg',
'dice-04.svg',
'dice-05.svg',
'dice-06.svg'];
let dice = document.querySelectorAll("img");
let isEven;

// Connect Metamask
let account;
const connectMetamask = async () => {
	if (window.ethereum !== "undefined") {
		const accounts = await ethereum.request({method: "eth_requestAccounts"});
		account = accounts[0];
		document.getElementById("accountArea").innerHTML = account;
		console.log('Metamask connected')
	}
}

// Connect to smart-contract
// * Note: set your contract address if you are using different mnemonic
const connectContract = async () => {
	const ABI = "";
	const Address = "";
	window.web3 = await new Web3(window.ethereum);
	window.contract = await new window.web3.eth.Contract([
			{
				"inputs": [],
				"stateMutability": "nonpayable",
				"type": "constructor"
			},
			{
				"inputs": [],
				"name": "OutOfBalance",
				"type": "error"
			},
			{
				"anonymous": false,
				"inputs": [
					{
						"indexed": false,
						"internalType": "bool",
						"name": "succ",
						"type": "bool"
					},
					{
						"indexed": false,
						"internalType": "uint256",
						"name": "val",
						"type": "uint256"
					}
				],
				"name": "AtLeast",
				"type": "event"
			},
			{
				"anonymous": false,
				"inputs": [
					{
						"indexed": true,
						"internalType": "address",
						"name": "_from",
						"type": "address"
					},
					{
						"indexed": false,
						"internalType": "uint256",
						"name": "dice1",
						"type": "uint256"
					},
					{
						"indexed": false,
						"internalType": "uint256",
						"name": "dice2",
						"type": "uint256"
					}
				],
				"name": "DicesRolled",
				"type": "event"
			},
			{
				"stateMutability": "payable",
				"type": "receive",
				"payable": true
			},
			{
				"inputs": [
					{
						"internalType": "bool",
						"name": "isEven",
						"type": "bool"
					}
				],
				"name": "rollDices",
				"outputs": [
					{
						"internalType": "uint32",
						"name": "dice1",
						"type": "uint32"
					},
					{
						"internalType": "uint32",
						"name": "dice2",
						"type": "uint32"
					}
				],
				"stateMutability": "payable",
				"type": "function",
				"payable": true
			},
			{
				"inputs": [
					{
						"internalType": "uint32",
						"name": "amount",
						"type": "uint32"
					}
				],
				"name": "withdraw",
				"outputs": [],
				"stateMutability": "nonpayable",
				"type": "function"
			}
		], "0xCfEB869F69431e42cdB54A4F4f105C19C080A601");
	// document.getElementById("contractArea").innerHTML = "-connect established-";
	console.log('Smart contract instance received');
}

function roll() {
	// TODO: add assertation of contract instance and metamask connection

	let bet = parseInt(document.getElementById("bet").value);
	if (isNaN(bet)) {
		console.log('Make a non-zero bet');
		return false;
	}

	dice.forEach(function(die){
		die.classList.add("shake")
	});


	setTimeout(async function() {
		let result = await window.contract.methods.rollDices(isEven).send({from:account ,value:bet});

		let dieOneValue = parseInt(result.events.DicesRolled.returnValues.dice1);
		let dieTwoValue = parseInt(result.events.DicesRolled.returnValues.dice2);

		console.log(dieOneValue, dieTwoValue);
		document.querySelector('#die-1').setAttribute('src', images[dieOneValue - 1]);
		document.querySelector('#die-2').setAttribute('src', images[dieTwoValue - 1]);
		document.querySelector('#total').innerHTML = 'Your roll is ' + (dieOneValue + dieTwoValue);
		document.getElementById("bet").value = '';

		dice.forEach(function(die){
			die.classList.remove("shake");
		});
	},
	1000
	);
}

function toggleEven() {
	document.getElementById('evenB').style.color = "#ffffff";
	isEven = true;
	document.getElementById('oddB').style.color = "#a5041185";
}

function toggleOdd() {
	document.getElementById('evenB').style.color = "#a5041185";
	isEven = false;
	document.getElementById('oddB').style.color = "#ffffff";
}


connectMetamask();
connectContract();
