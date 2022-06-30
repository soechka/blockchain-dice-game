const BettingGame = artifacts.require('BettingGame');

module.exports = async function (deployer) {
    await deployer.deploy(BettingGame);
};