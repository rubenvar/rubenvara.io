import { createGlobalStyle } from 'styled-components';
import jsYellow from 'javascript-yellow';

const GlobalStyle = createGlobalStyle`
  :root {
    --maxWidth: 50ch;
    --maxCodeWidth: 76ch;

    --smallBr: 6px;
    --bigBr: 13px;
    
    --normalFont: "DM Sans", --apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, 'Open Sans', 'Helvetica Neue', sans-serif;
    --specialFont: "Baloo 2", --apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, 'Open Sans', 'Helvetica Neue', sans-serif;
    --logoFont: "Mansalva", cursive;
    --codeFont: "Victor Mono", PT Mono, Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace;

    --textLineHeight: 1.63793924em;

    --black: hsl(0, 20%, 5%);
    --white: hsl(0, 0%, 99%);

    --primary100: hsl(25, 100%, 96%);
    --primary200: hsl(20, 100%, 88%);
    --primary300: hsl(5, 100%, 80%);
    --primary400: hsl(0, 87%, 65%);
    --primary500: hsl(0, 72%, 50%);
    --primary600: hsl(0, 73%, 40%);
    --primary700: hsl(0, 85%, 28%);
    --primary800: hsl(350, 90%, 18%);
    --primary900: hsl(340, 100%, 8%);

    --secondary500: hsl(180, 64%, 45%);

    --logoGradient: linear-gradient(
      to right,
      hsl(0, 73%, 40%),
      hsl(0, 85%, 28%),
      hsl(0, 72%, 50%),
      hsl(0, 72%, 50%),
      hsl(0, 85%, 28%)
    );
    
    --grey100: hsl(200, 30%, 94%);
    --grey200: hsl(205, 20%, 88%);
    --grey300: hsl(210, 12%, 74%);
    --grey400: hsl(210, 8%, 62%);
    --grey500: hsl(210, 6%, 50%);
    --grey600: hsl(210, 8%, 38%);
    --grey700: hsl(217, 15%, 27%);
    --grey800: hsl(220, 17%, 16%);
    --grey900: hsl(225, 20%, 8%);

    --info400: hsl(0, 0%, 60%);
    --info500: hsl(0, 0%, 45%);
    --info600: hsl(0, 0%, 28%);
    --announce400: hsl(189, 92%, 60%);
    --announce500: hsl(189, 79%, 46%);
    --announce600: hsl(189, 93%, 31%);
    --success400: hsl(112, 83%, 44%);
    --success500: hsl(123, 92%, 35%);
    --success600: hsl(123, 84%, 25%);
    --note400: hsl(59, 83%, 54%);
    --note500: hsl(60, 100%, 41%);
    --note600: hsl(59, 62%, 31%);
    --warning400: hsl(24, 90%, 65%);
    --warning500: hsl(24, 98%, 58%);
    --warning600: hsl(24, 80%, 45%);
    --danger400: hsl(353, 98%, 62%);
    --danger500: hsl(11, 93%, 44%);
    --danger600: hsl(353, 94%, 30%);

    --gap10: 4px;
    --gap20: 8px;
    --gap30: 12px;
    --gap40: 17px;
    --gap50: 20px;
    --gap60: 25px;
    --gap70: 32px;
    --gap80: 42px;
    --gap90: 55px;
    --gap100: 73px;
    --gap110: 96px;
    --gap120: 131px;

    --fontSize10: 0.6rem;
    --fontSize20: 0.75rem;
    --fontSize30: 0.85rem;
    --fontSize40: 1rem;
    --fontSize50: 1.15rem;
    --fontSize60: 1.35rem;
    --fontSize70: 1.6rem;
    --fontSize80: 1.85rem;
    --fontSize90: 2.2rem;
    --fontSize100: 2.55rem;
    --fontSize110: 2.7rem;
    --fontSize150: 3.8rem;

    --focus: orange;

    --javascriptYellow: ${jsYellow};

    --boxShadow100: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
    --boxShadow200: 0 3px 6px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.12);
    --boxShadow300: 0 10px 20px rgba(0, 0, 0, 0.15), 0 3px 6px rgba(0, 0, 0, 0.1);
  }
  html {
    font-family: var(--normalFont);
    font-size: 20px;
    box-sizing: border-box;
    -ms-text-size-adjust: 100%;
    -webkit-text-size-adjust: 100%;
    @media only screen and (max-width: 480px) {
      font-size: 100%;
    }
  }
  *, *::before, *::after {
    box-sizing: inherit;
  }
  body {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: var(--white);
    color: var(--black);
    word-wrap: break-word;
    font-size: 1rem;
    font-kerning: normal;
    -moz-font-feature-settings: "kern", "liga", "clig", "calt";
    -ms-font-feature-settings: "kern", "liga", "clig", "calt";
    -webkit-font-feature-settings: "kern", "liga", "clig", "calt";
    font-feature-settings: "kern", "liga", "clig", "calt";
  }
  audio,
  canvas,
  progress,
  video {
    display: inline-block;
  }
  img {
    max-width: 100%;
    margin: 0;
    padding: 0;
  }
  ::selection {
    background: var(--primary500);
    color: var(--grey100);
  }
  ::-moz-selection {
    background: var(--primary500);
    color: var(--grey100);
  }
  a {
    transition: all 0.3s;
    color: var(--primary500);
  }
  p {
    margin: 0 0 var(--gap60);
    line-height: var(--textLineHeight);
  }
  h1, h2, h3, h4 {
    /* margin: 0; */
    margin: 0 0 var(--gap50);
    text-rendering: optimizeLegibility;
    font-family: var(--specialFont);
    font-weight: 500;
  }
  /* h1 {} */
  h2 {
    margin: var(--gap70) 0 var(--gap60);
    font-size: var(--fontSize80);
  }
  h3 {
    margin: var(--gap30) 0 var(--gap60);
    font-size: var(--fontSize70);
  }
  h4 {
    margin: 0 0 var(--gap60);
    font-size: var(--fontSize60);
  }
  ul, ol {
    margin: 0 0 var(--gap60);
    li {
      line-height: var(--textLineHeight);
      margin-bottom: var(--gap10);
    }
  }
  button {
    cursor: pointer;
  }
  button,
  a {
    &:focus {
      outline: none;
      border: 2px solid var(--focus);
      transition: none;
    }
  }
  code, pre[class*="language-"] {
    font-family: var(--codeFont);
    font-size: var(--fontSize30);
  }
`;

export default GlobalStyle;
