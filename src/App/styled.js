import styled, { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`

  html, body, #devPanelRoot {
    height: 100%;
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
  font-size: 1.5em;
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
  flex: 1;
  padding: 0 10px;
  height: 100%;
  overflow: auto;
`;
