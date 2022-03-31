import { useEffect, useRef, useState } from "react";
import styled, { useTheme } from "styled-components";
import { SVG } from "../../../AuxComponents/IconPack";
import SearchBar from "./SearchBar";
const BottomContainer = styled.div`
  position: fixed;
  bottom: 10px;
  left: 50%;
  transform: translate(-50%, 0);
  min-height: 50px;
  max-width: 450px;
  background: ${(props) => props.theme.primaryLayer};
  width: 100%;
  z-index: 8;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: space-between;
  text-align: right;
  color: ${(props) => props.theme.secondaryText};
  font-weight: 400;
  overflow: hidden;
  box-shadow: rgba(14, 30, 37, 0.12) 0px 2px 4px 0px,
    rgba(14, 30, 37, 0.32) 0px 2px 16px 0px;
  border-radius: 5px;
  @media (max-width: 450px) {
    border-radius: 0;
    bottom: 0;
  }
`;
const BottomIconsContainer = styled.div`
  height: 50px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 25px;
  color: ${(props) => props.theme.secondaryText};
  font-weight: 400;
`;
const IconContainer = styled.div`
  height: fit-content;
  width: fit-content;
  padding: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  position: relative;
  transition: all 0.3s;
  color: #b6b6b6;
  border-bottom: 2px solid ${(props) => props.theme.primaryLayer};
  &:hover {
    color: ${(props) => props.theme.secondaryText};
  }
  & > svg {
    height: 25px;
    width: 25px;
  }
`;
const NotificationDot = styled.div`
  height: 7px;
  width: 7px;
  border-radius: 10px;
  background: ${(props) => props.theme.secondaryBlue};
  position: absolute;
  top: 0px;
  right: 0px;
`;
interface BottomBarProps {
  isAdmin: boolean;
  isNotification: boolean;
  active: number;
  searchText: string;
  onClick: (id: number) => void;
  onSearchChange: (text: string) => void;
}
function BottomBar(props: BottomBarProps) {
  const isPhone = window.innerWidth < 1024;
  const [keyboardOn, setKeyboardOn] = useState(false);
  const [isSearchOn, setIsSearchOn] = useState(false);
  const initialHeight = useRef(0);
  const initialWidth = useRef(0);
  useEffect(() => {
    initialHeight.current = window.innerHeight;
    initialWidth.current = window.innerWidth;
    window.addEventListener("resize", () => {
      if (
        initialHeight.current > window.innerHeight &&
        initialWidth.current === window.innerWidth &&
        isPhone
      )
        setKeyboardOn(true);
      else setKeyboardOn(false);
    });
  }, [isPhone]);
  const theme = useTheme() as any;
  function getStyle(id: number) {
    if (props.active === id)
      return {
        color: theme.secondaryText,
        borderBottom: `2px solid ${theme.secondaryBlue}`,
        opacity: 1,
      };
    return {};
  }
  return (
    <>
      <div
        style={{
          width: "100%",
          position: "fixed",
          height: "20px",
          bottom: "0",
          zIndex: 5,
          background: theme.primaryBackground,
        }}
      />
      <BottomContainer>
        {isSearchOn && props.active <= 2 && (
          <SearchBar
            searchText={props.searchText}
            onChange={(e) => {
              props.onSearchChange(e.target.value);
            }}
          />
        )}
        <BottomIconsContainer style={{ display: keyboardOn ? "none" : "flex" }}>
          <IconContainer
            style={getStyle(1)}
            onClick={() => {
              props.onClick(1);
            }}
          >
            {SVG.collection}
          </IconContainer>
          <IconContainer
            onClick={() => {
              setIsSearchOn(!isSearchOn);
              props.onClick(1);
            }}
          >
            {isSearchOn ? SVG.down : SVG.search}
          </IconContainer>
          <IconContainer
            style={getStyle(3)}
            onClick={() => {
              setIsSearchOn(false);
              props.onClick(3);
            }}
          >
            {SVG.more}
          </IconContainer>
          {props.isAdmin && (
            <IconContainer
              style={getStyle(props.active >= 4 ? props.active : 0)}
              onClick={() => {
                setIsSearchOn(false);
                props.onClick(4);
              }}
            >
              {SVG.user}
              {props.isAdmin && props.isNotification && <NotificationDot />}
            </IconContainer>
          )}
        </BottomIconsContainer>
      </BottomContainer>
    </>
  );
}

export default BottomBar;
