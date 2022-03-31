import styled from "styled-components";
const MainContainer = styled.div`
  width: 100%;
  height: fit-content;
  padding: 25px 10px;
  color: inherit;
  position: relative;
  border-left: 2px solid ${(props) => props.theme.secondaryBlue};
  display: flex;
  align-items: center;
  & img {
    width: 90%;
    max-width: 400px;
    border-radius: 5px;
    box-shadow: rgba(0, 0, 0, 0.16) 0px 10px 36px 0px,
      rgba(0, 0, 0, 0.06) 0px 0px 0px 1px;
  }
`;
const Dot = styled.div`
  height: 14px;
  width: 14px;
  border-radius: 6px;
  border: 3px solid ${(props) => props.theme.primaryBackground};
  background: ${(props) => props.theme.primaryBlue};
  position: absolute;
  left: -8px;
`;
interface UnorderedListItemProps {
  element: JSX.Element;
}
function UnorderedListItem(props: UnorderedListItemProps) {
  return (
    <MainContainer>
      <Dot />
      {props.element}
    </MainContainer>
  );
}

export default UnorderedListItem;
