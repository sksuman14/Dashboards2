/**
 * Opens an email composition window. 
 * On mobile, it uses the device's default email app.
 * On desktop, it opens Gmail in a new browser tab.
 * 
 * @param {string} recipient - The email address to send to.
 * @param {string} subject - The subject line of the email.
 * @param {string} body - The pre-filled body text of the email.
 */
export const sendEmail = (recipient: string, subject: string, body: string) => {
  // 1. Check if the user is on a mobile device
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  if (isMobile) {
    // 2. Mobile: Use the default mail app
    window.location.href = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  } else {
    // 3. Desktop: Open Gmail in a new tab
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${recipient}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(gmailUrl, '_blank');
  }
};
