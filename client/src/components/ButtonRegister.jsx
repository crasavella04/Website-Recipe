import React from 'react';

function ButtonRegister({ children, ...props }) {
  return (
    <button {...props} className="ButtonRegistr">
      {children}
    </button>
  );
}

export default ButtonRegister;