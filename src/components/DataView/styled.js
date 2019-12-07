import styled, { css } from 'styled-components';

export const LayoutContent = styled.div`
  flex: 1;
  height: 100%;
  overflow: auto;
`;

export const DataViewTab = styled.div`
  display: flex;
  border-bottom: 1px solid rgba(255, 255, 255, 0.5);
`;

export const DataViewTabItem = styled.div`
  flex: 1;
  text-align: center;
  padding: 10px;
  color: #fff;
  font-size: 1.2rem;
  cursor: pointer;

  &::first-child {
    border-right: 1px solid rgba(255, 255, 255, 0.5);
  }

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }

  ${props => props.isSelected && css`
    background-color: rgba(255, 255, 255, 0.2);
  `}
`;
