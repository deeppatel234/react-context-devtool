import styled from 'styled-components';

export const DiffViewWrapper = styled.div`
  flex: 1;
  overflow: auto;
  font-size: 1.2rem;
  height: 100%;
  background: ${props => props.theme.editorBackground};
`;

