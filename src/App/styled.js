import styled, { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`

  html {
    font-size: 16px;
  }

  html, body, #devPanelRoot, #popupRoot {
    height: 100%;
  }

  #popupRoot {
    width: 800px;
    height: 440px;
  }

  body {
    background-color: #292D3E;
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
  color: #fff;
  font-size: 1.3em;
  text-align: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.5);
`;

export const LayoutBody = styled.div`
  display: flex;
  flex: 1;
  min-height: 0;
`;

export const LayoutSideBar = styled.div`
  height: 100%;
  overflow: auto;
  border-right: 1px solid rgba(255, 255, 255, 0.5);
`;

export const LayoutContent = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 100%;
  overflow: auto;
`;
