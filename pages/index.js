import React from 'react';
import factory from '../ethereum/factory';
import Layout from '../components/Layout';
import { Card, Button } from 'semantic-ui-react';

class CampaignIndex extends React.Component {
    static async getInitialProps() {
        const campaigns = await factory.methods.getDeployedCampaigns().call();

        return { campaigns };
    }

    renderCampaigns() {
        const items = this.props.campaigns.map(address => {
            return {
                header: address,
                description: <a>View campaign</a>,
                fluid: true
            }
        });

        return  <Card.Group items={items} />
    }

    render() {
        return (
            <Layout>
                <link
                    rel="stylesheet"
                    href="//cdn.jsdelivr.net/npm/semantic-ui@2.4.1/dist/semantic.min.css"
                />
                <h3>Open Campaigns</h3>

                <Button
                    floated="right"
                    content="Create a campaign"
                    icon="add circle"
                    primary
                />

                {this.renderCampaigns()}
            </Layout>
            
        );
    }
}

export default CampaignIndex;