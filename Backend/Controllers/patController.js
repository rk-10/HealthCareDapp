let etherUtils = require('./etherUtils');
let contractABI = require('../ABI/HealthCareABI').ABI;
let Patient = require('../models/patient');
let nonceValue = require('../models/nonce');

ParamError = (_param, res) => {
  res.status(400).json({
    status: false,
    message: `${_param} not provided`
  })
}

exports.Register = (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  
  if(username == undefined || username == null || username == '') {
    ParamError('Username', res)
  } else if (password == undefined || password == null || password == '') {
    ParamError('Password', res)
  } else {
    let patient = new Patient();
    patient.username = username;
    patient.SetPassword(password);

    patient.save()
    .then(() => {
      let token = patient.generateJWT();
      res.status(200).json({
        status: true,
        authorization: token,
        message: 'Successfully Registered'
      })
    })
    .catch((err) => {
      console.log('Error occured while saving new doctor' + err)
      res.status(500).json({
        status: false,
        message: 'Internal server error'
      })
    })
  }
}

exports.Login = (req,res) => {
  let username = req.body.username;
  let password = req.body.password;

  if(username == undefined || username == null || username == '') {
    ParamError('Username', res)
  } 
  if (password == undefined || password == null || password == '') {
    ParamError('Password', res)
  } 
  Patient.findOne({username: username})
  .then((pat) => {
    if(pat.ValidPassword(password)) {
      let token = pat.generateJWT();
      res.status(200).json({
        status: true,
        authorization: token,
        message: 'Successfully logged in'
      })
    }
    else {
      res.status(401).json({
        status: false,
        message: 'Password is wrong'
      })
    }
  })
  .catch((err) => {
    console.log('Error occured' + err)
    res.status(401).json({
      status: false,
      message: 'User not found. Please register first!!'
    })
  })
}

exports.AddRecords = (req,res) => {
  let id = req.body.id;
  let publicKey = req.body.publicKey;
  let name = req.body.name;
  let number = req.body.number;
  let address = req.body.address;
  let email = req.body.email;

  if(id == undefined || id == null || id == '') {
    ParamError('id', res);
  }

  if(publicKey == undefined || publicKey == null || publicKey == '') {
    ParamError('publicKey', res);
  }

  if(name == undefined || name == null || name == '') {
    ParamError('name', res);
  }

  if(number == undefined || number == null || number == '') {
    ParamError('number', res);
  }

  if(address == undefined || address == null || address == '') {
    ParamError('address', res);
  }

  if(email == undefined || email == null  || email == '') {
    ParamError('email', res);
  }

  let responseData = {};

  let transaction = {};
  let value = '0';
  let gasPrice = etherUtils.getFixedGasPrice();
  let gasLimit = 1000000;
  let nonce = 0;
  let previousNonce;

  Promise.all([
    etherUtils.parseValue(value),
    etherUtils.getTransactionCount_(process.env.FromADDRpub),
    etherUtils.getCurrentGasPrice()
  ])
  .then((result) => {
    value = Number(result[0]);
    nonce = Number(result[1]);
    gasPrice = Number(result[2]);
    return nonceValue.findOne({key: 'previousNonce'});
  })
  .then((_nonceValue) => {
    if (_nonceValue ? Object.keys(_nonceValue).length : false) {
      if (_nonceValue.key === "previousNonce")
        previousNonce = Number(_nonceValue.value);
      if (nonce <= previousNonce)
        nonce = previousNonce + 1;
    }
    
    let contractAddress = process.env.ContractADDR;
    let wallet = etherUtils.getWallet(process.env.FromADDRpri);
    console.log(contractAddress);

    transaction.nonce = nonce;
    transaction.gasPrice = gasPrice;
    transaction.gasLimit = gasLimit;
    transaction.to = contractAddress;
    transaction.value = value;
    transaction.data = etherUtils.getWeb3ContractInstance(contractABI, contractAddress)
        .methods.addPatient(publicKey, id, name, email, number, address).encodeABI();

    let signedTransaction = wallet.sign(transaction);
    return signedTransaction
  })
  .then((signedTx) => {
    let etherProvider = etherUtils.getEtherProvider();
    return etherProvider.sendTransaction(signedTx);
  })
  .then((_txHash) => {
    console.log(`TX hash is ${_txHash}`);
    responseData.txHash = _txHash;
    responseData.status = true;
    responseData.message = 'Transaction has been published'
    res.status(200).json(responseData);
    return nonceValue.update({key: 'previousNonce'}, {value: nonce}, {upsert: true, new: true}); 
  })
  .then(() => {
    console.log('Nonce value has been updated')
  })
  .catch((err) => {
    console.log('Some error occurred during the process: '+ err);
    res.status(500).send({
      success: false,
      message: 'Transaction could not be published. Some error occurred!!'
    });
  })
}

exports.getPatientDetails = (req,res) => {
  let patPubKey = req.body.patPubKey;

  if(patPubKey == undefined || patPubKey == null || patPubKey == '') {
    ParamError('patPubKey', res);
  }

  let wallet = etherUtils.getWalletWithProvider(process.env.FromADDRpri);
  let contract = etherUtils.getEthersContractInstance(contractABI, process.env.ContractADDR, wallet);

  contract.viewPatientDetails(patPubKey)
  .then((_details) => {
    console.log(`Patient details are ${_details}`);
    let data = {};
    
    data.id = Number(_details[0])
    data.name = _details[1];
    data.email = _details[2];
    data.number = Number(_details[3]);
    data.address = _details[4];

    res.status(200).json({
      status: true,
      message: 'Data fetched from blockchain',
      data: data
    })
  })
  .catch((err) => {
    console.log('Some error occured', err);
    res.status(500).json({
      status: false,
      message: 'Some error occured while fetching data' + err
    })
  })
}

exports.shareDetailsWithDoc = (req,res) => {
  let docPubKey = req.body.docPubKey;
  let patPubKey = req.body.patPubKey;

  if(docPubKey == undefined || docPubKey == null || docPubKey == '') {
    ParamError('docPubKey', res);
  }

  if(patPubKey == undefined || patPubKey == null || patPubKey == '') {
    ParamError('docPubKey', res);
  }

  let responseData = {};

  let transaction = {};
  let value = '0';
  let gasPrice = etherUtils.getFixedGasPrice();
  let gasLimit = 1000000;
  let nonce = 0;
  let previousNonce;

  Promise.all([
    etherUtils.parseValue(value),
    etherUtils.getTransactionCount_(process.env.FromADDRpub),
    etherUtils.getCurrentGasPrice()
  ])
  .then((result) => {
    value = Number(result[0]);
    nonce = Number(result[1]);
    gasPrice = Number(result[2]);
    return nonceValue.findOne({key: 'previousNonce'});
  })
  .then((_nonceValue) => {
    if (_nonceValue ? Object.keys(_nonceValue).length : false) {
      if (_nonceValue.key === "previousNonce")
        previousNonce = Number(_nonceValue.value);
      if (nonce <= previousNonce)
        nonce = previousNonce + 1;
    }
    
    let contractAddress = process.env.ContractADDR;
    let wallet = etherUtils.getWallet(process.env.FromADDRpri);

    transaction.nonce = nonce;
    transaction.gasPrice = gasPrice;
    transaction.gasLimit = gasLimit;
    transaction.to = contractAddress;
    transaction.value = value;
    transaction.data = etherUtils.getWeb3ContractInstance(contractABI, contractAddress)
        .methods.shareDetailsWithDoc(patPubKey, docPubKey).encodeABI();

    let signedTransaction = wallet.sign(transaction);
    return signedTransaction
  })
  .then((signedTx) => {
    let etherProvider = etherUtils.getEtherProvider();
    return etherProvider.sendTransaction(signedTx);
  })
  .then((_txHash) => {
    console.log(`TX hash is ${_txHash}`);
    responseData.txHash = _txHash;
    responseData.status = true;
    responseData.message = 'Transaction has been published'
    res.status(200).json(responseData);
    return nonceValue.update({key: 'previousNonce'}, {value: nonce}, {upsert: true, new: true}); 
  })
  .then(() => {
    console.log('Nonce value has been updated')
  })
  .catch((err) => {
    console.log('Some error occurred during the process: '+ err);
    res.status(500).send({
      success: false,
      message: 'Transaction could not be published. Some error occurred!!'
    });
  })
}