import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

const instance = new web3.eth.Contract(
    JSON.parse(CampaignFactory.interface),
    '0xB1e4d7cbf84d8e56A1872159079979E5BFEEf6f3'
);

export default instance;
