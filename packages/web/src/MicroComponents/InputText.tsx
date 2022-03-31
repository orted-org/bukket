import styled from "styled-components";

const PrimaryInputTextContainer = styled.div`
  position: relative;
  width: 100%;
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
const StyledPrimaryInputText = styled.input`
  padding: 0 10px;
  outline: none;
  border: none;
  font-size: 1em;
  height: 50px;
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

interface PrimaryInputTextProps {
  value?: string;
  placeholder?: string;
  style?: Object;
  onChange?: (e: any) => void;
  limit?: number;
  autoFocus?: boolean;
  isDisabled?: boolean;
}

function PrimaryInputText(props: PrimaryInputTextProps) {
  const length = props.value?.length || 0;
  return (
    <PrimaryInputTextContainer>
      <StyledPrimaryInputText
        disabled={props.isDisabled}
        autoFocus={props.autoFocus}
        value={props.value}
        style={props.style}
        placeholder={props.placeholder}
        onChange={(e) => {
          if (props.onChange) props.onChange(e);
        }}
        type="text"
        maxLength={props.limit || 500}
      />
      {length > 0 && props.limit && (
        <CounterText>
          {length <= props.limit ? props.limit - length : "Too Long"}
        </CounterText>
      )}
    </PrimaryInputTextContainer>
  );
}

export { PrimaryInputText };
