const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const compiledFactory = require('../ethereum/build/CampaignFactory.json');
const compieldCampaign = require('../ethereum/build/Campaign.json');

let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();
    factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
        .deploy({ data: compiledFactory.bytecode })
        .send({ from: accounts[0], gas: 1000000 });
    
    await factory.methods.createCampaign('100').send({
        from: accounts[0],
        gas: '1000000' 
    });

    [campaignAddress] = await factory.methods.getDeployedCampaigns().call();
    campaign = await new web3.eth.Contract(
        JSON.parse(compieldCampaign.interface),
        campaignAddress
    );
});

describe('Campaigns', () => {
    it('deploys a factory and a campaign', () => {
        assert.ok(factory.options.address);
        assert.ok(campaign.options.address);
    });

    it('marks caller as the campaign manager', async () => {
        const manager = await campaign.methods.manager().call();
        assert.equal(accounts[0], manager);
    });

    it('allows people to contribute money and marks them as approver', async () => {
        await campaign.methods.contribute().send({
            value: '200',
            from: accounts[1]
        });
        const isContributer = await campaign.methods.approvers(accounts[1]).call();
        assert(isContributer);
    });

    it('requires a minimum contribution', async () => {
        try {
            await campaign.methods.contribute().send({
                value: '50',
                from: accounts[2]
            });
            assert(false);
        } catch (err) {
            assert(err);
        } 
    });

    it('allows a manager to make a payment request', async () => {
        await campaign.methods
         .createRequest('Buy batteries', '100', accounts[1])
         .send({
             from: accounts[0],
             gas: '1000000'
         });
        
        const request = await campaign.methods.requests(0).call();
        
        assert.equal('Buy batteries', request.description);
     });

     it('processes requests', async () => {
        const requestAmount = '5'

        await campaign.methods.contribute().send({
            from: accounts[0],
            value: web3.utils.toWei('10', 'ether')
        });

        let balanceBefore = await web3.eth.getBalance(accounts[1]);
        balanceBefore = web3.utils.fromWei(balanceBefore, 'ether');
        balanceBefore = parseFloat(balanceBefore); 

        await campaign.methods
            .createRequest("A", web3.utils.toWei(requestAmount, 'ether'), accounts[1])
            .send({ from: accounts[0], gas: '1000000'});

        await campaign.methods.approveRequest(0).send({
            from: accounts[0],
            gas: '1000000'
        });

        await campaign.methods.finalizeRequest(0).send({
            from: accounts[0],
            gas: '1000000'
        });

        let balanceAfter = await web3.eth.getBalance(accounts[1]);
        balanceAfter = web3.utils.fromWei(balanceAfter, 'ether');
        balanceAfter = parseFloat(balanceAfter); // String to decimal number

        assert(balanceAfter - balanceBefore > 4.8);
     });
});