function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000); // Convert days to milliseconds
    const expires = "expires=" + date.toUTCString();
    document.cookie = `${name}=${value}; ${expires}; path=/`;
}

function getCookie(name) {
    const cookies = document.cookie.split("; ");
    for (let i = 0; i < cookies.length; i++) {
        const [key, val] = cookies[i].split("=");
        if (key === name) {
            return decodeURIComponent(val);
        }
    }
    return null; // Return null if the cookie isn't found
}

function getDeviceFingerprint() {
    const idKey = 'device_fingerprint';

    // Retrieve the unique ID from localStorage if it exists
    let fingerprint = localStorage.getItem(idKey);
    if (!fingerprint) {
        // Generate a fingerprint based on device/browser details
        const deviceInfo = [
            navigator.userAgent, // Browser info
            navigator.language,  // User language
            navigator.platform,  // Platform (Windows, Mac, etc.)
            screen.width,        // Screen width
            screen.height,       // Screen height
            new Date().getTimezoneOffset() // Timezone offset
        ].join('-');

        fingerprint = btoa(deviceInfo); // Base64 encode to create a shorter ID
        localStorage.setItem(idKey, fingerprint); // Store it persistently
    }

    return fingerprint;
}

function submitIdentificationForm() {
    const formUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSfD_r1VKiL6gRcQPtpKGxRYBY8I9rt74c7nkTPEUpZm6bkVhg/formResponse';

    // Get saved username from cookie
    const savedUsername = getCookie("discordUsername");

    // Get device fingerprint (call the function to get the fingerprint)
    const fingerprint = getDeviceFingerprint(); // This function should return the device fingerprint

    // Get the current page URL
    const pageURL = window.location.href;

    // Create the URL with query parameters for submission
    const queryParams = new URLSearchParams({
        'entry.1463441837': fingerprint,  // Fingerprint
        'entry.1700737489': pageURL,      // Page URL
        'entry.48526913': savedUsername   // Associated Username
    });

    // Submit the form using fetch
    fetch(`${formUrl}?${queryParams.toString()}`, {
        method: 'POST',
        mode: 'no-cors'  // no-cors to avoid CORS issues with Google Forms
    })
        .then(() => console.log('Form submitted!'))
        .catch(err => console.error('Error submitting form:', err));
}
