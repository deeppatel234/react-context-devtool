import styled, { css } from 'styled-components';

export const StateViewTab = styled.div`
  display: flex;
  border-bottom: 1px solid ${props => props.theme.borderColor};
`;

export const StateViewTabItem = styled.div`
  position: relative;
  padding: 10px 30px;
  color: ${props => props.theme.whiteText};
  font-size: 1.2rem;
  cursor: pointer;

  &:hover {
    background-color: ${props => props.theme.hoverBackground};
  }

  ${props => props.isSelected && css`
    background-color: ${props => props.theme.editorBackground};

    &::after {
      position: absolute;
      content: '';
      height: 2px;
      width: 100%;
      background-color: ${props => props.theme.editorBackground};
      left: 0;
      bottom: -1px;
    }
  `}
`;

