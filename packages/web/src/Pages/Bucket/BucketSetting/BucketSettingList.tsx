import { useContext, useState } from "react";
import styled, { useTheme } from "styled-components";
import { AlertContext, TabContext } from "../../../AuxComponents/Contexts";
import { SVG } from "../../../AuxComponents/IconPack";
import { BucketType } from "../Model/Types";
import LoadingAnimation from "../../../Components/LoadingAnimation";
import { useHistory } from "react-router";
import { makeBucketDeleteCall } from "../../../Http/Http.Bucket";
const MainContainer = styled.section`
  height: fit-content;
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  font-weight: 400;
  max-width: 450px;
  padding: 10px 10px;
  z-index: 1;
  padding-bottom: 30px;
  color: ${(props) => props.theme.primaryText};
  align-items: flex-end;
  padding-bottom: 30px;
`;
const SettingItem = styled.button`
  outline: none;
  border: none;
  font-size: 0.95em;
  height: 70px;
  margin: 3.5px 0;
  background: ${(props) => props.theme.primaryLayer};
  width: 100%;
  text-decoration: none;
  color: ${(props) => props.theme.secondaryText};
  padding: 10px 10px;
  display: flex;
  align-items: center;
  transition: all 0.3s;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 700;
  box-shadow: rgba(0, 0, 0, 0.2) 0px 5px 15px;
  &:active {
    background: ${(props) => props.theme.highlightColor};
  }
  position: relative;
`;
const NotificationDot = styled.div`
  height: 7px;
  width: 7px;
  border-radius: 10px;
  background: ${(props) => props.theme.secondaryBlue};
  position: absolute;
  top: 20px;
  left: 25px;
`;
const IconContainer = styled.div`
  height: fit-content;
  width: fit-content;
  margin-right: 10px;
  color: inherit;
  opacity: 0.4;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  & > svg {
    height: 22px;
    width: 22px;
  }
`;
interface BucketSettingListProps {
  isNotification: boolean;
  bucketDetails: BucketType;
}
function confirmDelete(firstName: string) {
  const m1 = Math.floor(Math.random() * 10);
  const m2 = Math.floor(Math.random() * 10);
  const input =
    window.prompt(
      "Are you sure, you want to delete the bucket? To confirm, please enter the sum of " +
        m1 +
        " & " +
        m2
    ) || "0";

  if (parseInt(input) === m1 + m2) return true;
  return false;
}
function BucketSettingList(props: BucketSettingListProps) {
  const [isPageLoading, setIsPageLoading] = useState(false);
  const { alertConfig, setAlertConfig } = useContext(AlertContext);
  const { setActiveTab } = useContext(TabContext);
  const history = useHistory();
  const theme = useTheme() as any;
  return isPageLoading ? (
    <LoadingAnimation />
  ) : (
    <MainContainer>
      <SettingItem
        onClick={() => {
          setActiveTab(5);
        }}
      >
        <IconContainer>{SVG.add}</IconContainer>
        Add new item
      </SettingItem>
      <SettingItem
        onClick={() => {
          setActiveTab(6);
        }}
      >
        <IconContainer>{SVG.pen}</IconContainer>
        Edit Bucket Details
      </SettingItem>
      <SettingItem
        onClick={() => {
          setActiveTab(7);
        }}
      >
        {props.isNotification && <NotificationDot />}
        <IconContainer>{SVG.bell}</IconContainer>
        Requests
      </SettingItem>
      <SettingItem
        onClick={() => {
          setActiveTab(8);
        }}
      >
        <IconContainer>{SVG.group}</IconContainer>
        Manage Users
      </SettingItem>
      <SettingItem
        style={{ color: theme.primaryRed }}
        onClick={() => {
          if (confirmDelete(props.bucketDetails.bucketAdmin)) {
            setIsPageLoading(true);
            makeBucketDeleteCall(props.bucketDetails.bucketId)
              .then((res) => {
                if (res.status === 200) {
                  history.push("/");
                } else if (res.status === 403) {
                  setIsPageLoading(false);
                  setAlertConfig({
                    isShowing: true,
                    level: -1,
                    closeOnClick: alertConfig.closeOnClick,
                    heading: "Not Allowed",
                    message:
                      "Only the admin of this bucket can perform this operation.",
                  });
                } else throw new Error();
              })
              .catch((err) => {
                setIsPageLoading(false);
                setAlertConfig({
                  isShowing: true,
                  level: -1,
                  closeOnClick: alertConfig.closeOnClick,
                  heading: "Something Went Wrong",
                  message:
                    "Something unexpected happened, please try again later.",
                });
              });
          } else {
            setAlertConfig({
              isShowing: true,
              level: 0,
              closeOnClick: alertConfig.closeOnClick,
              heading: "Bucket Not Deleted",
            });
          }
        }}
      >
        <IconContainer>{SVG.dustbin}</IconContainer>
        Delete Bucket
      </SettingItem>
    </MainContainer>
  );
}

export default BucketSettingList;
