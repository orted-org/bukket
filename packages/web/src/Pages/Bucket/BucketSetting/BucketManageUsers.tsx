import styled, { useTheme } from "styled-components";
import { useContext, useEffect, useState } from "react";
import UserSelectList from "../../../Components/UserSelectList";
import { SVG } from "../../../AuxComponents/IconPack";
import LoadingAnimation from "../../../Components/LoadingAnimation";
import { UserType } from "../Model/Types";
import getAllUserList from "../Model/GetAllUserList";
import { AlertContext, TabContext } from "../../../AuxComponents/Contexts";
import {
  adjustUserList,
  getSelectedUserIds,
} from "../Model/UserListOperations";
import { makeRemoveUserCall } from "../../../Http/Http.Setting";
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

interface UserListType extends UserType {
  isSelected: boolean;
}
interface ManageUserProps {
  bucketId: string;
  updateCount: (num: number) => void;
}
function ManageUser(props: ManageUserProps) {
  const theme = useTheme() as any;
  const { setActiveTab } = useContext(TabContext);
  const { alertConfig, setAlertConfig } = useContext(AlertContext);
  const [userList, setUserList] = useState<UserListType[]>();
  const [selectCount, setSelectCount] = useState(0);
  const [isPageLoading, setIsPageLoading] = useState(false);

  const isOnPhone = window.innerWidth < 600;
  useEffect(() => {
    getAllUserList(props.bucketId, false).then((data) => {
      setUserList(data);
    });
  }, [props.bucketId]);
  const ActionButtons = (
    <div style={{ display: "flex" }}>
      <IconContainer style={{ color: theme.primaryRed }} title="Remove User">
        {isOnPhone ? SVG.remove : "Remove"}
      </IconContainer>
    </div>
  );

  if (userList === undefined || isPageLoading) return <LoadingAnimation />;
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
        <div
          onClick={() => {
            setIsPageLoading(true);
            const selectedUserIds = getSelectedUserIds(userList);
            makeRemoveUserCall(props.bucketId, selectedUserIds)
              .then((res) => {
                setSelectCount(0);
                setIsPageLoading(false);
                if (res.status === 200) {
                  const updatedList = adjustUserList(selectedUserIds, userList);
                  setUserList(updatedList);
                  props.updateCount(-1 * selectedUserIds.length);
                  setAlertConfig({
                    isShowing: true,
                    level: 1,
                    closeOnClick: alertConfig.closeOnClick,
                    heading: "Members Removed Successfully",
                  });
                } else if (res.status === 403 || res.status === 401) {
                  const updatedList = adjustUserList([], userList);
                  setUserList(updatedList);
                  setAlertConfig({
                    isShowing: true,
                    level: -1,
                    closeOnClick: alertConfig.closeOnClick,
                    heading: "Action Cannot be Performed",
                  });
                }
              })
              .catch((err) => {
                const updatedList = adjustUserList([], userList);
                setUserList(updatedList);
                setSelectCount(0);
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
          }}
        >
          {selectCount > 0 ? ActionButtons : "Manage Users"}
        </div>
      </TopContainer>

      <UserSelectList
        userList={userList}
        onClick={(updatedUserList, selectCount) => {
          setUserList(updatedUserList);
          setSelectCount(selectCount);
        }}
      />
    </MainContainer>
  );
}

export default ManageUser;
