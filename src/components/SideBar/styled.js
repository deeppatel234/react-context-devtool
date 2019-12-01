import styled, { css } from 'styled-components';

export const SideBarWrapper = styled.div`
  width: 200px;
`;

export const SideBarItem = styled.div`
  padding: 10px 20px;
  color: #fff;
  font-size: 1.3em;
  border-bottom: 1px solid rgba(255, 255, 255, 0.5);
  cursor: pointer;

  ${props => props.isSelected && css`
    background-color: rgba(255, 255, 255, 0.2);
  `}
`;
