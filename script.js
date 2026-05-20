document.addEventListener("DOMContentLoaded", () => {
    // 1. Target the main page title header safely
    const pageTitle = document.querySelector(".pageTitle") || document.querySelector("h1");
    const container = document.querySelector(".container");

    // 2. Generate and Inject the Filter controls block
    const controlsDiv = document.createElement("div");
    controlsDiv.className = "search-controls";
    controlsDiv.innerHTML = `
        <input type="text" id="searchInput" placeholder="🔍 Search resources (e.g., Figma, Code, Certs)...">
        <div class="filter-tags">
            <button class="tag-btn active" data-filter="all">All Items</button>
            <button class="tag-btn" data-filter="software">Software</button>
            <button class="tag-btn" data-filter="website">Web Tools</button>
            <button class="tag-btn" data-filter="certs">Certifications</button>
            <button class="tag-btn" data-filter="projects">My Projects</button>
        </div>
    `;
    
    // Inject at the top under the header title cleanly
    if (pageTitle) {
        pageTitle.insertAdjacentElement("afterend", controlsDiv);
    } else if (container) {
        container.insertBefore(controlsDiv, container.firstChild);
    }

    // 3. Query target content structures
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
            const certCards = section.querySelectorAll(".cert-card");
            const allCards = [...resourceCards, ...projectCards, ...certCards];

            // Index mapping based on your section positions:
            // 0 = Software, 1 = Web Tools, 2 = Certifications, 3 = Projects
            const matchesTag = 
                activeTag === "all" ||
                (activeTag === "software" && index === 0) ||
                (activeTag === "website" && index === 1) ||
                (activeTag === "certs" && index === 2) ||
                (activeTag === "projects" && index === 3);

            if (!matchesTag) {
                section.style.display = "none";
                return;
            }

            allCards.forEach(card => {
                const title = card.querySelector("h3")?.textContent.toLowerCase() || "";
                const desc = card.querySelector("p")?.textContent.toLowerCase() || "";
                const matchesSearch = title.includes(searchText) || desc.includes(searchText);

                if (matchesSearch) {
                    if (card.classList.contains("cert-card")) {
                        card.style.display = "flex"; 
                    } else {
                        card.style.display = "block";
                    }
                    sectionHasVisibleItems = true;
                } else {
                    card.style.display = "none";
                }
            });

            section.style.display = sectionHasVisibleItems ? "block" : "none";
        });
    }

    // 4. Bind Actions for Search & Filter Tags
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

    // 5. DARK MODE THEME SWITCHER LOGIC
    const themeBtn = document.createElement("button");
    themeBtn.className = "theme-toggle-btn";
    themeBtn.setAttribute("aria-label", "Toggle dark theme");
    themeBtn.innerHTML = "🌙"; 
    document.body.appendChild(themeBtn);

    const currentTheme = localStorage.getItem("portfolio-theme");
    if (currentTheme === "dark") {
        document.body.classList.add("dark-theme");
        themeBtn.innerHTML = "☀️"; 
    }

    themeBtn.addEventListener("click", () => {
        document.body.classList.toggle("dark-theme");
        
        let theme = "light";
        if (document.body.classList.contains("dark-theme")) {
            theme = "dark";
            themeBtn.innerHTML = "☀️";
        } else {
            themeBtn.innerHTML = "🌙";
        }
        
        localStorage.setItem("portfolio-theme", theme);
    });
});
