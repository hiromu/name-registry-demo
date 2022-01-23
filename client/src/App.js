import React, { Component } from 'react';
import NameRegistryContract from './contracts/NameRegistry.json';
import getWeb3 from './getWeb3';

import './App.css';

import CommitForm from './components/CommitForm';
import RevealForm from './components/RevealForm';
import List from './components/List';

class App extends Component {
    state = {
        web3: null,
        accounts: null,
        contract: null
    };

    componentDidMount = async () => {
        try {
            // Get network provider and web3 instance.
            const web3 = await getWeb3();

            // Use web3 to get the user's accounts.
            const accounts = await web3.eth.getAccounts();

            // Get the contract instance.
            const networkId = await web3.eth.net.getId();
            const deployedNetwork = NameRegistryContract.networks[networkId];
            const instance = new web3.eth.Contract(
                NameRegistryContract.abi,
                deployedNetwork && deployedNetwork.address,
            );

            // Set web3, accounts, and contract to the state, and then proceed with an
            // example of interacting with the contract's methods.
            this.setState({ web3, accounts, contract: instance });
        } catch (error) {
            // Catch any errors for any of the above operations.
            alert(
                `Failed to load web3, accounts, or contract. Check console for details.`,
            );
            console.error(error);
        }
    };

    render() {
        if (!this.state.web3) {
            return <div>Loading Web3, accounts, and contract...</div>;
        } 
        return (
            <div className="App mt-3">
                <div className="container">
                    <div className="row">
                        <div className="col px-4">
                            <CommitForm account={this.state.accounts[0]} contract={this.state.contract} />
                            <RevealForm account={this.state.accounts[0]} contract={this.state.contract} />
                        </div>
                        <div className="col px-4">
                            <List account={this.state.accounts[0]} contract={this.state.contract} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
