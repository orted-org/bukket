import { useHistory } from "react-router";
import styled from "styled-components";
import { PrimaryButton } from "../MicroComponents/Buttons";

const MainContainer = styled.div`
  height: fit-content;
  width: 90%;
  max-width: 450px;
  padding: 10px;
  border-radius: 10px;
  background: ${(props) => props.theme.primaryLayer};
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  flex-direction: column;
  color: ${(props) => props.theme.secondaryText};
  margin: 50px auto;
  font-weight: 700;
  font-size: 1.1em;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 10px 36px 0px,
    rgba(0, 0, 0, 0.06) 0px 0px 0px 1px;
`;
function NotFound() {
  const history = useHistory();
  document.title = "Not Found | Bukket";
  return (
    <MainContainer>
      <h1 style={{ fontSize: "5em" }}>⚠️</h1>
      We're sorry. The web address you entered is not a functioning page on our
      site.
      <PrimaryButton
        style={{ margin: "30px" }}
        text="Go to Homepage"
        isLoading={false}
        onClick={() => {
          history.push("/");
        }}
      />
    </MainContainer>
  );
}

export default NotFound;
