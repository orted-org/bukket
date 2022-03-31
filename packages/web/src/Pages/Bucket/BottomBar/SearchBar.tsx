import styled from "styled-components";
import { PrimaryInputText } from "../../../MicroComponents/InputText";
const SearchContainer = styled.div`
  min-height: 50px;
  max-width: 450px;
  width: 100%;
  display: flex;
  flex-direction: column;
  color: ${(props) => props.theme.secondaryText};
  font-weight: 400;
  /* box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px,
    rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px,
    rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px; */
  @media (max-width: 480px) {
    border-radius: 0;
    search: 0;
  }
`;
interface SearchBarProps {
  onChange: (e: any) => void;
  searchText: string;
}
function SearchBar(props: SearchBarProps) {
  return (
    <SearchContainer>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "50px",
        }}
      >
        <PrimaryInputText
          onChange={props.onChange}
          autoFocus={true}
          value={props.searchText}
          style={{ boxShadow: "none" }}
          placeholder="Search using name, date, tag or remark."
        />
      </div>
    </SearchContainer>
  );
}

export default SearchBar;
