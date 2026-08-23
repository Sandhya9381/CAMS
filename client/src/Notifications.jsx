
import { useEffect, useState } from "react";

function Notifications({ message, type = "success", onClose }) {

  const [visible, setVisible] = useState(true);


  useEffect(() => {

    const timer = setTimeout(() => {

      setVisible(false);

      if (onClose) {
        onClose();
      }

    }, 3000);


    return () => clearTimeout(timer);

  }, [onClose]);


  if (!visible || !message) {
    return null;
  }


  return (

    <div
      style={{
        position: "fixed",
        top: "25px",
        right: "25px",

        minWidth: "300px",
        maxWidth: "400px",

        padding: "18px 22px",

        borderRadius: "12px",

        backgroundColor: "#ffffff",

        boxShadow:
          "0 8px 25px rgba(0,0,0,0.15)",

        zIndex: 9999,

        borderLeft:
          type === "success"
            ? "5px solid #16a34a"
            : "5px solid #dc2626"
      }}
    >

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "20px"
        }}
      >

        <div>

          <strong
            style={{
              display: "block",
              marginBottom: "5px",
              fontSize: "16px"
            }}
          >
            {type === "success"
              ? "Success"
              : "Notice"}
          </strong>


          <span>
            {message}
          </span>

        </div>


        <button
          onClick={() => {

            setVisible(false);

            if (onClose) {
              onClose();
            }

          }}
          style={{
            border: "none",
            background: "transparent",
            fontSize: "20px",
            cursor: "pointer"
          }}
        >
          ×
        </button>

      </div>

    </div>

  );

}


export default Notifications;