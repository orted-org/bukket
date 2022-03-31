import styled, { useTheme } from "styled-components";
import { SVG } from "../AuxComponents/IconPack";
interface PrimaryAlertProps {
  isShowing: boolean;
  level: number;
  closeOnClick: () => void;
  heading?: string;
  message?: string;
}
const AlertClosingButton = styled.div`
  position: absolute;
  right: 5px;
  height: 35px;
  width: 35px;
  padding: 5px;
  color: ${(props) => props.theme.secondaryText};
  cursor: pointer;
  transition: all 0.3s;
  border-radius: 30px;
  &:hover {
    background: ${(props) => props.theme.highlightColor};
  }
  &:active {
    color: ${(props) => props.theme.highlightColor};
  }
`;
const StyledPrimaryAlert = styled.div`
  z-index: 5;
  position: fixed;
  min-height: 65px;
  height: fit-content;
  max-width: 400px;
  width: 90%;
  bottom: 70px;
  right: 30px;
  background: ${(props) => props.theme.primaryLayer};
  overflow: hidden;
  box-shadow: rgba(0, 0, 0, 0.2) 0px 5px 15px;
  border-radius: 5px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 8px 15px;
  padding-right: 45px;
  transition: all 0.5s;
  z-index: 12;
  @media (max-width: 480px) {
    right: 50%;
    transform: translate(50%, 0);
  }
`;
const StyledPrimaryAlertLevel = styled.div`
  width: 5px;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
`;
const StyledPrimaryAlertLevelIcon = styled.div`
  width: 30px;
  height: 30px;
  padding: 2px;
  border-radius: 15px;
  margin-right: 10px;
  flex: 0 0 auto;
  background: ${props=> props.theme.highlightColor};
`;
const AlertHeading = styled.h4`
  color: ${(props) => props.theme.secondaryText};
`;
const AlertMessage = styled.p`
  color: ${(props) => props.theme.secondaryText};
  font-size: 0.88em;
`;
function PrimaryAlert(props: PrimaryAlertProps) {
  const DefaultTheme = useTheme() as any;
  let levelColor;
  let levelIcon;
  let localHeading = "";
  switch (props.level) {
    case -1:
      levelColor = DefaultTheme.secondaryRed;
      levelIcon = SVG.exclamationCircle;
      localHeading = "Warning";
      break;
    case 0:
      levelColor = DefaultTheme.secondaryBlue;
      levelIcon = SVG.info;
      localHeading = "Info";
      break;
    case 1:
      levelColor = DefaultTheme.primaryGreen;
      levelIcon = SVG.tick;
      localHeading = "Success";
      break;
    default:
      levelColor = DefaultTheme.secondaryBlue;
      levelIcon = SVG.info;
      localHeading = "Info";
      break;
  }
  return (
    <StyledPrimaryAlert style={{ bottom: props.isShowing ? "70px" : "-200px" }}>
      <StyledPrimaryAlertLevel style={{ background: levelColor }} />
      <StyledPrimaryAlertLevelIcon style={{ color: levelColor }}>
        {levelIcon}
      </StyledPrimaryAlertLevelIcon>
      <div
        style={{ display: "flex", flex: "1 1 auto", flexDirection: "column" }}
      >
        <AlertHeading>{props.heading || localHeading}</AlertHeading>
        <AlertMessage>{props.message || ""}</AlertMessage>
      </div>
      <AlertClosingButton onClick={props.closeOnClick}>
        {SVG.cross}
      </AlertClosingButton>
    </StyledPrimaryAlert>
  );
}

export { PrimaryAlert };
export type { PrimaryAlertProps };
