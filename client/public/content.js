
// Try multiple methods to get the LeetCode username

function getUsername() {
    // Method 1: GLOBAL_DATA:value (original approach)
    try {
        const data = localStorage.getItem("GLOBAL_DATA:value");
        if (data) {
            const parsed = JSON.parse(data);
            if (parsed.userStatus && parsed.userStatus.username) {
                return parsed.userStatus.username;
            }
        }
    } catch (e) {
        console.log("LeetCode CodeMate: GLOBAL_DATA method failed", e);
    }

    // Method 2: Check all localStorage keys for username patterns
    try {
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.includes("GLOBAL_DATA")) {
                const val = localStorage.getItem(key);
                if (val) {
                    const parsed = JSON.parse(val);
                    if (parsed.userStatus && parsed.userStatus.username) {
                        return parsed.userStatus.username;
                    }
                }
            }
        }
    } catch (e) {
        console.log("LeetCode CodeMate: localStorage scan failed", e);
    }

    // Method 3: Look for username in the page DOM
    try {
        const avatarLink = document.querySelector('a[href^="/u/"]');
        if (avatarLink) {
            const href = avatarLink.getAttribute('href');
            const match = href.match(/\/u\/([^/]+)/);
            if (match) return match[1];
        }
    } catch (e) {
        console.log("LeetCode CodeMate: DOM method failed", e);
    }

    return null;
}

function sendUsername() {
    const username = getUsername();
    if (username) {
        console.log("LeetCode CodeMate: Found username:", username);
        chrome.runtime.sendMessage({ greeting: username }, (response) => {
            console.log("LeetCode CodeMate: Response:", response);
        });
    } else {
        console.log("LeetCode CodeMate: Could not find username, retrying in 3s...");
        setTimeout(sendUsername, 3000);
    }
}

// Run after page fully loads (LeetCode is an SPA, data may load late)
if (document.readyState === 'complete') {
    sendUsername();
} else {
    window.addEventListener('load', () => {
        // Wait a bit for LeetCode's JS to populate localStorage
        setTimeout(sendUsername, 2000);
    });
}
