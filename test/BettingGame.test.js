const { expect } = require('chai');

const BettingGame = artifacts.require('BettingGame');

contract('BettingGame', async accounts => {
    let token

    it('deploys succcessfully', async () => {
        token = await BettingGame.deployed()
        const address = token.address
        expect(address).to.be.not.equal(0x0)
        expect(address).to.be.not.equal('')
        expect(address).to.be.not.equal(null)
        expect(address).to.be.not.equal(undefined)
    })

    it('has a name', async () => {
        const name = await token.name()
        expect(name).to.be.equal('BettingGame')
    })
})