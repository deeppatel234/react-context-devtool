import styled, { css } from 'styled-components';

export const SideBarWrapper = styled.div`
  width: 200px;
`;

export const SideBarTitle = styled.div`
  color: ${props => props.theme.whiteText};
  padding: 25px 20px;
  font-size: 1.2rem;
`;

export const SideBarItem = styled.div`
  padding: 10px 20px;
  color: ${props => props.theme.whiteText};
  font-size: 1.1rem;
  border-top: 1px solid ${props => props.theme.borderColor};
  cursor: pointer;

  &:hover {
    background-color: ${props => props.theme.hoverBackground};
  }

  ${props => props.isSelected && css`
    background-color: ${props => props.theme.selectedBackground};
  `}
`;
