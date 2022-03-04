const Web3 = require("web3")
const ETH = require("ethereumjs-tx").Transaction


const web3 = new Web3("HTTP://127.0.0.1:7545")


const sendingAddress = '0x8fAf846573d9fdbD40dA8819Ac07529095434FB0'
const receivingAddress = '0xa25Eda2645A9D7a0Db8EA8bEb890BFFaB5625c89'

web3.eth.getBalance(sendingAddress).then(bal => console.log(`Sending address balance:   ${web3.utils.fromWei(bal, 'ether')}`));
web3.eth.getBalance(receivingAddress).then(bal => console.log(`Receiving address balance: ${web3.utils.fromWei(bal, 'ether')}`));


let value = Number(web3.utils.toWei("1", 'ether'));

let rawTransaction = {
    nonce: 28,
    to: receivingAddress,
    gasPrice: 2000,
    gasLimit: 6721975,
    value: value,
    data: "0x"
}
console.log(rawTransaction)


let privateKeySender = 'b6a9be4b4c48bade44b66e895da0fb6e0c96a6bc23c14e55ad2b6eaaf211cdf7'
let privateKeySenderHex = Buffer.from(privateKeySender, "hex")
let transaction = new ETH(rawTransaction, {chain: 'ropsten'})
transaction.sign(privateKeySenderHex)
const serializedTransaction = transaction.serialize();


web3.eth.sendSignedTransaction('0x' + serializedTransaction.toString('hex'));

web3.eth.getGasPrice().then(gas => console.log(`Gas price: ${gas}`));

web3.eth.getBalance(sendingAddress).then(bal => console.log(`Sending address balance after trx:   ${web3.utils.fromWei(bal, 'ether')}`));
web3.eth.getBalance(receivingAddress).then(bal => console.log(`Receiving address balance after trx: ${web3.utils.fromWei(bal, 'ether')}`));



web3.eth.getTransactionCount("0x8fAf846573d9fdbD40dA8819Ac07529095434FB0").then(console.log)


