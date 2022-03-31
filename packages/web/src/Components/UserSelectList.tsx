import { useEffect, useState } from "react";
import styled, { useTheme } from "styled-components";
import UserSelectItem from "../MicroComponents/UserSelectItem";
interface UserListType {
  userName: string;
  userEmail: string;
  userId: string;
  isSelected: boolean;
}
interface UserSelectListProps {
  userList: UserListType[];
  onClick: (e: UserListType[], selectCount: number) => void;
}
const UserListContainer = styled.div`
  width: 95%;
  max-width: 450px;
  margin: 0 auto;
  height: fit-content;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;
const SelectAllButton = styled.button`
  height: fit-content;
  width: fit-content;
  font-weight: 400;
  color: ${(props) => props.theme.secondaryText};
  background: none;
  cursor: pointer;
  border: none;
  outline: none;
`;
function updateUserList(
  userList: UserListType[],
  updatedIds: [string],

  selectAll: number
): { updatedUserList: UserListType[]; selectCount: number } {
  const returnList: UserListType[] = [];
  let count = 0;
  for (let i = 0; i < updatedIds.length; i++) {
    for (let j = 0; j < userList.length; j++) {
      if (
        selectAll === 0 ||
        selectAll === 1 ||
        userList[j].userId === updatedIds[i]
      ) {
        let selectState = !userList[j].isSelected;
        if (selectAll === 0) selectState = false;
        else if (selectAll === 1) selectState = true;
        returnList.push({
          ...userList[j],
          isSelected: selectState,
        });
      } else {
        returnList.push(userList[j]);
      }
      if (returnList[returnList.length - 1].isSelected) count++;
    }
  }

  return { updatedUserList: returnList, selectCount: count };
}
function UserSelectList(props: UserSelectListProps) {
  const theme = useTheme() as any;
  const [userList, setUserList] = useState<UserListType[]>([]);
  useEffect(() => {
    setUserList(props.userList);
  }, [props.userList]);
  const [isAllSelected, setAllSelected] = useState(false);
  const UserList = props.userList.map((item) => {
    return (
      <UserSelectItem
        userName={item.userName}
        userEmail={item.userEmail}
        isSelected={item.isSelected}
        userId={item.userId}
        onClick={(e) => {
          let id = "";
          if (!e.target.id) {
            id = e.target.parentNode.id;
          } else {
            id = e.target.id;
          }
          const newUserList = updateUserList(userList, [id], -1);
          setUserList(newUserList.updatedUserList);
          if (newUserList.selectCount === newUserList.updatedUserList.length) {
            setAllSelected(true);
          } else if (newUserList.selectCount === 0) {
            setAllSelected(false);
          }
          props.onClick(newUserList.updatedUserList, newUserList.selectCount);
        }}
        key={item.userId}
      />
    );
  });

  return (
    <UserListContainer>
      {userList.length === 0 ? (
        <div
          style={{
            color: theme.secondaryText,
            textAlign: "center",
            marginTop: "20px",
          }}
        >
          No new request.
        </div>
      ) : (
        <div style={{ width: "100%" }}>
          <div
            style={{
              width: "100%",
              maxWidth: "450px",
              marginTop: "20px",
              display: "flex",
              paddingRight: "10px",
              justifyContent: "flex-end",
            }}
          >
            {" "}
            <SelectAllButton
              onClick={() => {
                setAllSelected((prevState) => !prevState);
                if (isAllSelected) {
                  const newUserList = updateUserList(userList, ["-1"], 0);
                  setUserList(newUserList.updatedUserList);
                  if (
                    newUserList.selectCount ===
                    newUserList.updatedUserList.length
                  ) {
                    setAllSelected(true);
                  } else if (newUserList.selectCount === 0) {
                    setAllSelected(false);
                  }
                  props.onClick(
                    newUserList.updatedUserList,
                    newUserList.selectCount
                  );
                } else {
                  const newUserList = updateUserList(userList, ["-1"], 1);
                  setUserList(newUserList.updatedUserList);
                  if (
                    newUserList.selectCount ===
                    newUserList.updatedUserList.length
                  ) {
                    setAllSelected(true);
                  } else if (newUserList.selectCount === 0) {
                    setAllSelected(false);
                  }
                  props.onClick(
                    newUserList.updatedUserList,
                    newUserList.selectCount
                  );
                }
              }}
            >
              <p style={{ fontSize: "1.05em" }}>
                {isAllSelected ? "Deselect all" : "Select all"}
              </p>
            </SelectAllButton>
          </div>

          {UserList}
        </div>
      )}
    </UserListContainer>
  );
}
export default UserSelectList;
