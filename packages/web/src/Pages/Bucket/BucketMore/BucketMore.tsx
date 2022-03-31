import styled, { useTheme } from "styled-components";
import {
  PrimaryButton,
  TertiaryButton,
} from "../../../MicroComponents/Buttons";
import { PrimaryInputText } from "../../../MicroComponents/InputText";
import copy from "copy-to-clipboard";
import { BucketType } from "../Model/Types";
import { useContext, useState } from "react";
import { AlertContext } from "../../../AuxComponents/Contexts";
import { makeBucketQuitCall } from "../../../Http/Http.User";
import { useHistory } from "react-router";
import LoadingAnimation from "../../../Components/LoadingAnimation";
const MoreItemContainer = styled.div`
  width: 95%;
  max-width: 450px;
  margin: 0 auto;
  height: fit-content;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  font-weight: 400;
  z-index: 1;
  margin-top: 10px;
  color: ${(props) => props.theme.primaryText};
  padding-bottom: 30px;
`;

const MoreItem = styled.div`
  min-height: 70px;
  background: ${(props) => props.theme.primaryLayer};
  width: 100%;
  color: ${(props) => props.theme.secondaryText};
  padding: 10px 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  box-shadow: inset 0 0 0 2px transparent;
  transition: all 0.3s;
  border-radius: 5px;
  margin-bottom: 5px;
  font-weight: 700;
  box-shadow: rgba(0, 0, 0, 0.2) 0px 5px 15px;
`;

const DescItem = styled.p`
  font-weight: 400;
  margin-bottom: 10px;
  font-size: 0.95em;
`;
interface BucketMoreProps {
  isAdmin: boolean;
  userCount: number;
  itemCount: number;
  bucketDetails: BucketType;
}
function getJoiningLink(bucketId: string) {
  return "https://www.bukket.cloud/join-bucket?id=" + bucketId;
}
function BucketMore(props: BucketMoreProps) {
  const { alertConfig, setAlertConfig } = useContext(AlertContext);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const joiningLink = getJoiningLink(props.bucketDetails.bucketId);
  const history = useHistory();
  const theme = useTheme() as any;
  return isPageLoading ? (
    <LoadingAnimation />
  ) : (
    <MoreItemContainer>
      <MoreItem>
        <h4>Joining Link</h4>
        <div style={{ display: "flex", width: "100%" }}>
          <PrimaryInputText isDisabled={true} value={joiningLink} />
          <PrimaryButton
            text="Copy"
            isLoading={false}
            onClick={() => {
              copy(joiningLink);
              setAlertConfig({
                isShowing: true,
                level: 1,
                closeOnClick: alertConfig.closeOnClick,
                heading: "Joining Link Copied",
              });
            }}
          />
        </div>
      </MoreItem>
      <MoreItem>
        <h4>Description</h4>
        <DescItem>{props.bucketDetails.bucketDescription}</DescItem>
        <h4>Admin</h4>
        <DescItem>{props.bucketDetails.bucketAdmin}</DescItem>
        <h4>Created on</h4>
        <DescItem>{props.bucketDetails.bucketCreateDate}</DescItem>
        <h4>Items</h4>
        <DescItem>{props.itemCount}</DescItem>
        <h4>Members</h4>
        <DescItem>{props.userCount}</DescItem>
      </MoreItem>
      {!props.isAdmin && (
        <TertiaryButton
          style={{
            marginTop: "30px",
            height: "50px",
            color: theme.primaryRed,
            width: "100%",
            maxWidth: "200px",
            border: `2px solid ${theme.primaryRed}`,
          }}
          text="Exit Bucket"
          onClick={() => {
            if (window.confirm("Are you sure to exit this bucket?")) {
              setIsPageLoading(true);
              makeBucketQuitCall(props.bucketDetails.bucketId).then((res) => {
                setIsPageLoading(false);
                if (res.status === 403) {
                  setAlertConfig({
                    isShowing: true,
                    level: -1,
                    closeOnClick: alertConfig.closeOnClick,
                    heading: "Not Allowed To Exit",
                    message: "You are not allowed to quit this bucket.",
                  });
                } else if (res.status === 200) {
                  history.push("/");
                } else throw new Error();
              });
            } else {
              setIsPageLoading(false);
              setAlertConfig({
                isShowing: true,
                level: 0,
                closeOnClick: alertConfig.closeOnClick,
                heading: "Not Exiting Bucket",
              });
            }
          }}
        />
      )}
    </MoreItemContainer>
  );
}
export default BucketMore;
