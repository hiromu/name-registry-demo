// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <8.10.0;

contract NameRegistry {
    mapping (address => bytes32) private hashes;
    mapping (address => bool) private revealed;
    string[] public names;

    event NameCommitted(address sender);
    event NameRevealed(address sender);

    function commit(string memory _name) public {
        require(hashes[msg.sender] == 0, 'You can commit only once.');
        hashes[msg.sender] = keccak256(abi.encodePacked(msg.sender, _name));

        emit NameCommitted(msg.sender);
    }

    function reveal(string memory _name) public {
        require(hashes[msg.sender] != 0, 'You have to commit first.');
        require(revealed[msg.sender] == false, 'You can reveal only once.');

        bytes32 hash = keccak256(abi.encodePacked(msg.sender, _name));
        require(hashes[msg.sender] == hash, 'You committed a different name');

        names.push(_name);
        revealed[msg.sender] = true;

        emit NameRevealed(msg.sender);
    }

    function length() public view returns (uint) {
        return names.length;
    }
}
