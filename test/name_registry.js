const truffleAssert = require('truffle-assertions');
const NameRegistry = artifacts.require('./NameRegistry.sol');

const verifyError = (error, message) => {
    assert(error.toString().includes(message), error.toString());
};

contract('NameRegistry', accounts => {
    const [alice, bob] = accounts;

    let nameRegistry;
    beforeEach(async () => {
        nameRegistry = await NameRegistry.new();
    });

    it('can commit a name.', async () => {
        const result = await nameRegistry.commit('alice', { from: alice });
        assert.equal(await nameRegistry.length.call(), 0);
        truffleAssert.eventEmitted(result, 'NameCommitted', (ev) => {
            return ev.param1 === alice.address;
        });
    });

    it('cannot commit twice.', async () => {
        await nameRegistry.commit('alice 1', { from: alice });
        try {
            await nameRegistry.commit('alice 2', { from: alice });
        } catch (error) {
            return verifyError(error, 'You can commit only once.');
        }
        assert(false);
    });

    it('can reveal by supplying the committed name.', async () => {
        await nameRegistry.commit('alice', { from: alice });
        const result = await nameRegistry.reveal('alice', { from: alice });
        assert.equal(await nameRegistry.length.call(), 1);
        assert.equal(await nameRegistry.names.call(0), 'alice');
        truffleAssert.eventEmitted(result, 'NameRevealed', (ev) => {
            return ev.param1 === alice.address;
        });
    });

    it('cannot reveal twice.', async () => {
        await nameRegistry.commit('alice', { from: alice });
        await nameRegistry.reveal('alice', { from: alice });
        try {
            await nameRegistry.reveal('alice', { from: alice });
        } catch (error) {
            return verifyError(error, 'You can reveal only once.');
        }
        assert(false);
    });

    it('cannot reveal when supplying a different name.', async () => {
        await nameRegistry.commit('alice 1', { from: alice });
        try {
            await nameRegistry.reveal('alice 2', { from: alice });
        } catch (error) {
            return verifyError(error, 'You committed a different name.');
        }
        assert(false);
    });

    it('cannot reveal unless committed.', async () => {
        await nameRegistry.commit('alice', { from: alice });
        try {
            await nameRegistry.reveal('bob', { from: bob });
        } catch (error) {
            return verifyError(error, 'You have to commit first.');
        }
        assert(false);
    });
});
