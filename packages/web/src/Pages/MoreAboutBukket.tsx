import styled from "styled-components";
import UnorderedList from "../Components/UnorderedList";
import Logo from "../Resources/logoWhite.svg";
import {
  whyBucket,
  howToCreateBucket,
  howToJoin,
  howToAddItem,
  howToAddMembers,
} from "../AuxComponents/StaticTextRepo";
const MainContainer = styled.section`
  min-height: calc(100vh - 50px);
  height: fit-content;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  font-weight: 400;
  z-index: 1;
  color: ${(props) => props.theme.secondaryText};
  padding: 70px 10px;
  scroll-behavior: smooth;
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
  justify-content: space-between;
  align-items: center;
  color: ${(props) => props.theme.secondaryText};
  font-weight: 400;
  padding-right: 10px;
  & img {
    padding: 10px 20px;
    height: 60px;
    background: ${(props) => props.theme.secondaryBlue};
  }
`;
const Section = styled.div`
  width: 100%;
  max-width: 450px;
  margin-bottom: 40px;
`;
const Heading = styled.h2`
  padding-bottom: 5px;
  margin-bottom: 5px;
  border-bottom: 1.5px solid #5c5c5c84;
  color: ${(props) => props.theme.secondaryBlue};
`;

function MoreAboutBukket() {
  document.title = "More About Bukket | Bukket";
  return (
    <MainContainer>
      <TopContainer>
        <img src={Logo} alt="" />
        More About Bukket
      </TopContainer>
      <Section>
        <Heading>Why Bukket?</Heading>
        <UnorderedList style={{ marginLeft: "25px" }} listItems={whyBucket} />
      </Section>
      <Section>
        <Heading>How to use Bukket?</Heading>
        <h3>How to create a bucket</h3>
        <UnorderedList
          style={{ marginLeft: "25px" }}
          listItems={howToCreateBucket}
        />
        <h3>How to join a bucket</h3>
        <UnorderedList style={{ marginLeft: "25px" }} listItems={howToJoin} />
        <h3>How to add items</h3>
        <UnorderedList
          style={{ marginLeft: "25px" }}
          listItems={howToAddItem}
        />
        <h3>How to add members</h3>
        <UnorderedList
          style={{ marginLeft: "25px" }}
          listItems={howToAddMembers}
        />
      </Section>
    </MainContainer>
  );
}

export default MoreAboutBukket;
