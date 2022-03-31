import styled from "styled-components";
const Track = styled.div`
  height: 12px;
  width: 35px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  position: relative;
  cursor: pointer;
  transition: all 1s;
  justify-content: flex-start;
`;
const Thumb = styled.div`
  height: 20px;
  width: 20px;
  border-radius: 8px;
  background: #666666;
`;
interface SwitchProps {
  isOn?: boolean;
  onclick: () => void;
}
function Switch(props: SwitchProps) {
  return (
    <Track
      style={{
        background: props.isOn ? "#86a3ff" : "#c2c2c2",
        justifyContent: props.isOn ? "flex-end" : "flex-start",
      }}
      onClick={props.onclick}
    >
      <Thumb />
    </Track>
  );
}

export default Switch;
