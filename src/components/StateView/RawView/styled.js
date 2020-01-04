import styled from 'styled-components';

export const RawViewWrapper = styled.div`
  flex: 1;
  overflow: auto;
  font-size: 1.2rem;
  height: 100%;
  background: ${props => props.theme.editorBackground};

  .CodeMirror {
    height: 100%;
  }
`;

