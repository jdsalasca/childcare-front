import { useEffect, useState } from "react";
import { ChildrenGuardiansAPI } from "../ChildrenGuardiansAPI";

export const useGetGuardiansByChildId = (childIdList = []) => {
    const [loading, setLoading] = useState(false);
    const [guardians, setGuardians] = useState([]); 
    const onGetGuardiansByChildId = async () => {
        setLoading(true);
        const associatedGuardians = childIdList.map((childId) => {
            return ChildrenGuardiansAPI.getByChildId(childId);
        });
        const responses = await Promise.all(associatedGuardians);
        setLoading(false);
        console.log("useGetGuardiansByChildId");
        return responses;
    };

    useEffect(() => {
        if (childIdList.length > 0) {
            onGetGuardiansByChildId();
        }
       
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },  [childIdList]); 
    

};