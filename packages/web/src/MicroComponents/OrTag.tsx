
import { useTheme } from "styled-components";

function OrTag() {
  const theme = useTheme() as any;
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          background: theme.secondaryText,
          width: "25px",
          height: "2px",
          opacity: "0.4",
          marginRight: "10px",
        }}
      />
      <h4
        style={{
          color: theme.secondaryText,
          opacity: "0.4",
        }}
      >
        OR
      </h4>
      <div
        style={{
          background: theme.secondaryText,
          width: "25px",
          height: "2px",
          opacity: "0.4",
          marginLeft: "10px",
        }}
      />
    </div>
  );
}
export default OrTag;
