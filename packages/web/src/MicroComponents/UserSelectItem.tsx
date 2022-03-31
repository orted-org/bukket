import styled, { useTheme } from "styled-components";
import RGBGenerator from "../AuxComponents/RGBGenerator";

interface UserSelectItemProps {
  userName: string;
  userEmail: string;
  isSelected: boolean;
  userId: string;
  onClick: (e: any) => void;
}
const ImgContainer = styled.div`
  width: 36px;
  height: 36px;
  margin-right: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 400;
  font-size: 1.2em;
  color: white;
  border-radius: 15px;
`;
const RequestItem = styled.div`
  min-height: 70px;
  margin: 5px 0;
  background: ${(props) => props.theme.background};
  width: 100%;
  text-decoration: none;
  color: ${(props) => props.theme.color};
  padding: 10px 10px;
  display: flex;
  align-items: center;
  box-shadow: inset 0 0 0 2px transparent;
  font-weight: 700;
  cursor: pointer;
  border-radius: 5px;
  border: 2px solid ${(props) => props.theme.border};
  box-shadow: rgba(0, 0, 0, 0.2) 0px 5px 15px;
`;

function UserSelectItem(props: UserSelectItemProps) {
  let theme;
  const incomingTheme = useTheme() as any;
  if (props.isSelected) {
    theme = {
      border: incomingTheme.secondaryBlue,
      color: incomingTheme.secondaryText,
      background: incomingTheme.primaryLayer,
    };
  } else {
    theme = {
      border: incomingTheme.primaryLayer,
      color: incomingTheme.secondaryText,
      background: incomingTheme.primaryLayer,
    };
  }

  return (
    <RequestItem
      theme={theme}
      onClick={props.onClick}
      key={props.userId}
      id={props.userId}
    >
      <ImgContainer
        style={{ background: RGBGenerator(props.userName, 0.8) }}
        id={props.userId}
      >
        {props.userName[0].toUpperCase()}
      </ImgContainer>
      <div>
        <h4 id={props.userId}>{props.userName}</h4>
        <p style={{ fontWeight: 400, fontSize: "0.9em" }} id={props.userId}>
          {props.userEmail}
        </p>
      </div>
    </RequestItem>
  );
}
export default UserSelectItem;
