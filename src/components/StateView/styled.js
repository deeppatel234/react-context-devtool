import styled, { css } from 'styled-components';

export const StateViewTab = styled.div`
  display: flex;
  border-bottom: 1px solid rgba(255, 255, 255, 0.5);
`;

export const StateViewTabItem = styled.div`
  position: relative;
  padding: 10px 30px;
  color: #fff;
  font-size: 1.2em;
  cursor: pointer;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }

  ${props => props.isSelected && css`
    background-color: rgb(39, 40, 34);

    &::after {
      position: absolute;
      content: '';
      height: 2px;
      width: 100%;
      background-color: rgb(39,40,34);
      left: 0;
      bottom: -1px;
    }
  `}
`;

