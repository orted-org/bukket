import styled from "styled-components";
const Background = styled.div`
  height: 100%;
  min-height: 100vh;
  width: 100%;
  background: ${(props) => props.theme.highlightColor};
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 11;
  padding: 10px;
`;
interface PopupProps {
  child: JSX.Element;
}
function Popup(props: PopupProps) {
  return <Background>{props.child}</Background>;
}

export default Popup;
