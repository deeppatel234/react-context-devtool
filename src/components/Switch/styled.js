import styled from "styled-components";

export const Slider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: 0.4s;
  transition: 0.4s;
  border-radius: 34px;

  &:before {
    position: absolute;
    content: "";
    height: 20px;
    width: 20px;
    left: 2px;
    bottom: 2px;
    border-radius: 50%;
    background-color: white;
    -webkit-transition: 0.4s;
    transition: 0.4s;
  }
`;

export const Checkbox = styled.input`
  opacity: 0;
  width: 0;
  height: 0;
`;

export const SwitchWrapper = styled.label`
  position: relative;
  display: inline-block;
  width: 48px;
  height: 24px;

  ${Checkbox}:checked + ${Slider} {
    background-color: #2196f3;
  }

  ${Checkbox}:focus + ${Slider} {
    box-shadow: 0 0 1px #2196f3;
  }

  ${Checkbox}:checked + ${Slider}:before {
    transform: translateX(24px);
  }
`;
