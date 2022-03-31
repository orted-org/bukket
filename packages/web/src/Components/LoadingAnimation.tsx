import styled from "styled-components";
import { keyframes } from "styled-components";
const LoadingKeyframe = keyframes`
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
`;

const StyledLoading = styled.div`
  height: 100px;
  width: 100px;
  content: "";
  box-sizing: border-box;
  height: 50px;
  width: 50px;
  border: 2px solid transparent;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  border-top-color: ${(props) => props.theme.secondaryBlue};
  border-bottom-color: ${(props) => props.theme.secondaryBlue};
  animation: ${LoadingKeyframe} 0.7s ease-in-out infinite;
  z-index: 9;
`;
function LoadingAnimation() {
  return (
    <div
      style={{
        padding: "50px",
        paddingTop: "100px",
        height: "100%",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <StyledLoading />
    </div>
  );
}
export default LoadingAnimation;
