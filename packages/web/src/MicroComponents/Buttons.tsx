import styled, { useTheme } from "styled-components";
import { keyframes } from "styled-components";

//Primary Button
interface primaryButtonProps {
  text: String;
  isLoading: boolean;
  style?: Object;
  isDisabled?: boolean;
  onClick?: () => void;
}
const LoaderAnimation = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;
const StyledLoader = styled.div`
  height: 100px;
  width: 100px;
  content: "";
  box-sizing: border-box;
  height: 25px;
  width: 25px;
  border: 2px solid transparent;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  border-top-color: white;
  border-bottom-color: white;
  animation: ${LoaderAnimation} 0.7s ease-in-out infinite;
  z-index: 3;
`;
const StyledPrimaryButton = styled.button`
  min-height: 40px;
  color: white;
  background: ${(props) => props.theme.primaryBlue};
  min-width: 80px;
  outline: none;
  border: none;
  transition: all 0.3s;
  font-size: 0.9em;
  cursor: pointer;
  font-weight: 700;
  padding: 2px 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  &:hover {
    background: ${(props) => props.theme.secondaryBlue};
  }
  &:active {
    background: ${(props) => props.theme.primaryBlue};
  }
`;

function PrimaryButton(props: primaryButtonProps) {
  const theme = {
    primaryBlue: "#7f868b",
  };
  return (
    <StyledPrimaryButton
      style={props.style}
      onClick={props.onClick}
      disabled={props.isLoading || props.isDisabled}
      theme={
        props.isLoading || props.isDisabled
          ? theme
          : StyledPrimaryButton.defaultProps?.theme
      }
    >
      {props.isLoading ? <StyledLoader /> : props.text}
    </StyledPrimaryButton>
  );
}

//Secondary Button
interface secondaryButtonProps {
  text: String;
  type?: number;
  style?: Object;
  textColor?: String;
  hoverBackground?: String;
  onClick?: () => void;
}
const StyledSecondaryButton = styled.button`
  color: ${(props) => props.theme.textColor};
  background: none;
  outline: none;
  border: none;
  transition: all 0.5s;
  cursor: pointer;
  font-weight: 700;
  &:active {
    color: ${(props) => props.theme.hoverBackground};
  }
`;
StyledSecondaryButton.defaultProps = {
  theme: {
    textColor: "white",
    hoverBackground: "rgba(255, 255, 255, 0.3)",
  },
};

function SecondaryButton(props: secondaryButtonProps) {
  let theme = {};
  const incomingTheme = useTheme() as any;
  switch (props.type) {
    case 1:
      // safe
      theme = {
        textColor: incomingTheme.secondaryGreen,
        hoverBackground: "rgba(202, 255, 219, 0.3)",
      };
      break;
    case -1:
      // danger
      theme = {
        textColor: incomingTheme.secondaryRed,
        hoverBackground: "rgba(255, 195, 195, 0.3)",
      };
      break;
    case 0:
      //info
      theme = {
        textColor: incomingTheme.secondaryBlue,
        hoverBackground: "rgba(173, 210, 255, 0.473)",
      };
      break;
    default:
      theme = {
        textColor: incomingTheme.primaryText,
        hoverBackground: "rgba(255, 255, 255, 0.3)",
      };
      break;
  }
  return (
    <StyledSecondaryButton
      theme={theme}
      style={props.style}
      onClick={props.onClick}
    >
      {props.text}
    </StyledSecondaryButton>
  );
}
interface TertiaryButtonProps {
  text: string;
  style?: Object;
  onClick?: () => void;
}
const StyledTertiaryButton = styled.button`
  min-height: 40px;
  color: white;
  background: none;
  min-width: 80px;
  outline: none;
  border: none;
  transition: all 0.3s;
  font-size: 0.9em;
  cursor: pointer;
  font-weight: 700;
  padding: 2px 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 2px solid ${(props) => props.theme.primaryLayer};
  &:hover {
    opacity: 0.8;
  }
  &:active {
    opacity: 0.4;
  }
`;
function TertiaryButton(props: TertiaryButtonProps) {
  return (
    <StyledTertiaryButton style={props.style} onClick={props.onClick}>
      {props.text}
    </StyledTertiaryButton>
  );
}

export { PrimaryButton, SecondaryButton, TertiaryButton };
