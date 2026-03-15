// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract StreetMobilization {
    struct ChildRecord {
        string name;
        uint age;
        string gender;
        string location;
        string biometricHash;
        uint timestamp;
        address registeredBy;
    }

    mapping(string => ChildRecord) private records; // biometricHash -> record
    string[] private recordHashes;

    event RecordAdded(string biometricHash, string name, address indexed registeredBy);

    function addRecord(
        string memory _name,
        uint _age,
        string memory _gender,
        string memory _location,
        string memory _biometricHash
    ) public {
        require(bytes(records[_biometricHash].biometricHash).length == 0, "Record already exists");

        records[_biometricHash] = ChildRecord({
            name: _name,
            age: _age,
            gender: _gender,
            location: _location,
            biometricHash: _biometricHash,
            timestamp: block.timestamp,
            registeredBy: msg.sender
        });

        recordHashes.push(_biometricHash);
        emit RecordAdded(_biometricHash, _name, msg.sender);
    }

    function getRecord(string memory _biometricHash) public view returns (ChildRecord memory) {
        return records[_biometricHash];
    }

    function getRecordCount() public view returns (uint) {
        return recordHashes.length;
    }
}
