import React, { Component } from 'react';

class CommitForm extends Component {
    state = {
        processing: false
    };

    nameRef = React.createRef();

    componentDidMount = () => {
        const { account, contract } = this.props;

        contract.events.NameCommitted({ filter: { sender: account } }).on('data', event => {
            this.nameCommitted();
        });
    };

    nameCommitted = () => {
        this.nameRef.current.value = '';
        this.setState({ processing: false });
        alert('Success!');
    };

    commitName = async (event) => {
        event.preventDefault();
        this.setState({ processing: true });

        const { account, contract } = this.props;
        try {
            await contract.methods.commit(this.nameRef.current.value).send({ from: account });
        } catch (error) {
            alert('An error occurred: ' + (error.stack || error.message));
            this.setState({ processing: false });
        }
    };


    render() {
        return (
            <form onSubmit={this.commitName}>
                <h2>Record</h2>
                <div className="my-3">
                    <label htmlFor="commit-name" className="form-label">Your name</label>
                    <input ref={this.nameRef} required className="form-control" id="commit-name" />
                </div>
                <div className="text-center">
                    <button disabled={this.state.processing} type="submit" className="btn btn-primary">Submit</button>
                </div>
            </form>
        );
    }
}

export default CommitForm;
