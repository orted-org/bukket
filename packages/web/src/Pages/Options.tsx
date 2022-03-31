import styled from "styled-components";
import { useContext } from "react";
import { DarkModeContext } from "../AuxComponents/Contexts";
import { SVG } from "../AuxComponents/IconPack";
import Switch from "../MicroComponents/Switch";
import { setDarkThemeStatus } from "../AuxComponents/LocalStorageOperations";
import LineSeparator from "../MicroComponents/LineSeparator";
import { getUserDetails } from "../AuxComponents/LocalStorageOperations";
import Config from "../Http/HttpConfig";
const MainContainer = styled.section`
  min-height: calc(100vh - 50px);
  height: fit-content;
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  font-weight: 400;
  z-index: 1;
  padding-top: 70px;
  color: ${(props) => props.theme.primaryText};
`;
const TopContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  min-height: 60px;
  background: ${(props) => props.theme.primaryLayer};
  width: 100%;
  z-index: 8;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 10px 10px;
  color: ${(props) => props.theme.secondaryText};
  font-weight: 400;
  align-items: flex-end;
`;
const SettingItemContainer = styled.div`
  width: 95%;
  max-width: 450px;
  margin: 0 auto;
  height: fit-content;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;
const IconContainer = styled.div`
  height: 22px;
  width: 22px;
  margin-right: 10px;
  opacity: 0.3;
`;

const SettingItem = styled.div`
  height: 70px;
  margin: 5px 0;
  background: ${(props) => props.theme.primaryLayer};
  width: 100%;
  text-decoration: none;
  color: ${(props) => props.theme.secondaryText};
  padding: 10px 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: inset 0 0 0 2px transparent;
  transition: all 0.3s;
  border-radius: 5px;
  font-weight: 700;
  box-shadow: rgba(0, 0, 0, 0.2) 0px 5px 15px;
`;
const ProfileContainer = styled.div`
  margin: 5px 0;
  background: none;
  width: 100%;
  text-decoration: none;
  color: ${(props) => props.theme.secondaryText};
  padding: 10px 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  box-shadow: inset 0 0 0 2px transparent;
  transition: all 0.3s;
  border-radius: 5px;
`;
const UserImage = styled.img`
  height: 100px;
  width: 100px;
  border-radius: 40px;
  border: 5px solid ${(props) => props.theme.highlightColor};
  margin-bottom: 10px;
`;
function Options() {
  const { isDarkMode, setIsDarkMode } = useContext(DarkModeContext);
  document.title = "Options | Bukket";
  return (
    <MainContainer>
      <TopContainer>{"Options"}</TopContainer>
      <SettingItemContainer>
        <ProfileContainer
          style={{
            display: getUserDetails()?.profilePictureUrl ? "flex" : "none",
          }}
        >
          <UserImage src={getUserDetails()?.profilePictureUrl || ""} alt="" />
          <h3>{getUserDetails()?.name}</h3>
          <p>{getUserDetails()?.email}</p>
        </ProfileContainer>
        <SettingItem>
          <div style={{ display: "flex", alignItems: "center" }}>
            <IconContainer>{SVG.moon}</IconContainer>
            Night Mode
          </div>
          <Switch
            isOn={isDarkMode}
            onclick={() => {
              setIsDarkMode(!isDarkMode);
              setDarkThemeStatus(!isDarkMode);
            }}
          />
        </SettingItem>
        <LineSeparator />
        <a
          href="/more-about-bukket"
          style={{ textDecoration: "none", width: "100%" }}
          target="_blank"
          rel="noreferrer"
        >
          <SettingItem style={{ cursor: "pointer" }}>How to use?</SettingItem>
        </a>
        <a
          href={Config.reportBugAddress}
          style={{ textDecoration: "none", width: "100%" }}
          target="_blank"
          rel="noreferrer"
        >
          <SettingItem style={{ cursor: "pointer" }}>
            Feature request
          </SettingItem>
        </a>
      </SettingItemContainer>
    </MainContainer>
  );
}

export default Options;
