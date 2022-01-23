import React, { Component } from 'react';

class List extends Component {
    state = {
        names: [],
        timer: null,
    };

    componentDidMount = () => {
        this.setState({ timer: setInterval(this.loadNames, 100) });
    };

    componentWillUnmount = () => {
        clearInterval(this.state.timer);
    };

    loadNames = async () => {
        const { contract } = this.props;

        const length = parseInt(await contract.methods.length().call());
        const names = await Promise.all(Array.from(Array(length)).map((_, index) => {
            return contract.methods.names(index).call();
        }));

        this.setState({ names });
    };

    render() {
        return (
            <div>
                <h2>List of revealed names</h2>
                <ul className="fs-5">
                    {this.state.names.map((name) => {
                        return <li key={name}>{name}</li>
                    })}
                </ul>
            </div>
        );
    }
}

export default List;
