/**
 * Sets a cookie with the specified name, value, and expiration time in days.
 * 
 * @param {string} name - The name of the cookie.
 * @param {string} value - The value of the cookie.
 * @param {number} days - The number of days until the cookie expires.
 */
function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000); // Convert days to milliseconds
    const expires = "expires=" + date.toUTCString();
    document.cookie = `${name}=${value}; ${expires}; path=/`;
}

/**
 * Retrieves the value of a cookie by its name.
 * 
 * @param {string} name - The name of the cookie to retrieve.
 * @returns {string|null} The cookie value, or null if the cookie doesn't exist.
 */
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

/**
 * Generates a unique device fingerprint based on browser/device details.
 * 
 * @returns {string} The base64-encoded device fingerprint.
 */
function getDeviceFingerprint() {
    const idKey = 'device_fingerprint';

    // Retrieve the unique ID from localStorage if it exists
    let fingerprint = localStorage.getItem(idKey);
    if (!fingerprint) {
        // Collect device and browser details
        const userAgent = navigator.userAgent;
        const language = navigator.language;
        const platform = navigator.platform;
        const deviceMemory = navigator.deviceMemory || 'N/A'; // If not available, default to 'N/A'
        const hardwareConcurrency = navigator.hardwareConcurrency || 'N/A';
        const screenWidth = screen.width;
        const screenHeight = screen.height;
        const colorDepth = screen.colorDepth;
        const timezoneOffset = new Date().getTimezoneOffset();
        const vendor = navigator.vendor || 'N/A';
        const product = navigator.product || 'N/A';
        const maxTouchPoints = navigator.maxTouchPoints || 'N/A';
        const vendorSub = navigator.vendorSub || 'N/A';
        const storageEstimate = navigator.storage.estimate ? navigator.storage.estimate().quota : 'N/A'; // Estimate available storage

        // Construct a string with "|--|" separator
        const deviceInfo = [
            userAgent,
            language,
            platform,
            deviceMemory,
            hardwareConcurrency,
            screenWidth,
            screenHeight,
            colorDepth,
            timezoneOffset,
            vendor,
            product,
            maxTouchPoints,
            vendorSub,
            storageEstimate
        ].join('|--|');

        fingerprint = btoa(deviceInfo); // Base64 encode to create a shorter ID

        // Store the fingerprint in localStorage to avoid recalculating it on each page load
        localStorage.setItem(idKey, fingerprint); // Store it persistently
        setCookie(idKey, fingerprint, 7 * 24 * 60);
    }

    return fingerprint;
}

/**
 * Submits the user identification form with the device fingerprint and associated username.
 * 
 * @param {string} User - The name of the cookie containing the saved username.
 */
function submitIdentificationForm(User) {
    const formUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSfD_r1VKiL6gRcQPtpKGxRYBY8I9rt74c7nkTPEUpZm6bkVhg/formResponse';

    // Get saved username from cookie
    const savedUsername = getCookie(User);

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
