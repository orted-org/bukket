import { useTheme } from "styled-components";

function LineSeparator() {
  const theme = useTheme() as any;
  return (
    <div
      style={{
        width: "100%",
        height: "2px",
        background: theme.highlightColor,
        margin: "10px 0",
      }}
    />
  );
}
export default LineSeparator;
