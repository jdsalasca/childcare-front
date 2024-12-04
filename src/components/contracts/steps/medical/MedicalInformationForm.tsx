import { useForm, Controller } from "react-hook-form";
import { Dropdown } from "primereact/dropdown";
import { ContractInfo } from "../../types/ContractInfo";
import { ChildType, MedicalInformation } from "types/child";
import { Button } from "primereact/button";
import { useTranslation } from "react-i18next";
import { InputTextAreaWrapper } from "@components/formsComponents/InputTextAreaWrapper";
import { Toast } from "primereact/toast";
import InputTextWrapper from "@components/formsComponents/InputTextWrapper";
import { LoadingInfo } from "@models/AppModels";
import { motion } from "framer-motion";
interface MedicalInformationFormProps {
  setLoadingInfo: (info: LoadingInfo) => void;
  contractInformation: ContractInfo;
  setContractInformation: (info: ContractInfo) => void;
  toast: React.RefObject<Toast>;
  setActiveIndex: (index: number) => void;
}

export const MedicalInformationForm: React.FC<MedicalInformationFormProps> = ({
  setLoadingInfo,
  contractInformation,
  setContractInformation,
  toast,
  setActiveIndex,
}) => {
  const { t } = useTranslation();
  const { control, handleSubmit, reset } = useForm<{
    childName: string;
    medicalInfo: MedicalInformation;
  }>();

  const onChildChange = (value: string) => {
    // Find the selected child's medical information
    const selectedChild = contractInformation.children.find(
      (child) => `${child.first_name} ${child.last_name}` === value
    );

    // Reset form with either existing medical info or empty values
    reset({
      childName: value,
      medicalInfo: selectedChild?.medicalInformation || {
        healthStatus: "",
        treatment: "",
        allergies: "",
        instructions: "",
        medication: "",
        provider_director_staff: "",
        restricted_activities: "",
        insurance_company: "",
        caregiver_name: "",
      },
    });

    return value;
  };

  const onSubmit = (data: {
    childName: string;
    medicalInfo: MedicalInformation;
  }) => {
    if (data.childName) {
      const updatedChildren = contractInformation.children.map((child) => {
        const fullName = `${child.first_name} ${child.last_name}`;
        if (fullName === data.childName) {
          return {
            ...child,
            medicalInformation: data.medicalInfo,
          };
        }
        return child;
      });

      setContractInformation({
        ...contractInformation,
        children: updatedChildren,
      });

      toast.current?.show({
        severity: "success",
        summary: t("medicalInfoSaved"),
      });
      /* setActiveIndex(7); */ // Move to the next step or handle as needed
    } else {
      toast.current?.show({ severity: "info", summary: t("medicalInfoSaved") });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto w-full p-4"
    >
      <motion.form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-6"
      >
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h4 className="text-2xl font-semibold text-center text-gray-800 mb-6">
            {t("medicalInformation")}
          </h4>

          <div className="mb-8">
            <Controller
              name="childName"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <>
                  <Dropdown
                    id="childName"
                    options={contractInformation.children.map(
                      (child: ChildType) => ({
                        label: `${child.first_name} ${child.last_name}`,
                        value: `${child.first_name} ${child.last_name}`,
                      })
                    )}
                    value={field.value}
                    onChange={(e) => onChildChange(e.value)}
                    placeholder={t("selectChild")}
                    className="w-full"
                  />
                  {error && <small className="p-error">{error.message}</small>}
                </>
              )}
            />
          </div>

          <motion.div
            className="bg-gray-50 rounded-lg p-6 space-y-6"
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
          >
            <InputTextAreaWrapper
              name="medicalInfo.healthStatus"
              control={control}
              label={t("healthStatus")}
              className="mb-4"
            />

            <InputTextWrapper
              name="medicalInfo.treatment"
              control={control}
              label={t("treatment")}
              className="mb-4"
            />

            <InputTextAreaWrapper
              name="medicalInfo.allergies"
              control={control}
              label={t("allergies")}
              className="mb-4"
            />

            <InputTextAreaWrapper
              name="medicalInfo.instructions"
              control={control}
              label={t("instructions")}
            />
            <InputTextWrapper
              name="medicalInfo.medication"
              control={control}
              label={t("medication")}
              className="mb-4"
            />

            <InputTextWrapper
              name="medicalInfo.provider_director_staff"
              control={control}
              label={t("providerDirectorStaff")}
              keyFilter={/^[a-zA-ZñÑ.,\s]*$/}
              className="mb-4"
            />

            <InputTextAreaWrapper
              name="medicalInfo.restricted_activities"
              control={control}
              label={t("restrictedActivities")}
              className="mb-4"
            />

            <InputTextWrapper
              name="medicalInfo.insurance_company"
              control={control}
              label={t("insuranceCompany")}
              className="mb-4"
            />

            <InputTextWrapper
              name="medicalInfo.caregiver_name"
              control={control}
              label={t("caregiver")}
              keyFilter={/^[a-zA-ZñÑ.,\s]*$/}
              className="mb-4"
            />
          </motion.div>
        </div>

        <motion.div
          className="flex justify-center gap-4 mt-8"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <Button
            type="submit"
            label={t("save")}
            className="p-button-primary px-6 py-2"
          />

          <Button
            label={t("goToFormulaInfo")}
            icon="pi pi-arrow-right"
            iconPos="right"
            className="p-button-primary px-6 py-2"
            onClick={() => setActiveIndex(7)}
          />
          <Button
            label={t("returnToPreviousStep")}
            className="p-button-secondary px-6 py-2"
            onClick={() => setActiveIndex(5)}
          />
        </motion.div>
      </motion.form>
    </motion.div>
  );
};
