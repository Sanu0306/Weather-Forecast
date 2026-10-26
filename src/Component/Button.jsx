import React from "react";

const Button = ({ onClick, value, type = "button", loading = false }) => {
  return (
    <button className="btn" type={type} onClick={onClick} disabled={loading}>
      {loading ? "Searching..." : value}
    </button>
  );
};

export default Button;
