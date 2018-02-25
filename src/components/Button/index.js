import React from 'react';
import { func, string } from 'prop-types';
import StyledButton from './style';

const Button = ({ children, onClick }) => (
  <StyledButton onClick={onClick}>{children}</StyledButton>
);

Button.propTypes = {
  children: string.isRequired,
  onClick: func.isRequired,
};

export default Button;
