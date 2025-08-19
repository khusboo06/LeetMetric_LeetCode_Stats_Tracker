document.addEventListener("DOMContentLoaded", () => {
    const searchButton = document.getElementById("search-btn");
    const refreshButton = document.getElementById("refresh-btn");
    const usernameInput = document.getElementById("user-input");
    const easyProgressCircle = document.querySelector(".easy-progress");
    const mediumProgressCircle = document.querySelector(".medium-progress");
    const hardProgressCircle = document.querySelector(".hard-progress");
    const easyLabel = document.getElementById("easy-label");
    const mediumLabel = document.getElementById("medium-label");
    const hardLabel = document.getElementById("hard-label");
    const rankingContainer = document.getElementById("ranking-container");
    const rankingLabel = document.getElementById("ranking-label");
    const message = document.getElementById("message");
    const themeToggle = document.getElementById("theme-toggle");

    // Theme toggle
    themeToggle.addEventListener("click", () => {
        document.body.classList.toggle("light");
        themeToggle.textContent = document.body.classList.contains("light") ? "🌙 Dark Mode" : "☀️ Light Mode";
    });

    function showMessage(msg, isError = true) {
        message.textContent = msg;
        message.style.color = isError ? "red" : "green";
    }

    function validateUsername(username) {
        if (username.trim() === "") {
            showMessage("⚠️ Username cannot be empty.");
            return false;
        }
        const regex = /^[a-zA-Z0-9_-]{1,20}$/;
        if (!regex.test(username)) {
            showMessage("❌ Invalid username format.");
            return false;
        }
        return true;
    }

    async function fetchUserDetails(username) {
        const url = `https://leetcode-stats-api.herokuapp.com/${username}`;
        try {
            showMessage("");
            searchButton.disabled = true;
            searchButton.textContent = "Searching...";

            const res = await fetch(url);
            if (!res.ok) throw new Error("User not found");

            const data = await res.json();
            displayUserData(data);
            showMessage("✅ Data loaded!", false);
        } catch (err) {
            showMessage("❌ Failed to fetch user data.");
        } finally {
            searchButton.disabled = false;
            searchButton.textContent = "Search";
        }
    }

    function updateProgress(solved, total, label, circle) {
        const degree = total > 0 ? (solved / total) * 100 : 0;
        label.textContent = `${solved}/${total}`;
        setTimeout(() => {
            circle.style.setProperty("--progress-degree", `${degree}%`);
        }, 100);
    }

    function displayUserData(data) {
        updateProgress(data.easySolved, data.totalEasy, easyLabel, easyProgressCircle);
        updateProgress(data.mediumSolved, data.totalMedium, mediumLabel, mediumProgressCircle);
        updateProgress(data.hardSolved, data.totalHard, hardLabel, hardProgressCircle);

        // Mini stats badges
        document.getElementById("easy-badge").textContent = data.easySolved;
        document.getElementById("medium-badge").textContent = data.mediumSolved;
        document.getElementById("hard-badge").textContent = data.hardSolved;

        // Total solved & success rate
        const totalSolved = data.easySolved + data.mediumSolved + data.hardSolved;
        const totalProblems = data.totalEasy + data.totalMedium + data.totalHard;
        document.getElementById("total-solved").textContent = totalSolved;
        document.getElementById("success-rate").textContent = totalProblems > 0 ? `${Math.round((totalSolved / totalProblems) * 100)}%` : "0%";

        rankingLabel.textContent = data.ranking || "N/A";
        rankingContainer.style.display = "block";
    }

    function resetAll() {
        usernameInput.value = "";
        easyLabel.textContent = "";
        mediumLabel.textContent = "";
        hardLabel.textContent = "";
        easyProgressCircle.style.setProperty("--progress-degree", "0%");
        mediumProgressCircle.style.setProperty("--progress-degree", "0%");
        hardProgressCircle.style.setProperty("--progress-degree", "0%");
        document.getElementById("easy-badge").textContent = "0";
        document.getElementById("medium-badge").textContent = "0";
        document.getElementById("hard-badge").textContent = "0";
        document.getElementById("total-solved").textContent = "0";
        document.getElementById("success-rate").textContent = "0%";
        rankingLabel.textContent = "";
        rankingContainer.style.display = "none";
        showMessage("");
    }

    searchButton.addEventListener("click", () => {
        const username = usernameInput.value.trim();
        if (validateUsername(username)) {
            fetchUserDetails(username);
        }
    });

    refreshButton.addEventListener("click", resetAll);

    usernameInput.addEventListener("keypress", e => {
        if (e.key === "Enter") searchButton.click();
    });
});
