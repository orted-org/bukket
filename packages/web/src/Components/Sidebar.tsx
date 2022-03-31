import styled, { useTheme } from "styled-components";
import { SVG } from "../AuxComponents/IconPack";
import Logo from "../Resources/logoWhite.svg";
import { useHistory } from "react-router-dom";
import { makeLogoutCall } from "../Http/Http.Auth";
import { useContext } from "react";
import { UserAuthContext } from "../AuxComponents/Contexts";
import Config from "../Http/HttpConfig";
const instagram = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    role="img"
    aria-labelledby="a38d70pcbmz1535szsv33sg3qn7i74hr"
    fill="currentColor"
  >
    <path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153.509.5.902 1.105 1.153 1.772.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 01-1.153 1.772c-.5.508-1.105.902-1.772 1.153-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 01-1.772-1.153 4.904 4.904 0 01-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 011.153-1.772A4.897 4.897 0 015.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 5a5 5 0 100 10 5 5 0 000-10zm6.5-.25a1.25 1.25 0 10-2.5 0 1.25 1.25 0 002.5 0zM12 9a3 3 0 110 6 3 3 0 010-6z"></path>
  </svg>
);
const github = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    role="img"
    aria-labelledby="apoi9vbhrw28xulh1lao7uggxczvrenq"
    fill="currentColor"
  >
    <path d="M12 2C6.475 2 2 6.475 2 12a9.994 9.994 0 006.838 9.488c.5.087.687-.213.687-.476 0-.237-.013-1.024-.013-1.862-2.512.463-3.162-.612-3.362-1.175-.113-.288-.6-1.175-1.025-1.413-.35-.187-.85-.65-.013-.662.788-.013 1.35.725 1.538 1.025.9 1.512 2.338 1.087 2.912.825.088-.65.35-1.087.638-1.337-2.225-.25-4.55-1.113-4.55-4.938 0-1.088.387-1.987 1.025-2.688-.1-.25-.45-1.275.1-2.65 0 0 .837-.262 2.75 1.026a9.28 9.28 0 012.5-.338c.85 0 1.7.112 2.5.337 1.912-1.3 2.75-1.024 2.75-1.024.55 1.375.2 2.4.1 2.65.637.7 1.025 1.587 1.025 2.687 0 3.838-2.337 4.688-4.562 4.938.362.312.675.912.675 1.85 0 1.337-.013 2.412-.013 2.75 0 .262.188.574.688.474A10.016 10.016 0 0022 12c0-5.525-4.475-10-10-10z"></path>
  </svg>
);
const facebook = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    role="img"
    aria-labelledby="aihxlryzdem47k716uftlknwx2azxw3s"
    fill="currentColor"
  >
    <path d="M15.402 21v-6.966h2.333l.349-2.708h-2.682V9.598c0-.784.218-1.319 1.342-1.319h1.434V5.857a19.188 19.188 0 00-2.09-.107c-2.067 0-3.482 1.262-3.482 3.58v1.996h-2.338v2.708h2.338V21H4a1 1 0 01-1-1V4a1 1 0 011-1h16a1 1 0 011 1v16a1 1 0 01-1 1h-4.598z"></path>
  </svg>
);
interface SidebarProps {
  activeTab?: number;
  isOpen: boolean;
  onClickClose: () => void;
  onClickOpen: () => void;
}

const SidebarContainer = styled.section`
  width: fit-content;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  min-width: 300px;
  max-width: 500px;
  height: 100vh;
  position: fixed;
  border-right: 2px solid ${(props) => props.theme.highlightColor};
  z-index: 10;
  background: ${(props) => props.theme.primaryLayer};
  transition: all 0.5s;
  transition-timing-function: ease;
  top: 0;
  left: 0;
  @media (max-width: 480px) {
    min-width: 0;
    width: 100%;
    border-right: none;
  }
`;
const SidebarOpenButton = styled.button`
  position: fixed;
  top: 12px;
  left: 10px;
  width: 38px;
  height: 38px;
  padding: 5px;
  outline: none;
  border: none;
  background: none;
  border-radius: 20px;
  z-index: 9;
  opacity: 0;
  color: ${(props) => props.theme.secondaryText};
  transition: all 0.5s;
  cursor: pointer;
  &:active {
    color: ${(props) => props.theme.primaryBlue};
  }
`;
const SidebarCloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  width: 40px;
  height: 40px;
  padding: 5px;
  outline: none;
  border: none;
  background: none;
  border-radius: 20px;
  color: white;
  transition: all 0.3s;
  cursor: pointer;
  &:active {
    color: ${(props) => props.theme.primaryBlue};
  }
`;
const SidebarSVG = styled.div`
  cursor: pointer;
  margin-right: 10px;
  opacity: 0.4;
  transition: all 0.3s;
  & > svg {
    height: 25px;
    width: 25px;
  }
`;
const SidebarItem = styled.button`
  height: 50px;
  outline: none;
  border: none;
  cursor: pointer;
  background: none;
  transition: all 0.3s;
  font-weight: 700;
  font-size: 0.95em;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin: 0 10px;
  border-radius: 5px;
  padding: 0 10px;
  margin-top: 10px;
  color: ${(props) => props.theme.secondaryText};
  &:hover {
    background: ${(props) => props.theme.highlightColor};
  }
  &:active {
    background: ${(props) => props.theme.highlightColor};
  }
`;
const SidebarTitle = styled.p`
  height: fit-content;
  background: none;
  font-weight: 700;
  font-size: 1em;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin: 0 10px;
  margin-top: 30px;
  border-radius: 15px;
  padding: 0 10px;
  color: ${(props) => props.theme.primaryText};
`;
const SocialMediaContainer = styled.div`
  height: 50px;
  width: 100%;
  position: absolute;
  left: 0;
  bottom: 0;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  & div {
    opacity: 0.6;
    margin-right: 20px;
  }
  & div:hover {
    opacity: 1;
  }
  & svg {
    color: ${(props) => props.theme.secondaryText};
    height: 25px;
    width: 25px;
  }
`;
function Sidebar(props: SidebarProps) {
  const bg = (num: number): string => {
    if (props.activeTab === num) return theme.highlightColor;
    return "";
  };
  const { setUserLoggedIn } = useContext(UserAuthContext);
  const theme = useTheme() as any;
  const history = useHistory();
  function performLogout() {
    props.onClickClose();
    makeLogoutCall()
      .then((res) => {
        setUserLoggedIn(false);
        history.push("/");
      })
      .catch((err) => {
        alert("Something went wrong");
      });
  }
  return (
    <SidebarContainer
      style={{
        left: props.isOpen ? "0" : "-500px",
      }}
    >
      <SocialMediaContainer>
        <a href={Config.reportBugAddress} target="_blank" rel="noreferrer">
          <SidebarSVG>{github}</SidebarSVG>
        </a>
        <a href={Config.instagram} target="_blank" rel="noreferrer">
          <SidebarSVG>{instagram}</SidebarSVG>
        </a>
        <a href={Config.facebook} target="_blank" rel="noreferrer">
          <SidebarSVG>{facebook}</SidebarSVG>
        </a>
      </SocialMediaContainer>
      <SidebarOpenButton
        style={{
          opacity: props.isOpen ? "0" : "1",
        }}
        onClick={props.onClickOpen}
      >
        {SVG.menubar}
      </SidebarOpenButton>
      <SidebarCloseButton onClick={props.onClickClose}>
        {SVG.cross}
      </SidebarCloseButton>

      {/*Side Bar Logo*/}
      <div
        style={{
          background: theme.secondaryBlue,
          display: "flex",
          alignItems: "center",
          paddingLeft: "20px",
          height: "60px",
          cursor: "pointer",
        }}
        onClick={() => {
          props.onClickClose();
          history.push("/");
        }}
      >
        <img src={Logo} alt="" style={{ width: "80px" }} />
      </div>

      {/* My Buckets*/}
      <SidebarTitle>BUCKETS</SidebarTitle>
      <SidebarItem
        style={{
          background: bg(1),
        }}
        onClick={() => {
          props.onClickClose();
          history.push("/created-buckets");
        }}
      >
        <SidebarSVG>{SVG.user}</SidebarSVG>
        Created Buckets
      </SidebarItem>
      <SidebarItem
        style={{
          background: bg(2),
        }}
        onClick={() => {
          props.onClickClose();
          history.push("/joined-buckets");
        }}
      >
        <SidebarSVG>{SVG.add}</SidebarSVG>
        Joined Buckets
      </SidebarItem>
      <SidebarItem
        style={{
          background: bg(3),
        }}
        onClick={() => {
          props.onClickClose();
          history.push("/create-join");
        }}
      >
        <SidebarSVG>{SVG.edit}</SidebarSVG>
        Create / Join
      </SidebarItem>

      {/* User */}
      <SidebarTitle>USER</SidebarTitle>
      <SidebarItem
        style={{
          background: bg(4),
        }}
        onClick={() => {
          props.onClickClose();
          history.push("/user-setting");
        }}
      >
        <SidebarSVG>{SVG.options}</SidebarSVG>
        Options
      </SidebarItem>
      <SidebarItem style={{ color: theme.primaryRed }} onClick={performLogout}>
        <SidebarSVG>{SVG.logout}</SidebarSVG>
        Logout
      </SidebarItem>
    </SidebarContainer>
  );
}

export default Sidebar;
