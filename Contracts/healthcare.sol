pragma solidity 0.4.24;

contract HealthCareRecords {
    struct _patient {
        uint ID;
        string Name;
        string Email;
        uint Number;
        string Address;
    }

    struct _doctor {
        uint ID;
        string Name;
        string Email;
        uint Number;
        string Address;
    }
}