import styled from "styled-components";
import { keyframes } from "styled-components";
interface NavbarLoaderProps {
  isLoading: boolean;
}
const LoaderContainer = styled.div`
  height: 4px;
  width: 100%;
  background: none;
  overflow: hidden;
  position: relative;
  background: none;
  transition: all 0.5;
  position: absolute;
  top: 0;
  z-index: 1;
`;
const LoaderAnimation = keyframes`
  from {
    left: -100%;
  }
  to {
    left: 100%;
  }
`;
const LoaderBar = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
  left: -100%;
  background: ${(props) => props.theme.secondaryBlue};
  animation: ${LoaderAnimation} 1.5s linear infinite;
  -webkit-animation: ${LoaderAnimation} 1.5s linear infinite;
`;

function NavBarLoader(props: NavbarLoaderProps) {
  return (
    <LoaderContainer>
      <LoaderBar style={{ display: props.isLoading ? "block" : "none" }} />
    </LoaderContainer>
  );
}

export default NavBarLoader;
