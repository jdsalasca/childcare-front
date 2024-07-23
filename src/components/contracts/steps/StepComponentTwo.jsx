import React from 'react'

export const StepComponentTwo = ({ setActiveIndex, contractInformation, setContractInformation }) => {
  const handleGuardianChange = (index, event) => {
      const updatedGuardians = [...contractInformation.guardians];
      updatedGuardians[index][event.target.name] = event.target.value;
      setContractInformation({ ...contractInformation, guardians: updatedGuardians });
  };

  return (
      <div>
          {contractInformation.guardians.map((guardian, index) => (
              <div key={index}>
                  <input
                      type="text"
                      name="name"
                      value={guardian.name}
                      onChange={(event) => handleGuardianChange(index, event)}
                      placeholder="Guardian's Name"
                  />
                  <input
                      type="text"
                      name="relationship"
                      value={guardian.relationship}
                      onChange={(event) => handleGuardianChange(index, event)}
                      placeholder="Relationship"
                  />
              </div>
          ))}
      </div>
  );
};

export default StepComponentTwo;
