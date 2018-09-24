pragma solidity 0.4.24;

library StringUtils {
    /// @dev Does a byte-by-byte lexicographical comparison of two strings.
    /// @return a negative number if `_a` is smaller, zero if they are equal
    /// and a positive numbe if `_b` is smaller.
    function compare(string _a, string _b) public returns (int) {
        bytes memory a = bytes(_a);
        bytes memory b = bytes(_b);
        uint minLength = a.length;
        if (b.length < minLength) minLength = b.length;
        //@todo unroll the loop into increments of 32 and do full 32 byte comparisons
        for (uint i = 0; i < minLength; i ++)
            if (a[i] < b[i])
                return -1;
            else if (a[i] > b[i])
            return 1;

        if (a.length < b.length)
            return -1;
        else if (a.length > b.length)
            return 1;
        else
            return 0;
    }
    /// @dev Compares two strings and returns true iff they are equal.
    function notEquals(string _a, string _b) public returns (bool) {
        return compare(_a, _b) != 0;
    }
    /// @dev Finds the index of the first occurrence of _needle in _haystack
    function indexOf(string _haystack, string _needle) public returns (int) {
        bytes memory h = bytes(_haystack);
        bytes memory n = bytes(_needle);
        if(h.length < 1 || n.length < 1 || (n.length > h.length)) 
    		return -1;
    	else if(h.length > (2**128 - 1)) // since we have to be able to return -1 (if the char isn't found or input error), this function must return an "int" type with a max length of (2^128 - 1)
    		return -1;									
    	else
    	{
    		uint subindex = 0;
    		for (uint i = 0; i < h.length; i ++)
    		{
    			if (h[i] == n[0]) // found the first char of b
    			{
    				subindex = 1;
    				while(subindex < n.length && (i + subindex) < h.length && h[i + subindex] == n[subindex]) // search until the chars don't match or until we reach the end of a or b
    				{
    					subindex++;
    				}	
    				if(subindex == n.length)
    					return int(i);
    			}
    		}
    		return -1;
    	}	
    }
}

contract HealthCareRecords {
    using StringUtils for string;
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
        address[] Patients;
    }

    mapping(address => _patient) Patients;
    mapping(address => _doctor) Doctors;

    address public owner;
    modifier onlyOwner() {
        require(msg.sender == owner, "msd.sender should be owner");
        _;
    }

    /**
    @dev Creates contract by passing owner address
     */
    constructor() public {
        owner = msg.sender;
    }

    function changeOwner(address _owner) public onlyOwner returns(bool) {
        require(_owner != address(0), "Address passed is not valid");
        owner = _owner;
        return true;
    }

    /**
    @dev Adds record of doctor 
    @param _doc Public address of doc
    @param _id ID of doctor
    @param _name Name of doctor
    @param _email Email id of doctor
    @param _number Phone number of doctor
    @param _address Home address of doctor
    @param _patientAddresses Array of patient addresses
    */
    function addDoctor(
        address _doc,
        uint _id,
        string _name,
        string _email,
        uint _number,
        string _address,
        address[] _patientAddresses) public onlyOwner returns(bool) {
        // variable for comparing empty strings
        string memory mem;

        require(_doc != address(0), "Doctor address cannot be null");
        require(_id > 0, "Id cannot be 0 or less than 0");
        require(_name.notEquals(mem), "Name cannot be null");
        require(_email.notEquals(mem), "Email cannot be null");
        require(_address.notEquals(mem), "Home address cannot be null");

        _doctor memory doc = _doctor(_id,_name,_email,_number,_address,_patientAddresses);
        Doctors[_doc] = doc; 
        return true;   
    }

    /**
    @dev Adds record of patient 
    @param _pat public address of patient
    @param _id ID of patient
    @param _name Name of patient
    @param _email Email id of patient
    @param _number Phone number of patient
    @param _address Home address of patient
    */
    function addPatient(
        address _pat,
        uint _id,
        string _name,
        string _email,
        uint _number,
        string _address) public onlyOwner returns(bool) {
        // variable for comparing empty strings
        string memory mem;

        require(_pat != address(0), "Doctor address cannot be null");
        require(_id > 0, "Id cannot be 0 or less than 0");
        require(_name.notEquals(mem), "Name cannot be null");
        require(_email.notEquals(mem), "Email cannot be null");
        require(_address.notEquals(mem), "Home address cannot be null");

        _patient memory patient = _patient(_id,_name,_email,_number,_address);
        Patients[_pat] = patient; 
        return true;   
    }

    function shareInfoWithDoc(address _patientAddr, address _docAddr) internal returns(bool) {
        require(Patients[_patientAddr].Number != 0, "This patient does not exist in our records");
        require(Doctors[_docAddr].Number != 0, "This doctor does not exist in our records");

        Doctors[_docAddr].Patients.push(_patientAddr);
        return true;
    }

    function PatientDetails(address patAddr) internal view returns(_patient){
        require(Patients[patAddr].ID != 0, "Patient does not exists in our records");
        return(Patients[patAddr]);
    }

    function DoctorDetails(address docAddr) internal view returns(_doctor){
        require(Doctors[docAddr].ID != 0, "Doctor does not exists in our records");
        return(Doctors[docAddr]);
    }

    function DoctorsPatientDetails(address docAddr,address patAddr) internal view 
    returns(_patient) {
        require(Doctors[msg.sender].ID != 0, "Doctor does not exists in our records");
        require(Doctors[msg.sender].Patients.length != 0, "No patients have shared their data with doctor");

        uint patientsLength = Doctors[docAddr].Patients.length;

        for(uint i = 0; i <= patientsLength - 1; i ++) {
            if(Doctors[docAddr].Patients[i] == patAddr) {
                return(Patients[patAddr]);
            } else continue;
        }
    }

    // Public Getters for patients and doctors
    function viewPatientDetails() public view returns(uint,string,string,uint,string) {
        _patient memory Patient = PatientDetails(msg.sender);
        return(Patient.ID,Patient.Name,Patient.Email,Patient.Number,Patient.Address);
    }

    function viewDoctorDetails() public view returns(uint,string,string,uint,string,address[]){
        _doctor memory Doctor = DoctorDetails(msg.sender);
        return(Doctor.ID,Doctor.Name,Doctor.Email,Doctor.Number,Doctor.Address,Doctor.Patients);
    }

    function viewDoctorsPatientDetails(address patAddr) public view 
    returns(uint,string,string,uint,string) {
        _patient memory Patient = DoctorsPatientDetails(msg.sender, patAddr);
        return(Patient.ID,Patient.Name,Patient.Email,Patient.Number,Patient.Address);
    }

    //Public setter for sharing patient info with doctor
    function shareDetailsWithDoc(address _docAddr) public returns(bool) {
        require(_docAddr != address(0), "Address cannot be 0");
        return(shareInfoWithDoc(msg.sender, _docAddr));
    }

    //Backend getters for owner
    function viewPatientDetails(address _patAddr) public view onlyOwner 
    returns(uint,string,string,uint,string) {
        _patient memory Patient = PatientDetails(_patAddr);
        return(Patient.ID,Patient.Name,Patient.Email,Patient.Number,Patient.Address);
    }

    function viewDoctorDetails(address _docAddrs) public view onlyOwner 
    returns(uint,string,string,uint,string,address[]){
        _doctor memory Doctor = DoctorDetails(_docAddrs);
        return(Doctor.ID,Doctor.Name,Doctor.Email,Doctor.Number,Doctor.Address,Doctor.Patients);
    }

    function viewDoctorsPatientDetails(address docAddrs,address patAddr) public view  onlyOwner
    returns(uint,string,string,uint,string) {
        _patient memory Patient = DoctorsPatientDetails(docAddrs, patAddr);
        return(Patient.ID,Patient.Name,Patient.Email,Patient.Number,Patient.Address);
    }

    //Backend setter for sharing patient info with doctor
    function shareDetailsWithDoc(address _patAddr,address _docAddr) public onlyOwner 
    returns(bool) {
        require(_docAddr != address(0), "Address cannot be 0");
        return(shareInfoWithDoc(_patAddr, _docAddr));
    }
}