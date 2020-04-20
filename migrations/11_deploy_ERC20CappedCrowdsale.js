//可以将ERC20FixedSupply替换成自己想要布署的合约名称
const ERC20FixedSupply = artifacts.require("ERC20FixedSupply");
const ERC20CappedCrowdsale = artifacts.require("ERC20CappedCrowdsale");

module.exports = function (deployer, network, accounts) {
  const totalSupply = 1000000000;                 //发行量
  const cap = web3.utils.toWei('10000','ether');  //众筹封顶数量
  deployer.deploy(ERC20FixedSupply,
    "My Golden Coin", //代币名称
    "MGC",            //代币缩写
    18,               //精度    
    totalSupply       //发行量
  ).then((ERC20FixedSupplyInstance) => {
    return deployer.deploy(ERC20CappedCrowdsale,   
      100,                        //兑换比例1ETH:100ERC20
      accounts[1],                //接收ETH受益人地址
      ERC20FixedSupply.address,   //代币地址
      accounts[0],                //代币从这个地址发送
      cap                         //众筹封顶数量
    ).then(() => {
      //在布署之后必须将发送者账户中的代币批准给众筹合约
      //totalSupply 是批准数量,默认是全部代币数量,你可以调整成自己需要的
      ERC20FixedSupplyInstance.approve(ERC20CappedCrowdsale.address, cap);
    });
  })
};
