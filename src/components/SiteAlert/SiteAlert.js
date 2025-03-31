import React, { useState } from "react";
import PropTypes from "prop-types";
import "./SiteAlert.css";

/**
 * SiteAlert component  - This component is used to display an alert message on the site.
 * @param {string} variant - The variant of the alert (e.g., info, error).
 * @param {string} title - The title of the alert.
 * @param {string} info - The information to be displayed in the alert.
 * @param {boolean} hideClose - A boolean value to determine if the close button should be hidden.
 * @returns {JSX.Element}
 */

const SiteAlert = ({ variant = "info", title, info, alertClosable = false}) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }
    
  return (
    <section
      className={`evs-site-alert evs-site-alert--${variant}`}
      aria-label={`Site Alert ${variant} Message`}
    >
      <div className="evs-alert">
        <div className="evs-alert__body">
          {title && <h2>{title}</h2>}
          <p style={{ margin: 0 }}>{info}</p>
        </div>
        {alertClosable && (
          <button
            className="evs-alert__nci-button evs-alert__nci-button--close"
            aria-label="Dismiss alert"
            onClick={handleClose}
          >
            <svg
              className="evs-icon"
              role="img"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="2"
                d="M0 13.0332964L13.0332964 0M13.0332964 13.0332964L0 0"
                transform="translate(1 1)"
              ></path>
            </svg>
          </button>
        )}
      </div>
    </section>
  );
};

// PropTypes for SiteAlert component
SiteAlert.propTypes = {
  variant: PropTypes.string,
  title: PropTypes.string,
  info: PropTypes.string.isRequired,
  alertClosable: PropTypes.bool,
};

export default SiteAlert;
