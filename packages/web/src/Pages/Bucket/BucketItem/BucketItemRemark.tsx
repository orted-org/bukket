import { CheckLimit, Limits } from "../../../AuxComponents/LimitConfig";
import { PrimaryInputText } from "../../../MicroComponents/InputText";
import { PrimaryButton } from "../../../MicroComponents/Buttons";
import styled from "styled-components";
import { useContext, useState } from "react";
import { BucketItemType } from "../Model/Types";
import { SVG } from "../../../AuxComponents/IconPack";
import { AlertContext } from "../../../AuxComponents/Contexts";
import { makeManageRemarkCall } from "../../../Http/Http.Item";
const MainContainer = styled.section`
  height: fit-content;
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  font-weight: 400;
  z-index: 1;
  color: ${(props) => props.theme.primaryText};
  padding-bottom: 30px;
`;
const EditContainer = styled.div`
  height: fit-content;
  width: 100%;
  max-width: 450px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-end;
  padding: 20px 0;
  @media (max-width: 480px) {
    padding: 20px 10px;
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
  @media (max-width: 480px) {
    border-radius: 0;
    margin-top: 0;
    padding-left: 20px;
  }
`;
const CloseButton = styled.button`
  height: fit-content;
  width: fit-content;
  border: none;
  outline: none;
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${(props) => props.theme.secondaryText};
  cursor: pointer;
  background: none;
  & > svg {
    height: 22px;
    width: 22px;
  }
`;
interface BucketEditProps {
  bucketId: string;
  currentBucketItemDetails: BucketItemType;
  onClose: (bucketItemDetails: BucketItemType) => void;
}

function BucketItemRemark(props: BucketEditProps) {
  const { alertConfig, setAlertConfig } = useContext(AlertContext);
  const [isEditButtonLoading, setIsEditButtonLoading] = useState(false);
  const [currentBucketItemDetails] = useState(props.currentBucketItemDetails);
  const [editBucketItemDetails, setEditBucketItemDetails] =
    useState<BucketItemType>(props.currentBucketItemDetails);
  const isDetailsDifferent =
    editBucketItemDetails.remark !== currentBucketItemDetails.remark;

  return (
    <MainContainer>
      <TopContainer>
        <CloseButton
          onClick={() => {
            props.onClose(currentBucketItemDetails);
          }}
        >
          {SVG.leftArrow}
        </CloseButton>
        Personal Remark
      </TopContainer>
      <EditContainer>
        <PrimaryInputText
          limit={Limits.remark.max}
          placeholder="Short personal remark"
          value={editBucketItemDetails.remark || ""}
          onChange={(e) => {
            setEditBucketItemDetails((prevState) => {
              return { ...prevState, remark: e.target.value };
            });
          }}
        />
        <PrimaryButton
          isDisabled={
            !(
              CheckLimit.bucketDescription(
                editBucketItemDetails.remark || ""
              ) && isDetailsDifferent
            )
          }
          text="Save"
          isLoading={isEditButtonLoading}
          style={{
            height: "50px",
            width: "fit-content",
            marginTop: "20px",
          }}
          onClick={() => {
            setIsEditButtonLoading(true);
            makeManageRemarkCall(
              props.bucketId,
              props.currentBucketItemDetails.bucketItemId,
              editBucketItemDetails.remark || ""
            )
              .then((res) => {
                setIsEditButtonLoading(false);
                if (res.status === 200) {
                  props.onClose(editBucketItemDetails);
                  setAlertConfig({
                    isShowing: true,
                    level: 1,
                    closeOnClick: alertConfig.closeOnClick,
                    heading: "Remark Saved",
                    message:
                      "Your personal remark has been saved successfully.",
                  });
                } else throw new Error();
              })
              .catch((err) => {
                props.onClose(currentBucketItemDetails);
                setIsEditButtonLoading(false);
                setAlertConfig({
                  isShowing: true,
                  level: -1,
                  closeOnClick: alertConfig.closeOnClick,
                  heading: "Remark Not Saved",
                  message: "Remark could not be saved, please try again later.",
                });
              });
          }}
        />
      </EditContainer>
    </MainContainer>
  );
}

export default BucketItemRemark;
