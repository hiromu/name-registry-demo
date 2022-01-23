import React, { Component } from 'react';

class RevealForm extends Component {
    state = {
        processing: false
    };

    nameRef = React.createRef();

    componentDidMount = () => {
        const { account, contract } = this.props;

        contract.events.NameRevealed({ filter: { sender: account } }).on('data', event => {
            this.nameRevealed();
        });
    };

    nameRevealed = () => {
        this.nameRef.current.value = '';
        this.setState({ processing: false });
        alert('Success!');
    };

    revealName = async (event) => {
        event.preventDefault();
        this.setState({ processing: true });

        const { account, contract } = this.props;
        try {
            await contract.methods.reveal(this.nameRef.current.value).send({ from: account });
        } catch (error) {
            alert('An error occurred: ' + error.message);
            this.setState({ processing: false });
        }
    };


    render() {
        return (
            <form onSubmit={this.revealName}>
                <h2>Reveal</h2>
                <div className="my-3">
                    <label htmlFor="reveal-name" className="form-label">Your name</label>
                    <input ref={this.nameRef} required className="form-control" id="reveal-name" />
                </div>
                <div className="text-center">
                    <button disabled={this.state.processing} type="submit" className="btn btn-primary">Submit</button>
                </div>
            </form>
        );
    }
}

export default RevealForm;
