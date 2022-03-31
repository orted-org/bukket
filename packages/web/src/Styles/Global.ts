import { createGlobalStyle } from 'styled-components'

const LightTheme = {
    primaryBackground: "#f1f2f5",
    primaryLayer: "#ffffff",
    primaryText: "rgb(10,0,21)",
    secondaryText: "rgba(10,0,21,0.6)",
    highlightColor: "rgba(10,0,21,0.07)",
    primaryRed: "#AF5454",
    secondaryRed: "#DF8D8D",
    primaryGreen: "#218857",
    secondaryGreen: "#9dffba",
    primaryBlue: "#6454e4",
    secondaryBlue: "#4e78e8",
}
const DarkTheme = {
    primaryBackground: "#212121",
    primaryLayer: "#2c2c2c",
    primaryText: "rgba(255,255,255,0.95)",
    secondaryText: "rgba(255,255,255,0.80)",
    highlightColor: "rgba(255,255,255,0.07)",
    primaryRed: "#cf9898",
    secondaryRed: "#DF8D8D",
    primaryGreen: "#3eb37c",
    secondaryGreen: "#9dffba",
    primaryBlue: "#7465e7",
    secondaryBlue: "#6086ea",
}

type ThemeType = typeof DarkTheme
const GlobalStyle = createGlobalStyle<{ theme: ThemeType }>`
    *{
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        font-family: 'Nunito Sans', sans-serif;
        scrollbar-width: thin;         
        scrollbar-color: ${(props) => props.theme.secondaryText} ${(props) => props.theme.highlightColor};
    }
    *::-webkit-scrollbar {
        width: 6px;
    }

    *::-webkit-scrollbar-track {
        background: ${(props) => props.theme.highlightColor};
    }

    *::-webkit-scrollbar-thumb {
        background-color: ${(props) => props.theme.secondaryText};
    }
    body{
        background: ${(props) => props.theme.primaryBackground};
        position: relative;
        padding-bottom: 50px;
    }
`;

export { GlobalStyle, LightTheme, DarkTheme }