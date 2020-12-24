const fs = require('fs');
const hre = require('hardhat');



async function main() {
  const accounts = await ethers.getSigners();
  const amount = '1000000000000000000000'; // 1000 VNTW

  const balanceMap = [
    { address: accounts[0].address, earnings: `0x${parseInt(amount).toString(16)}`, reasons: 'reasons 1' },
    { address: accounts[1].address, earnings: `0x${parseInt(amount).toString(16)}`, reasons: 'reasons 2' },
  ];

  fs.writeFileSync('./scripts/balance-list.json', JSON.stringify(balanceMap, null, 2));
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
