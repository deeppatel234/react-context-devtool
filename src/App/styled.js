import styled, { createGlobalStyle, css } from 'styled-components';

export const GlobalStyle = createGlobalStyle`

  html {
    font-size: 12px;
  }

  ${props => props.fullHeight && css`
    html, body, #devPanelRoot, #popupRoot {
      height: 100%;
    }
  `}

  #popupRoot {
    width: 800px;
    height: 440px;
  }

  body {
    background-color: ${props => props.theme.background};
    margin: 0;
  }

  .jsonTree {
    height: 100%;
  }
`;

export const AppLayout = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

export const LayoutHeader = styled.div`
  padding: 10px;
  font-size: 1.3rem;
  color: ${props => props.theme.whiteText};
  text-align: center;
  border-bottom: 1px solid ${props => props.theme.borderColor};

  .theme-switcher {
    float: right;
    margin-right: 10px;
  }
`;

export const LayoutBody = styled.div`
  display: flex;
  flex: 1;
  min-height: 0;
`;

export const LayoutSideBar = styled.div`
  height: 100%;
  overflow: auto;
  border-right: 1px solid ${props => props.theme.borderColor};
`;

export const LayoutContent = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 100%;
  overflow: auto;
`;

export const ConfigureText = styled.div`
  color: ${props => props.theme.whiteText};
  text-align: center;

  p {
    white-space: nowrap;
    font-size: 1.3rem;
  }

  .setup-text {
    font-size: 1.1rem;
  }

  a {
    color: ${props => props.theme.whiteText};
  }
`;
