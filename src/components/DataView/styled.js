import styled, { css } from 'styled-components';

export const LayoutContent = styled.div`
  flex: 1;
  height: 100%;
  overflow: auto;
`;

export const DataViewTab = styled.div`
  display: flex;
  border-bottom: 1px solid ${props => props.theme.borderColor};
`;

export const DataViewTabItem = styled.div`
  flex: 1;
  text-align: center;
  padding: 10px;
  color: ${props => props.theme.whiteText};
  font-size: 1.2rem;
  cursor: pointer;

  &::first-child {
    border-right: 1px solid ${props => props.theme.borderColor};
  }

  &:hover {
    background-color: ${props => props.theme.hoverBackground};
  }

  ${props => props.isSelected && css`
    background-color: ${props => props.theme.selectedBackground};
  `}
`;
