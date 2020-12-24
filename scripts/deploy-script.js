const fs = require('fs');
const hre = require('hardhat');
const balanceMap = require('./balance-map.json');



async function main() {
  checkDir();
  const token = '?!?'; // VNTW address
  const merkleRoot = balanceMap.merkleRoot;
  const infoMerkleDistributor = await deployMerkleDistributor(token, merkleRoot);
  // transfer 2000 VNTW to infoMerkleDistributor contract address
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });


function checkDir() {
  const isExists = fs.existsSync('./cache/deployed');
  if (!isExists)
    fs.mkdirSync('./cache/deployed', { recursive: true });
}


async function deployMerkleDistributor(token, merkleRoot) {
  const name = 'MerkleDistributor';
  const arguments = [token, merkleRoot];
  console.log('Deploying contract "%s"!', name);

  const factory = await hre.ethers.getContractFactory(name);
  const instance = await factory.deploy(...arguments);
  await instance.deployed();

  updateDeployedContractInfo(name, instance, arguments);

  return { name, arguments, instance, factory };
}


function updateDeployedContractInfo(name, instance, arguments = []) {
  const newInfo = {
    [instance.provider.network.name]: {
      name: name,
      address: instance.address,
      signer: instance.signer.address,
      arguments: arguments,
    }
  };
  console.log(newInfo);

  const fileName = `./cache/deployed/${name}.json`;
  const isExists = fs.existsSync(fileName);
  if (!isExists) {
    fs.writeFileSync(fileName, JSON.stringify({}, null, 2));
  }

  const oldInfo = JSON.parse(fs.readFileSync(fileName, { encoding: 'utf8' }));
  const info = Object.assign({}, oldInfo, newInfo);
  fs.writeFileSync(fileName, JSON.stringify(info, null, 2));
}
