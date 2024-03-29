import React from 'react';
import factory from '../ethereum/factory';
import Layout from '../components/Layout';
import { Card, Button } from 'semantic-ui-react';
import { Link } from '../routes';

class CampaignIndex extends React.Component {
    static async getInitialProps() {
        const campaigns = await factory.methods.getDeployedCampaigns().call();

        return { campaigns };
    }

    renderCampaigns() {
        const items = this.props.campaigns.map(address => {
            return {
                header: address,
                description: (
                    <Link route={`/campaigns/${address}`}>
                        <a>View campaign</a>
                    </Link>
                ),
                fluid: true
            }
        });

        return  <Card.Group items={items} />
    }

    render() {
        return (
            <Layout>
                <h3>Open Campaigns</h3>

                <Link route="/campaigns/new">
                    <a>
                        <Button
                            floated="right"
                            content="Create a campaign"
                            icon="add circle"
                            primary
                        />
                    </a>
                </Link>

                {this.renderCampaigns()}
            </Layout>
        );
    }
}

export default CampaignIndex;