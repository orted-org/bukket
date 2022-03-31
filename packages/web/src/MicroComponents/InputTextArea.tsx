import { useState } from "react";
import styled from "styled-components";

const PrimaryTextAreaContainer = styled.div`
  position: relative;
  width: 100%;
  height: fit-content;
  min-height: 100%;
`;
const CounterText = styled.p`
  height: fit-content;
  font-size: 0.85em;
  min-width: 30px;
  padding: 0 5px;
  text-align: center;
  background: ${(props) => props.theme.primaryBlue};
  color: white;
  position: absolute;
  bottom: 0;
  right: 0;
`;
const StyledPrimaryTextArea = styled.textarea`
  padding: 10px 10px;
  outline: none;
  resize: none;
  border: none;
  font-size: 1em;
  margin: 0;
  vertical-align: bottom;
  min-height: 150px;
  height: 100%;
  font-weight: 400;
  width: 100%;
  border-radius: 0;
  background: ${(props) => props.theme.highlightColor};
  color: ${(props) => props.theme.secondaryText};
  &:focus {
    -webkit-appearance: none;
    box-shadow: inset 0 0 0 2px ${(props) => props.theme.primaryBlue};
  }
`;

interface PrimaryTextAreaProps {
  value?: string;
  placeholder?: string;
  style?: Object;
  onChange?: (e: any) => void;
  limit?: number;
}

function PrimaryTextArea(props: PrimaryTextAreaProps) {
  const [length, setLength] = useState(0);
  return (
    <PrimaryTextAreaContainer>
      <StyledPrimaryTextArea
        value={props.value}
        style={props.style}
        placeholder={props.placeholder}
        onChange={(e) => {
          if (props.onChange) props.onChange(e);
          setLength(e.target.value.length);
        }}
        maxLength={props.limit || 500}
      />
      {length > 0 && props.limit && (
        <CounterText>
          {length <= props.limit ? props.limit - length : "Too Long"}
        </CounterText>
      )}
    </PrimaryTextAreaContainer>
  );
}

export { PrimaryTextArea };
