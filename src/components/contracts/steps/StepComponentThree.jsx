import React from 'react';


export const StepComponentThree = ({ setActiveIndex, contractInformation, setContractInformation }) => {
    const handleTermChange = (event) => {
        const { name, checked } = event.target;
        setContractInformation({ ...contractInformation, terms: { ...contractInformation.terms, [name]: checked } });
    };

    return (
        <div>
            <label>
                <input
                    type="checkbox"
                    name="walkAroundNeighborhood"
                    checked={contractInformation.terms.walkAroundNeighborhood}
                    onChange={handleTermChange}
                />
                Walk Around Neighborhood
            </label>
            <label>
                <input
                    type="checkbox"
                    name="walkToThePark"
                    checked={contractInformation.terms.walkToThePark}
                    onChange={handleTermChange}
                />
                Walk to the Park
            </label>
            <label>
                <input
                    type="checkbox"
                    name="walkAroundSchool"
                    checked={contractInformation.terms.walkAroundSchool}
                    onChange={handleTermChange}
                />
                Walk Around School
            </label>
            <label>
                <input
                    type="checkbox"
                    name="receiveManual"
                    checked={contractInformation.terms.receiveManual}
                    onChange={handleTermChange}
                />
                Receive Manual
            </label>
            <label>
                <input
                    type="checkbox"
                    name="photosAllowed"
                    checked={contractInformation.terms.photosAllowed}
                    onChange={handleTermChange}
                />
                Allow Photos
            </label>
            <label>
                <input
                    type="checkbox"
                    name="externalPhotosAllowed"
                    checked={contractInformation.terms.externalPhotosAllowed}
                    onChange={handleTermChange}
                />
                Allow External Photos
            </label>
            <label>
                <input
                    type="checkbox"
                    name="specialExternalUsage"
                    checked={contractInformation.terms.specialExternalUsage}
                    onChange={handleTermChange}
                />
                Special External Usage
            </label>
            <label>
                <input
                    type="checkbox"
                    name="externalUsageAllowed"
                    checked={contractInformation.terms.externalUsageAllowed}
                    onChange={handleTermChange}
                />
                External Usage Allowed
            </label>
        </div>
    );
};
export default StepComponentThree;
