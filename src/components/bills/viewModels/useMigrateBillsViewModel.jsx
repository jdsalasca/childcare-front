import { useState } from "react";

const useMigrateBillsViewModel = () => {
    const [migrateBillsViewModel, setMigrateBillsViewModel] = useState({
        migrateBills: false,
        migrateBillsMessage: false,
        migrateBillsError: false,
        migrateBillsSuccess: false,
        migrateBillsLoading: false,
    });

    const setMigrateBills = (migrateBills) => {
        setMigrateBillsViewModel({
            ...migrateBillsViewModel,
            migrateBills,
            migrateBillsMessage: false,
            migrateBillsError: false,
            migrateBillsSuccess: false,
            migrateBillsLoading: false,
        });
    };

    const setMigrateBillsMessage = (migrateBillsMessage) => {
        setMigrateBillsViewModel({
            ...migrateBillsViewModel,
            migrateBillsMessage,
            migrateBills: false,
            migrateBillsError: false,
            migrateBillsSuccess: false,
            migrateBillsLoading: false,
        });
    };

    const setMigrateBillsError = (migrateBillsError) => {
        setMigrateBillsViewModel({
            ...migrateBillsViewModel,
            migrateBillsError,
            migrateBills: false,
            migrateBillsMessage: false,
            migrateBillsSuccess: false,
            migrateBillsLoading: false,
        });
    };

    const setMigrateBillsSuccess = (migrateBillsSuccess) => {
        setMigrateBillsViewModel({
            ...migrateBillsViewModel,
            migrateBillsSuccess,
            migrateBills: false,
            migrateBillsMessage: false,
            migrateBillsError: false,
            migrateBillsLoading: false,
        });
    };

    const setMigrateBillsLoading = (migrateBillsLoading) => {
        setMigrateBillsViewModel({
            ...migrateBillsViewModel,
            migrateBillsLoading,
            migrateBills: false,
            migrateBillsMessage: false,
            migrateBillsError: false,
            migrateBillsSuccess: false,
        });
    };

    return {
        migrateBillsViewModel,
        setMigrateBills,
        setMigrateBillsMessage,
        setMigrateBillsError,
        setMigrateBillsSuccess,
        setMigrateBillsLoading,
    };
};      



export { useMigrateBillsViewModel };
