import React from 'react'

const Button = ({children, onClick, type = 'button', className = '', ...props}) => {
  return (
    <button
        type={type}
        onClick={onClick}
        className={`bg-accent text-sm text-primary px-7 py-3 rounded-lg w-fit hover:bg-hover-green shadow-md
                  focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 transition-colors duration-300 ${className}`}
        {...props}
    >
        {children}
    </button>
  )
}

export default Button