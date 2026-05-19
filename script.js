document.addEventListener("DOMContentLoaded", () => {
    const pageTitle = document.querySelector(".pageTitle");

    // 1. Generate and Inject the Filter controls block
    const controlsDiv = document.createElement("div");
    controlsDiv.className = "search-controls";
    controlsDiv.innerHTML = `
        <input type="text" id="searchInput" placeholder="🔍 Search resources (e.g., Figma, Code)...">
        <div class="filter-tags">
            <button class="tag-btn active" data-filter="all">All Items</button>
            <button class="tag-btn" data-filter="software">Software</button>
            <button class="tag-btn" data-filter="website">Web Tools</button>
            <button class="tag-btn" data-filter="projects">My Projects</button>
        </div>
    `;
    if (pageTitle) {
        pageTitle.insertAdjacentElement("afterend", controlsDiv);
    }

    // 2. Query target content structures
    const sections = document.querySelectorAll(".resourceContainer");
    const searchInput = document.getElementById("searchInput");
    const tagButtons = document.querySelectorAll(".tag-btn");

    function filterItems() {
        const searchText = searchInput.value.toLowerCase().trim();
        const activeTag = document.querySelector(".tag-btn.active").getAttribute("data-filter");

        sections.forEach((section, index) => {
            let sectionHasVisibleItems = false;
            const resourceCards = section.querySelectorAll(".resource-card");
            const projectCards = section.querySelectorAll(".project-card");
            const allCards = [...resourceCards, ...projectCards];

            // Map sections based on their order of appearance in your HTML document
            // Index 0 = Software, Index 1 = Website Resources, Index 2 = My Projects
            const matchesTag = 
                activeTag === "all" ||
                (activeTag === "software" && index === 0) ||
                (activeTag === "website" && index === 1) ||
                (activeTag === "projects" && index === 2);

            if (!matchesTag) {
                section.style.display = "none";
                return;
            }

            // Look inside current active section card collections
            allCards.forEach(card => {
                const title = card.querySelector("h3")?.textContent.toLowerCase() || "";
                const desc = card.querySelector("p")?.textContent.toLowerCase() || "";
                const matchesSearch = title.includes(searchText) || desc.includes(searchText);

                if (matchesSearch) {
                    card.style.display = "block";
                    sectionHasVisibleItems = true;
                } else {
                    card.style.display = "none";
                }
            });

            // Show section only if search conditions match inner contents
            section.style.display = sectionHasVisibleItems ? "block" : "none";
        });
    }

    // 3. Bind Actions for Search & Filter Tags
    if (searchInput) {
        searchInput.addEventListener("input", filterItems);
    }

    tagButtons.forEach(btn => {
        btn.addEventListener("click", (e) => {
            tagButtons.forEach(b => b.classList.remove("active"));
            e.target.classList.add("active");
            filterItems();
        });
    });

    // 4. DARK MODE THEME SWITCHER LOGIC
    const themeBtn = document.createElement("button");
    themeBtn.className = "theme-toggle-btn";
    themeBtn.setAttribute("aria-label", "Toggle dark theme");
    themeBtn.innerHTML = "🌙"; 
    document.body.appendChild(themeBtn);

    // Check if user has used dark mode previously on this browser session
    const currentTheme = localStorage.getItem("portfolio-theme");
    if (currentTheme === "dark") {
        document.body.classList.add("dark-theme");
        themeBtn.innerHTML = "☀️"; 
    }

    // Toggle the theme class layout state on user click
    themeBtn.addEventListener("click", () => {
        document.body.classList.toggle("dark-theme");
        
        let theme = "light";
        if (document.body.classList.contains("dark-theme")) {
            theme = "dark";
            themeBtn.innerHTML = "☀️";
        } else {
            themeBtn.innerHTML = "🌙";
        }
        
        // Save state utility configuration to browser memory
        localStorage.setItem("portfolio-theme", theme);
    });
});
