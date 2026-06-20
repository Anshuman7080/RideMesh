import React from "react";
import { toast } from "react-toastify";

const showToastWithRedirect = (options, redirectPath) => {
  const { title, message, type, actionLabel } = options;

  toast(
    <div>
      <strong>{title}</strong>
      <p>{message}</p>
      <button
        style={{
          marginTop: "5px",
          marginLeft: "10px",
          background: "blue",
          color: "white",
          border: "none",
          padding: "5px 10px",
          cursor: "pointer"
        }}
        onClick={redirectPath ? () => (window.location.href = redirectPath) : undefined}
      >
        {actionLabel || "Go"}
      </button>
    </div>,
    {
      autoClose: 5000,
      type: type || "default",
    }
  );
};


export default showToastWithRedirect;
