export const handleEmailEnquiry = (email, subjectText, bodyText = "") => {
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const emailAddress = encodeURIComponent(email);
  const subject = encodeURIComponent(subjectText);
  const body = encodeURIComponent(bodyText);

  if (isMobile) {
    window.location.href = `mailto:${emailAddress}?subject=${subject}&body=${body}`;
  } else {
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${emailAddress}&su=${subject}&body=${body}`;
    window.open(gmailUrl, '_blank');
  }
};
