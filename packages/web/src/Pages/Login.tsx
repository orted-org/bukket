import styled from "styled-components";
import Logo from "../Resources/longLogo.svg";
import googleLogo from "../Resources/googleLogo.png";
import GoogleLogin from "react-google-login";
import NavBarLoader from "../Components/NavBarLoader";
import Config from "../Http/HttpConfig";
import { makeLoginPostCall } from "../Http/Http.Auth";
import { useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import { UserAuthContext } from "../AuxComponents/Contexts";
import { LightTheme, GlobalStyle } from "../Styles/Global";
import { PrimaryAlert } from "../Components/Alerts";
import Footer from "../Components/Footer";
import LoadingAnimation from "../Components/LoadingAnimation";
import { setUserDetails } from "../AuxComponents/LocalStorageOperations";
const MainContainer = styled.section`
  height: fit-content;
  min-height: calc(100vh - 50px);
  box-sizing: border-box;
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  color: ${LightTheme.primaryText};
  @media (max-width: 480px) {
    justify-content: center;
  }
`;
const LogoContainer = styled.div`
  width: 100%;
  height: fit-content;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px;
  @media (max-width: 480px) {
    position: absolute;
    top: 10%;
    padding: 0;
  }
`;
const LoginContainer = styled.div`
  height: fit-content;
  width: 100%;
  max-width: 400px;
  border-radius: 8px;
  background: ${LightTheme.primaryLayer};
  padding: 20px;
  border: 2px solid ${LightTheme.highlightColor};
  @media (max-width: 480px) {
    border-radius: 0;
    border: none;
  }
  position: relative;
`;
const LoginButton = styled.button`
  width: 100%;
  height: 48px;
  background: white;
  outline: none;
  border: none;
  color: #1e262c;
  font-weight: 700;
  font-size: 0.95em;
  cursor: pointer;
  transition: all 0.3s;
  margin-top: 40px;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 10px 36px 0px,
    rgba(0, 0, 0, 0.06) 0px 0px 0px 1px;
  &:hover {
  }
  &:active {
    box-shadow: 1px 1px 22px ${LightTheme.secondaryText};
  }
`;
const LinkItem = styled.a`
  color: ${LightTheme.secondaryBlue};
  text-decoration: none;
  transition: all 0.3s;
  &:hover {
    text-decoration: underline;
  }
`;
function Login() {
  const { setUserLoggedIn } = useContext(UserAuthContext);
  const history = useHistory();
  function googleResponse(response: any) {
    if (response.tokenId === undefined || response.tokenId === null) {
    } else {
      const tokenId = response.tokenId;
      makeLoginPostCall(tokenId)
        .then((res) => {
          if (res.status === 200) {
            //redirect to fragment page
            res.json().then((data) => {
              setUserDetails(data.userData);
              setUserLoggedIn(true);
              history.push(history.location);
            });
          } else {
            throw new Error("Status Not 200");
          }
        })
        .catch((err) => {
          <PrimaryAlert
            isShowing={true}
            level={-1}
            closeOnClick={() => {}}
            heading="Something Went Wrong"
            message="Something unexpected happened, please try again later."
          />;
        });
    }
  }
  const [isLoading, setIsLoading] = useState(false);
  document.title = "Login | Bukket";

  return (
    <MainContainer>
      <GlobalStyle theme={LightTheme} />
      <NavBarLoader isLoading={isLoading} />
      <LogoContainer>
        <img style={{ width: "120px" }} src={Logo} alt="" />
      </LogoContainer>
      <LoginContainer>
        <h1>Welcome</h1>
        <p style={{ color: LightTheme.secondaryText }}>
          Got resources? Just Bukket it!
        </p>
        <div>
          <GoogleLogin
            clientId={Config.googleClientId}
            render={(renderProps) => {
              if (renderProps.disabled || false) return <LoadingAnimation />;
              return (
                <LoginButton onClick={renderProps.onClick}>
                  <img style={{ height: "28px" }} src={googleLogo} alt="" />
                  <p style={{ marginLeft: "10px" }}>Sign in with Google</p>
                </LoginButton>
              );
            }}
            onSuccess={(response) => {
              setIsLoading(true);
              googleResponse(response);
            }}
            onFailure={(response) => {
              setIsLoading(true);
              googleResponse(response);
            }}
            cookiePolicy={"single_host_origin"}
          />
          <p
            style={{
              color: LightTheme.secondaryText,
              fontSize: "0.9em",
              marginTop: "10px",
            }}
          >
            By logging in you accept our{" "}
            <LinkItem href="/s/privacy-policy" target="_blank" rel="noreferrer">
              Privacy Policy
            </LinkItem>{" "}
            and{" "}
            <LinkItem
              href="/s/terms-and-conditions"
              target="_blank"
              rel="noreferrer"
            >
              Terms of Service
            </LinkItem>
            .
          </p>
        </div>
      </LoginContainer>
      <Footer />
    </MainContainer>
  );
}

export default Login;
