import React from "react";

const NotAuthorized = () => {
  const styles = {
    container: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "100vh",
      backgroundColor: "#E6F3FF",
      color: "#721c24",
      fontFamily: "Arial, sans-serif",
      textAlign: "center",
    },
    title: {
      fontSize: "2.5rem",
      marginBottom: "10px",
    },
    message: {
      fontSize: "1.2rem",
    },
    homeLink: {
      marginTop: "20px",
      display: "inline-block",
      padding: "10px 20px",
      color: "white",
      backgroundColor: "#dc3545",
      textDecoration: "none",
      borderRadius: "5px",
      transition: "background 0.3s ease",
    },
    homeLinkHover: {
      backgroundColor: "#c82333",
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>403 - Access Denied</h1>
      <p style={styles.message}>
        You do not have permission to access this page.
      </p>
      <a
        href="/"
        style={styles.homeLink}
        onMouseEnter={(e) =>
          (e.target.style.backgroundColor =
            styles.homeLinkHover.backgroundColor)
        }
        onMouseLeave={(e) =>
          (e.target.style.backgroundColor = styles.homeLink.backgroundColor)
        }
      >
        Go to Homepage
      </a>
    </div>
  );
};

export default NotAuthorized;
