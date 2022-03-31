import UnorderedListItem from "../MicroComponents/UnorderedListItem";
interface UnorderedListProps {
  listItems: JSX.Element[];
  style?: Object;
}
function UnorderedList(props: UnorderedListProps) {
  return (
    <div style={props.style}>
      {props.listItems.map((item, index) => {
        return <UnorderedListItem element={item} key={"UL" + item} />;
      })}
    </div>
  );
}

export default UnorderedList;
