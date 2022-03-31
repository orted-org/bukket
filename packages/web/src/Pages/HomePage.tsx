import styled from "styled-components";
import { PrimaryButton, SecondaryButton } from "../MicroComponents/Buttons";
import HomeBGImg from "../Resources/bg.jpg";
import LongLogo from "../Resources/logoWhite.svg";
import { useHistory } from "react-router";
import Footer from "../Components/Footer";
import { LightTheme } from "../Styles/Global";
import F1img from "../Resources/f1.png";
import F2img from "../Resources/f2.png";
import F3img from "../Resources/f3.png";
import F4img from "../Resources/f4.png";
import Illustration from "../AuxComponents/Illustrations";
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
const MainContainer = styled.section`
  min-height: calc(100vh - 50px);
  height: fit-content;
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  font-weight: 400;
  color: ${LightTheme.primaryText};
`;

const HomeBG = styled.div`
  width: 100%;
  height: 85vh;
  overflow: hidden;
  position: absolute;
  top: 0;
  left: 0;
  z-index: -5;
`;

const HeadingText = styled.h1`
  margin-top: 20vh;
  font-size: 2.8em;
  width: 90%;
  max-width: 400px;
  text-align: center;
  background-image: linear-gradient(to right, #ed6ea0 0%, #ec8c69 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  @media (max-width: 480px) {
    font-size: 2em;
  }
`;
const FeatureContainer = styled.section`
  padding: 10px 10px;
  width: 100%;
  height: fit-content;
  justify-content: center;
  align-items: center;
  display: flex;
  flex-direction: column;
  padding-top: 40px;
  background: ${LightTheme.primaryBackground};
`;
const FeatureItem = styled.div`
  display: flex;
  width: 90%;
  justify-content: center;
  align-items: center;
  margin-bottom: 100px;
  :nth-child(2n) {
    flex-direction: row-reverse;
  }
  @media (max-width: 480px) {
    width: 100%;
  }
  @media (max-width: 480px) {
    flex-direction: column;
    :nth-child(2n) {
      flex-direction: column;
    }
  }
`;
const FeatureText = styled.div`
  display: flex;
  width: 60%;
  flex-direction: column;
  @media (max-width: 480px) {
    width: 90%;
    margin-top: 15px;
  }
`;
const FeatureImage = styled.div`
  width: 40%;
  display: flex;
  justify-content: center;
  align-items: center;
  & > img {
    width: 70%;
  }
  @media (max-width: 480px) {
    width: 100%;
  }
`;
const FeatureHeading = styled.h1`
  color: ${LightTheme.primaryText};
  font-weight: 400;
  font-size: 2.1rem;
  width: 100%;
  @media (max-width: 1024px) {
    font-size: 1.5em;
  }
`;
const FeatureDescription = styled.p`
  color: ${LightTheme.secondaryText};
  font-size: 1.05em;
  width: 100%;
`;
const BottomContainer = styled.div`
  background: ${LightTheme.primaryLayer};
  width: 100%;
  height: fit-content;
  display: flex;
  justify-content: center;
  overflow: scroll;
  -ms-overflow-style: none;
  @media (max-width: 600px) {
    justify-content: flex-start;
  }
  scrollbar-width: none;
  ::-webkit-scrollbar {
    display: none;
  }
`;
const BottomItem = styled.div`
  box-shadow: rgba(50, 50, 93, 0.25) 0px 13px 27px -5px,
    rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;
  min-height: 300px;
  min-width: 300px;
  margin: 30px 10px;
  height: fit-content;
  text-decoration: none;
  font-size: large;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  color: ${LightTheme.secondaryText};
  font-weight: 700;
  border-radius: 5px;
  overflow: hidden;
  color: ${LightTheme.primaryText};
  & p {
    opacity: 0.8;
    width: 100%;
    text-align: left;
    padding: 10px;
  }
`;
const BottomBarImage = styled.div`
  display: flex;
  width: 100%;
  height: 220px;
  justify-content: center;
  align-items: center;
  font-size: 80px;
  color: black;
  & > svg {
    max-height: 200px;
    width: 200px;
    object-fit: scale-down;
  }
`;
const SocialMediaContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-start;
  margin-left: 10px;
  align-items: center;
  & div {
    opacity: 0.6;
    margin-right: 20px;
  }
  & div:hover {
    opacity: 1;
  }
  & svg {
    color: ${LightTheme.secondaryText};
    height: 25px;
    width: 25px;
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
function HomePage() {
  const history = useHistory();
  return (
    <MainContainer>
      <HomeBG>
        <div
          style={{
            zIndex: 1,
            background: "#333333f2",
            width: "100%",
            height: "85vh",
            position: "absolute",
            objectFit: "cover",
            top: "0",
            left: "0",
          }}
        />
        <img
          src={HomeBGImg}
          style={{
            width: "100%",
            height: "85vh",
            position: "absolute",
            objectFit: "cover",
            top: "0",
            left: "0",
          }}
          alt=""
        />
        <img
          src={LongLogo}
          alt=""
          style={{
            width: "100px",
            position: "absolute",
            objectFit: "cover",
            top: "10px",
            left: "10px",
            zIndex: 3,
          }}
        />
      </HomeBG>
      <div
        style={{
          paddingBottom: "15vh",
          height: "85vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
        }}
      >
        <HeadingText>All your resources, now in place.</HeadingText>
        <h3
          style={{
            fontWeight: 300,
            width: "90%",
            maxWidth: "400px",
            margin: "30px auto",
            textAlign: "center",
            color: "white",
          }}
        >
          Store your important resources into organized buckets and share them
          with anyone, anytime.
        </h3>
        <PrimaryButton
          onClick={() => {
            history.push("/created-buckets");
          }}
          text="Go To Bucket"
          isLoading={false}
          style={{ height: "60px", width: "200px", fontSize: "1em" }}
        />
      </div>
      <FeatureContainer>
        <FeatureItem>
          <FeatureImage>
            <img src={F1img} alt="" />
          </FeatureImage>
          <FeatureText>
            <FeatureHeading>
              No more hassle with maintaining important resources.
              <b> Just Bukket them!</b>
            </FeatureHeading>
            <FeatureDescription>
              It is irritating sometimes if you can't find the resource when you
              want it. With Bukket, you can put all your resources in one place,
              organize them as you want, and retrieve them with ease instead of
              going through the pain of searching them at places you aren't
              certain of finding them.
            </FeatureDescription>
          </FeatureText>
        </FeatureItem>
        <FeatureItem>
          <FeatureImage>
            <img src={F2img} alt="" />
          </FeatureImage>
          <FeatureText>
            <FeatureHeading>
              Give more value to your resources with more and easy information
              to them
            </FeatureHeading>
            <FeatureDescription>
              With the help of rich features by Bukket, you can now give more
              details to your resource. Have a description for each item that
              describes it. Also, give your item tags to make them easier to
              categorize.
            </FeatureDescription>
          </FeatureText>
        </FeatureItem>
        <FeatureItem>
          <FeatureImage>
            <img src={F3img} alt="" />
          </FeatureImage>
          <FeatureText>
            <FeatureHeading>
              Share your resources with people fast and effortlessly
            </FeatureHeading>
            <FeatureDescription>
              It can become very tiresome and time-consuming to share resources
              with people. With Bukket, you can now share these items with
              people in the most uncomplicated way. Allow people to join your
              personal bucket upon approval of your request and that's it,
              everyone is in one space.
            </FeatureDescription>
          </FeatureText>
        </FeatureItem>
        <FeatureItem>
          <FeatureImage>
            <img src={F4img} alt="" />
          </FeatureImage>
          <FeatureText>
            <FeatureHeading>
              Add remarks to the items that are <b>personal</b> to you
            </FeatureHeading>
            <FeatureDescription>
              You don't need to go elsewhere to note something regarding an
              item. Make personal remarks on the items that are visible ONLY to
              you. This way, Bukket is not only handy to maintain and manage
              your resources but also to keep track of your personal notes about
              them.
            </FeatureDescription>
          </FeatureText>
        </FeatureItem>
      </FeatureContainer>

      <BottomContainer>
        <BottomItem>
          <BottomBarImage
            style={{
              background: LightTheme.highlightColor,
            }}
          >
            {Illustration.social}
          </BottomBarImage>
          <p>Support us on social media</p>
          <SocialMediaContainer>
            <a href={Config.instagram} target="_blank" rel="noreferrer">
              <SidebarSVG>{instagram}</SidebarSVG>
            </a>
            <a href={Config.facebook} target="_blank" rel="noreferrer">
              <SidebarSVG>{facebook}</SidebarSVG>
            </a>
            <a href={Config.reportBugAddress} target="_blank" rel="noreferrer">
              <SidebarSVG>{github}</SidebarSVG>
            </a>
          </SocialMediaContainer>
        </BottomItem>
        <BottomItem>
          <BottomBarImage
            style={{
              background: LightTheme.highlightColor,
            }}
          >
            {Illustration.howTo}
          </BottomBarImage>
          <p>How to use Bukket?</p>
          <a href="/more-about-bukket" target="_blank">
            <SecondaryButton
              style={{ fontSize: "0.85em", marginLeft: "10px" }}
              text="Learn"
              type={0}
              onClick={() => {}}
            />
          </a>
        </BottomItem>
      </BottomContainer>
      <Footer />
    </MainContainer>
  );
}

export default HomePage;
