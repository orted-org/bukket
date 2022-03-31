import { PrimaryTextArea } from "../../../MicroComponents/InputTextArea";
import { CheckLimit, Limits } from "../../../AuxComponents/LimitConfig";
import { PrimaryInputText } from "../../../MicroComponents/InputText";
import { PrimaryButton } from "../../../MicroComponents/Buttons";
import styled from "styled-components";
import { useContext, useState } from "react";
import { makeBucketDetailsEditCall } from "../../../Http/Http.Setting";
import { AlertContext, TabContext } from "../../../AuxComponents/Contexts";
import { BucketType } from "../Model/Types";
import { SVG } from "../../../AuxComponents/IconPack";
const MainContainer = styled.section`
  height: fit-content;
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  font-weight: 400;
  max-width: 450px;
  z-index: 1;
  padding-bottom: 30px;
  color: ${(props) => props.theme.primaryText};
  align-items: flex-end;
`;
const EditContainer = styled.div`
  height: fit-content;
  width: 100%;
  max-width: 450px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-end;
  @media (max-width: 480px) {
    padding: 0 10px;
  }
`;

const TopContainer = styled.div`
  height: 45px;
  background: ${(props) => props.theme.primaryLayer};
  width: 100%;
  z-index: 8;
  display: flex;
  margin-top: 10px;
  max-width: 450px;
  border-radius: 5px;
  justify-content: space-between;
  padding-left: 100px;
  padding: 10px 10px;
  color: ${(props) => props.theme.secondaryBlue};
  font-weight: 400;
  align-items: center;
  transition: all 0.5s;
  font-size: 0.95em;
  font-weight: 700;
  margin-bottom: 20px;
  @media (max-width: 480px) {
    border-radius: 0;
    margin-top: 0;
  }
`;
const IconContainer = styled.div`
  height: fit-content;
  width: fit-content;
  margin-right: 10px;
  color: ${(props) => props.theme.secondaryText};
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.3s;
  & > svg {
    height: 22px;
    width: 22px;
  }
  &:active {
    opacity: 0.5;
  }
`;
interface BucketEditProps {
  currentBucketDetails: BucketType;
  onClose: (bucketDetails: BucketType) => void;
}
function BucketEdit(props: BucketEditProps) {
  const { alertConfig, setAlertConfig } = useContext(AlertContext);
  const { setActiveTab } = useContext(TabContext);
  const [isEditButtonLoading, setIsEditButtonLoading] = useState(false);
  const [currentBucketDetails, setCurrentBucketDetails] = useState(
    props.currentBucketDetails
  );
  const [editBucketDetails, setEditBucketDetails] = useState(
    props.currentBucketDetails
  );
  const isDetailsDifferent =
    editBucketDetails.bucketName !== currentBucketDetails.bucketName ||
    editBucketDetails.bucketDescription !==
      currentBucketDetails.bucketDescription;

  return (
    <MainContainer>
      <TopContainer>
        <IconContainer
          onClick={() => {
            setActiveTab(4);
          }}
        >
          {SVG.leftArrow}
        </IconContainer>
        <p>Edit Bucket Details</p>
      </TopContainer>
      <EditContainer>
        <PrimaryInputText
          limit={Limits.bucketName.max}
          placeholder="Enter bucket name"
          value={editBucketDetails.bucketName}
          onChange={(e) => {
            setEditBucketDetails((prevState) => {
              return { ...prevState, bucketName: e.target.value };
            });
          }}
        />
        <PrimaryTextArea
          limit={Limits.bucketDescription.max}
          value={editBucketDetails.bucketDescription}
          placeholder="Short bucket description"
          style={{ marginTop: "20px" }}
          onChange={(e) => {
            setEditBucketDetails((prevState) => {
              return { ...prevState, bucketDescription: e.target.value };
            });
          }}
        />
        <PrimaryButton
          isDisabled={
            !(
              CheckLimit.bucketDescription(
                editBucketDetails.bucketDescription
              ) &&
              CheckLimit.bucketName(editBucketDetails.bucketName) &&
              isDetailsDifferent
            )
          }
          text="Save Changes"
          isLoading={isEditButtonLoading}
          style={{ height: "50px", width: "fit-content", marginTop: "20px" }}
          onClick={() => {
            setIsEditButtonLoading(true);
            makeBucketDetailsEditCall(
              currentBucketDetails.bucketId,
              editBucketDetails.bucketName,
              editBucketDetails.bucketDescription
            )
              .then((res) => {
                setIsEditButtonLoading(false);
                if (res.status === 200) {
                  setCurrentBucketDetails(editBucketDetails);
                  props.onClose(editBucketDetails);
                  setAlertConfig({
                    isShowing: true,
                    level: 1,
                    closeOnClick: alertConfig.closeOnClick,
                    heading: "Bucket Details Changed",
                    message:
                      "Bucket details have been changed and saved successfully.",
                  });
                } else if (res.status === 403) {
                  setAlertConfig({
                    isShowing: true,
                    level: -1,
                    closeOnClick: alertConfig.closeOnClick,
                    heading: "Not Allowed",
                    message: "Only the admin can make this changes.",
                  });
                } else throw new Error();
              })
              .catch((err) => {
                setAlertConfig({
                  isShowing: true,
                  level: -1,
                  closeOnClick: alertConfig.closeOnClick,
                  heading: "Something Went Wrong",
                  message:
                    "Something unexpected happened, please try again later.",
                });
              });
          }}
        />
      </EditContainer>
    </MainContainer>
  );
}
export default BucketEdit;
