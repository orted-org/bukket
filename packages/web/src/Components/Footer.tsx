import styled from "styled-components";
import Config from "../Http/HttpConfig";
const MainContainer = styled.section`
  height: fit-content;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  position: absolute;
  bottom: 0;
  color: ${(props) => props.theme.secondaryText};
  padding: 5px 10px;
  padding-bottom: 15px;
  font-size: 0.88em;
  @media (max-width: 480px) {
    justify-content: space-around;
  }
`;
const FooterItem = styled.a`
  color: ${(props) => props.theme.secondaryText};
  font-size: 0.88em;
  margin-right: 15px;
  text-decoration: none;
  opacity: 0.9;
  transition: all 0.3s;
  &:hover {
    text-decoration: underline;
  }
  @media (max-width: 480px) {
    margin: 0;
  }
`;
function Footer() {
  return (
    <MainContainer>
      <FooterItem href={Config.reportBugAddress} target="_blank">
        Report Bug
      </FooterItem>
      <FooterItem href="/s/privacy-policy" target="_blank">
        Privacy Policy
      </FooterItem>
      <FooterItem href="/s/terms-and-conditions" target="_blank">
        T & C's
      </FooterItem>
      <FooterItem href={`mailto:${Config.consumerEmail}`}>Contact</FooterItem>
    </MainContainer>
  );
}

export default Footer;
