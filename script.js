/* =====================================================
   STUDYSYNC - STUDENT GROUP STUDY SCHEDULER

   SWD 417 ASSIGNMENT

   Student: Abdullahi Isyak Maikudi
   Matric Number: 2025/HND/SWD/074

   Technologies: HTML, CSS, JavaScript
===================================================== */

"use strict";

/* =====================================================
   1. LOCAL STORAGE KEYS
===================================================== */

const GROUPS_STORAGE_KEY = "studysync_groups";
const SESSIONS_STORAGE_KEY = "studysync_sessions";
const THEME_STORAGE_KEY = "studysync_theme";


/* =====================================================
   2. SELECT HTML ELEMENTS
===================================================== */

// Sidebar and navigation

const sidebar = document.getElementById("sidebar");
const menuToggle = document.getElementById("menuToggle");
const menuItems = document.querySelectorAll(".menu-item");
const themeToggle = document.getElementById("themeToggle");

const pageTitle = document.getElementById("pageTitle");

// Dashboard sections

const statsSection = document.getElementById("statsSection");
const welcomeBanner = document.getElementById("welcomeBanner");

const sessionsSection = document.getElementById("sessionsSection");
const groupsSection = document.getElementById("groupsSection");

const sessionsHeading = document.getElementById("sessionsHeading");

// Statistics

const totalGroupsElement = document.getElementById("totalGroups");
const upcomingSessionsElement = document.getElementById("upcomingSessions");
const completedSessionsElement = document.getElementById("completedSessions");
const totalSessionsElement = document.getElementById("totalSessions");

// Containers

const groupsContainer = document.getElementById("groupsContainer");
const sessionsContainer = document.getElementById("sessionsContainer");

const groupsEmpty = document.getElementById("groupsEmpty");
const sessionsEmpty = document.getElementById("sessionsEmpty");

// Search and filter

const searchSessions = document.getElementById("searchSessions");
const statusFilter = document.getElementById("statusFilter");

// Buttons

const createGroupBtn = document.getElementById("createGroupBtn");
const createSessionBtn = document.getElementById("createSessionBtn");

const welcomeScheduleBtn = document.getElementById("welcomeScheduleBtn");

const emptyGroupBtn = document.getElementById("emptyGroupBtn");
const emptySessionBtn = document.getElementById("emptySessionBtn");

// Group modal

const groupModal = document.getElementById("groupModal");
const groupModalTitle = document.getElementById("groupModalTitle");

const groupForm = document.getElementById("groupForm");

const groupIdInput = document.getElementById("groupId");
const groupNameInput = document.getElementById("groupName");
const groupSubjectInput = document.getElementById("groupSubject");
const groupDescriptionInput = document.getElementById("groupDescription");
const groupMembersInput = document.getElementById("groupMembers");

const closeGroupModalBtn = document.getElementById("closeGroupModal");
const cancelGroupBtn = document.getElementById("cancelGroupBtn");

// Session modal

const sessionModal = document.getElementById("sessionModal");
const sessionModalTitle = document.getElementById("sessionModalTitle");

const sessionForm = document.getElementById("sessionForm");

const sessionIdInput = document.getElementById("sessionId");
const sessionTitleInput = document.getElementById("sessionTitle");
const sessionGroupInput = document.getElementById("sessionGroup");

const sessionDateInput = document.getElementById("sessionDate");
const sessionTimeInput = document.getElementById("sessionTime");
const sessionDurationInput = document.getElementById("sessionDuration");

const sessionLocationInput = document.getElementById("sessionLocation");
const sessionDescriptionInput = document.getElementById("sessionDescription");

const closeSessionModalBtn = document.getElementById("closeSessionModal");
const cancelSessionBtn = document.getElementById("cancelSessionBtn");


/* =====================================================
   3. APPLICATION VARIABLES
===================================================== */

let groups = loadData(GROUPS_STORAGE_KEY);

let sessions = loadData(SESSIONS_STORAGE_KEY);

let currentView = "dashboard";

let searchTerm = "";

let selectedStatus = "all";

let lastFocusedElement = null;


/* =====================================================
   4. LOAD DATA FROM LOCAL STORAGE
===================================================== */

function loadData(key) {

    try {

        const savedData = localStorage.getItem(key);

        if (!savedData) {
            return [];
        }

        const parsedData = JSON.parse(savedData);

        if (Array.isArray(parsedData)) {
            return parsedData;
        }

        return [];

    } catch (error) {

        console.error("Error loading data:", error);

        return [];

    }

}


/* =====================================================
   5. SAVE DATA TO LOCAL STORAGE
===================================================== */

function saveData(key, data) {

    try {

        localStorage.setItem(
            key,
            JSON.stringify(data)
        );

        return true;

    } catch (error) {

        console.error("Error saving data:", error);

        alert(
            "Unable to save your changes. " +
            "Please check your browser storage."
        );

        return false;

    }

}


/* =====================================================
   6. GENERATE UNIQUE ID
===================================================== */

function generateId() {

    if (
        window.crypto &&
        typeof crypto.randomUUID === "function"
    ) {

        return crypto.randomUUID();

    }

    return (
        Date.now().toString(36) +
        Math.random().toString(36).slice(2)
    );

}


/* =====================================================
   7. FORMAT DATE
===================================================== */

function formatDate(dateString) {

    if (!dateString) {
        return "Unknown date";
    }

    const date = new Date(dateString + "T00:00:00");

    if (Number.isNaN(date.getTime())) {
        return "Invalid date";
    }

    return date.toLocaleDateString("en-NG", {

        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric"

    });

}


/* =====================================================
   8. FORMAT TIME
===================================================== */

function formatTime(timeString) {

    if (!timeString) {
        return "Unknown time";
    }

    const [hours, minutes] = timeString.split(":").map(Number);

    const date = new Date();

    date.setHours(hours, minutes, 0, 0);

    return date.toLocaleTimeString("en-NG", {

        hour: "numeric",
        minute: "2-digit",
        hour12: true

    });

}


/* =====================================================
   9. FORMAT DURATION
===================================================== */

function formatDuration(minutes) {

    const duration = Number(minutes);

    if (duration < 60) {
        return `${duration} minutes`;
    }

    const hours = Math.floor(duration / 60);

    const remainingMinutes = duration % 60;

    if (remainingMinutes === 0) {

        return `${hours} hour${hours > 1 ? "s" : ""}`;

    }

    return `${hours} hr ${remainingMinutes} min`;

}


/* =====================================================
   10. GET SESSION STATUS
===================================================== */

function getSessionStatus(session) {

    if (session.completed === true) {
        return "completed";
    }

    const startDateTime = new Date(
        `${session.date}T${session.time}:00`
    );

    const endDateTime = new Date(
        startDateTime.getTime() +
        Number(session.duration) * 60000
    );

    const now = new Date();

    if (endDateTime < now) {
        return "past";
    }

    return "upcoming";

}


/* =====================================================
   11. CREATE HTML ELEMENT HELPER
===================================================== */

function createElement(tag, className, text = "") {

    const element = document.createElement(tag);

    if (className) {
        element.className = className;
    }

    if (text !== "") {
        element.textContent = text;
    }

    return element;

}


/* =====================================================
   12. OPEN MODAL
===================================================== */

function showModal(modal, focusElement) {

    lastFocusedElement = document.activeElement;

    modal.hidden = false;

    document.body.style.overflow = "hidden";

    if (focusElement) {
        focusElement.focus();
    }

}


/* =====================================================
   13. CLOSE MODAL
===================================================== */

function hideModal(modal) {

    modal.hidden = true;

    document.body.style.overflow = "";

    if (
        lastFocusedElement &&
        typeof lastFocusedElement.focus === "function"
    ) {

        lastFocusedElement.focus();

    }

}


/* =====================================================
   14. OPEN GROUP MODAL
===================================================== */

function openGroupModal(group = null) {

    groupForm.reset();

    groupIdInput.value = "";

    if (group) {

        groupModalTitle.textContent = "Edit Study Group";

        groupIdInput.value = group.id;

        groupNameInput.value = group.name;

        groupSubjectInput.value = group.subject;

        groupDescriptionInput.value = group.description || "";

        groupMembersInput.value = Array.isArray(group.members)
            ? group.members.join(", ")
            : "";

    } else {

        groupModalTitle.textContent = "Create Study Group";

    }

    showModal(groupModal, groupNameInput);

}


/* =====================================================
   15. SAVE STUDY GROUP
===================================================== */

function handleGroupSubmit(event) {

    event.preventDefault();

    const name = groupNameInput.value.trim();

    const subject = groupSubjectInput.value.trim();

    const description = groupDescriptionInput.value.trim();

    const members = groupMembersInput.value
        .split(",")
        .map(member => member.trim())
        .filter(member => member.length > 0);

    const existingId = groupIdInput.value;

    if (!name || !subject) {

        alert("Please enter the group name and subject.");

        return;

    }

    const previousGroups = [...groups];

    const now = new Date().toISOString();

    if (existingId) {

        const index = groups.findIndex(
            group => group.id === existingId
        );

        if (index === -1) {

            alert("Study group not found.");

            return;

        }

        groups[index] = {

            ...groups[index],

            name,
            subject,
            description,
            members,

            updatedAt: now

        };

    } else {

        const newGroup = {

            id: generateId(),

            name,
            subject,
            description,
            members,

            createdAt: now,
            updatedAt: now

        };

        groups.unshift(newGroup);

    }

    if (!saveData(GROUPS_STORAGE_KEY, groups)) {

        groups = previousGroups;

        return;

    }

    hideModal(groupModal);

    renderGroups();

    updateGroupOptions();

    renderSessions();

    updateStatistics();

}


/* =====================================================
   16. EDIT STUDY GROUP
===================================================== */

function editGroup(id) {

    const group = groups.find(
        item => item.id === id
    );

    if (!group) {
        return;
    }

    openGroupModal(group);

}


/* =====================================================
   17. DELETE STUDY GROUP
===================================================== */

function deleteGroup(id) {

    const group = groups.find(
        item => item.id === id
    );

    if (!group) {
        return;
    }

    const linkedSessions = sessions.filter(
        session => session.groupId === id
    );

    let message = `Delete the study group "${group.name}"?`;

    if (linkedSessions.length > 0) {

        message +=
            `\n\nThis will also delete ${linkedSessions.length} ` +
            `session(s) associated with this group.`;

    }

    const confirmed = confirm(message);

    if (!confirmed) {
        return;
    }

    const updatedGroups = groups.filter(
        item => item.id !== id
    );

    const updatedSessions = sessions.filter(
        session => session.groupId !== id
    );

    // Save both changes, restoring previous storage
    // if the second write fails.

    const previousGroups = groups;
    const previousSessions = sessions;

    if (!saveData(GROUPS_STORAGE_KEY, updatedGroups)) {
        return;
    }

    if (!saveData(SESSIONS_STORAGE_KEY, updatedSessions)) {

        saveData(GROUPS_STORAGE_KEY, previousGroups);

        return;

    }

    groups = updatedGroups;
    sessions = updatedSessions;

    renderGroups();

    updateGroupOptions();

    renderSessions();

    updateStatistics();

}


/* =====================================================
   18. CREATE GROUP CARD
===================================================== */

function createGroupCard(group) {

    const card = createElement("article", "group-card");

    const icon = createElement("div", "group-icon", "👥");

    const title = createElement("h3", "", group.name);

    const subject = createElement(
        "p",
        "group-subject",
        `📖 ${group.subject}`
    );

    const description = createElement(
        "p",
        "group-description",
        group.description || "No description provided."
    );

    const membersBox = createElement("div", "group-members");

    const membersHeading = createElement(
        "h4",
        "",
        `👤 Group Members (${group.members?.length || 0})`
    );

    const membersText = createElement(
        "p",
        "",
        group.members?.length
            ? group.members.join(", ")
            : "No members added yet."
    );

    membersBox.append(membersHeading, membersText);

    const footer = createElement("div", "group-footer");

    const editButton = createElement(
        "button",
        "card-btn edit",
        "✏️ Edit"
    );

    editButton.type = "button";

    editButton.addEventListener("click", () => {
        editGroup(group.id);
    });

    const deleteButton = createElement(
        "button",
        "card-btn delete",
        "🗑️ Delete"
    );

    deleteButton.type = "button";

    deleteButton.addEventListener("click", () => {
        deleteGroup(group.id);
    });

    footer.append(editButton, deleteButton);

    card.append(
        icon,
        title,
        subject,
        description,
        membersBox,
        footer
    );

    return card;

}


/* =====================================================
   19. RENDER STUDY GROUPS
===================================================== */

function renderGroups() {

    groupsContainer.replaceChildren();

    if (groups.length === 0) {

        groupsEmpty.style.display = "block";

        return;

    }

    groupsEmpty.style.display = "none";

    groups.forEach(group => {

        groupsContainer.appendChild(
            createGroupCard(group)
        );

    });

}


/* =====================================================
   20. UPDATE STUDY GROUP DROPDOWN
===================================================== */

function updateGroupOptions() {

    const selectedValue = sessionGroupInput.value;

    sessionGroupInput.replaceChildren();

    const defaultOption = document.createElement("option");

    defaultOption.value = "";

    defaultOption.textContent = "Select Study Group";

    sessionGroupInput.appendChild(defaultOption);

    groups.forEach(group => {

        const option = document.createElement("option");

        option.value = group.id;

        option.textContent = `${group.name} - ${group.subject}`;

        sessionGroupInput.appendChild(option);

    });

    if (groups.some(group => group.id === selectedValue)) {

        sessionGroupInput.value = selectedValue;

    }

}


/* =====================================================
   21. OPEN SESSION MODAL
===================================================== */

function openSessionModal(session = null) {

    if (groups.length === 0) {

        alert(
            "Please create a study group before scheduling a session."
        );

        openGroupModal();

        return;

    }

    sessionForm.reset();

    sessionIdInput.value = "";

    updateGroupOptions();

    if (session) {

        sessionModalTitle.textContent = "Edit Study Session";

        sessionIdInput.value = session.id;

        sessionTitleInput.value = session.title;

        sessionGroupInput.value = session.groupId;

        sessionDateInput.value = session.date;

        sessionTimeInput.value = session.time;

        sessionDurationInput.value = session.duration;

        sessionLocationInput.value = session.location;

        sessionDescriptionInput.value =
            session.description || "";

    } else {

        sessionModalTitle.textContent = "Schedule Study Session";

        sessionDurationInput.value = "60";

    }

    showModal(sessionModal, sessionTitleInput);

}


/* =====================================================
   22. SAVE STUDY SESSION
===================================================== */

function handleSessionSubmit(event) {

    event.preventDefault();

    const title = sessionTitleInput.value.trim();

    const groupId = sessionGroupInput.value;

    const date = sessionDateInput.value;

    const time = sessionTimeInput.value;

    const duration = Number(sessionDurationInput.value);

    const location = sessionLocationInput.value.trim();

    const description = sessionDescriptionInput.value.trim();

    const existingId = sessionIdInput.value;

    if (!title || !groupId || !date || !time || !location) {

        alert("Please complete all required fields.");

        return;

    }

    const groupExists = groups.some(
        group => group.id === groupId
    );

    if (!groupExists) {

        alert("Please select a valid study group.");

        return;

    }

    if (!Number.isFinite(duration) || duration <= 0) {

        alert("Please select a valid duration.");

        return;

    }

    const sessionStart = new Date(`${date}T${time}:00`);

    if (Number.isNaN(sessionStart.getTime())) {

        alert("Please enter a valid date and time.");

        return;

    }

    const previousSessions = [...sessions];

    const now = new Date().toISOString();

    if (existingId) {

        const index = sessions.findIndex(
            session => session.id === existingId
        );

        if (index === -1) {

            alert("Study session not found.");

            return;

        }

        sessions[index] = {

            ...sessions[index],

            title,
            groupId,
            date,
            time,
            duration,
            location,
            description,

            updatedAt: now

        };

    } else {

        const newSession = {

            id: generateId(),

            title,
            groupId,
            date,
            time,
            duration,
            location,
            description,

            completed: false,

            createdAt: now,
            updatedAt: now

        };

        sessions.unshift(newSession);

    }

    if (!saveData(SESSIONS_STORAGE_KEY, sessions)) {

        sessions = previousSessions;

        return;

    }

    hideModal(sessionModal);

    renderSessions();

    updateStatistics();

}


/* =====================================================
   23. EDIT STUDY SESSION
===================================================== */

function editSession(id) {

    const session = sessions.find(
        item => item.id === id
    );

    if (!session) {
        return;
    }

    openSessionModal(session);

}


/* =====================================================
   24. DELETE STUDY SESSION
===================================================== */

function deleteSession(id) {

    const session = sessions.find(
        item => item.id === id
    );

    if (!session) {
        return;
    }

    const confirmed = confirm(
        `Are you sure you want to delete "${session.title}"?`
    );

    if (!confirmed) {
        return;
    }

    const updatedSessions = sessions.filter(
        item => item.id !== id
    );

    if (!saveData(SESSIONS_STORAGE_KEY, updatedSessions)) {
        return;
    }

    sessions = updatedSessions;

    renderSessions();

    updateStatistics();

}


/* =====================================================
   25. MARK SESSION COMPLETED
===================================================== */

function toggleSessionCompleted(id) {

    const session = sessions.find(
        item => item.id === id
    );

    if (!session) {
        return;
    }

    const previousStatus = session.completed;

    session.completed = !session.completed;

    session.updatedAt = new Date().toISOString();

    if (!saveData(SESSIONS_STORAGE_KEY, sessions)) {

        session.completed = previousStatus;

        return;

    }

    renderSessions();

    updateStatistics();

}


/* =====================================================
   26. CREATE SESSION CARD
===================================================== */

function createSessionCard(session) {

    const card = createElement("article", "session-card");

    const group = groups.find(
        item => item.id === session.groupId
    );

    const status = getSessionStatus(session);

    // CARD TOP

    const top = createElement("div", "session-top");

    const statusBadge = createElement(
        "span",
        `session-status ${status}`,
        status === "completed"
            ? "✅ Completed"
            : status === "past"
                ? "⌛ Past Session"
                : "📅 Upcoming"
    );

    top.appendChild(statusBadge);

    // TITLE

    const title = createElement(
        "h3",
        "",
        session.title
    );

    // GROUP NAME

    const groupName = createElement(
        "p",
        "session-group",
        `👥 ${group ? group.name : "Unknown Group"}`
    );

    // DETAILS

    const details = createElement("div", "session-details");

    const detailItems = [

        ["📅", formatDate(session.date)],

        ["🕒", formatTime(session.time)],

        ["⏱️", formatDuration(session.duration)],

        ["📍", session.location]

    ];

    detailItems.forEach(([icon, value]) => {

        const row = createElement("div", "session-detail");

        const iconElement = createElement("span", "", icon);

        const textElement = createElement("span", "", value);

        row.append(iconElement, textElement);

        details.appendChild(row);

    });

    // DESCRIPTION

    const description = createElement(
        "p",
        "session-description",
        session.description || "No description provided."
    );

    // FOOTER

    const footer = createElement("div", "session-footer");

    // EDIT BUTTON

    const editButton = createElement(
        "button",
        "card-btn edit",
        "✏️ Edit"
    );

    editButton.type = "button";

    editButton.addEventListener("click", () => {
        editSession(session.id);
    });

    // COMPLETE BUTTON

    const completeButton = createElement(
        "button",
        "card-btn complete",
        session.completed
            ? "↩️ Reopen"
            : "✅ Complete"
    );

    completeButton.type = "button";

    completeButton.addEventListener("click", () => {
        toggleSessionCompleted(session.id);
    });

    // DELETE BUTTON

    const deleteButton = createElement(
        "button",
        "card-btn delete",
        "🗑️ Delete"
    );

    deleteButton.type = "button";

    deleteButton.addEventListener("click", () => {
        deleteSession(session.id);
    });

    footer.append(
        editButton,
        completeButton,
        deleteButton
    );

    // BUILD CARD

    card.append(
        top,
        title,
        groupName,
        details,
        description,
        footer
    );

    return card;

}


/* =====================================================
   27. RENDER STUDY SESSIONS
===================================================== */

function renderSessions() {

    sessionsContainer.replaceChildren();

    let filteredSessions = [...sessions];

    // FILTER BASED ON CURRENT PAGE

    if (currentView === "completed") {

        filteredSessions = filteredSessions.filter(
            session => session.completed === true
        );

    } else if (currentView === "dashboard") {

        filteredSessions = filteredSessions.filter(
            session => getSessionStatus(session) === "upcoming"
        );

    }

    // FILTER BY STATUS DROPDOWN

    if (selectedStatus !== "all") {

        filteredSessions = filteredSessions.filter(
            session => getSessionStatus(session) === selectedStatus
        );

    }

    // SEARCH

    if (searchTerm) {

        filteredSessions = filteredSessions.filter(session => {

            const group = groups.find(
                item => item.id === session.groupId
            );

            const searchableText = [

                session.title,

                session.location,

                session.description,

                group ? group.name : "",

                group ? group.subject : ""

            ].join(" ").toLowerCase();

            return searchableText.includes(searchTerm);

        });

    }

    // SORT BY DATE AND TIME

    filteredSessions.sort((a, b) => {

        const dateA = new Date(`${a.date}T${a.time}:00`);

        const dateB = new Date(`${b.date}T${b.time}:00`);

        return dateA - dateB;

    });

    // EMPTY STATE

    if (filteredSessions.length === 0) {

        sessionsEmpty.style.display = "block";

        const heading = sessionsEmpty.querySelector("h3");
        const description = sessionsEmpty.querySelector("p");

        if (sessions.length === 0) {

            heading.textContent = "No Study Sessions Yet";

            description.textContent =
                "Start planning your academic success by scheduling a study session.";

        } else {

            heading.textContent = "No Matching Sessions";

            description.textContent =
                "There are no study sessions matching this view or filter.";

        }

        return;

    }

    sessionsEmpty.style.display = "none";

    filteredSessions.forEach(session => {

        sessionsContainer.appendChild(
            createSessionCard(session)
        );

    });

}


/* =====================================================
   28. UPDATE DASHBOARD STATISTICS
===================================================== */

function updateStatistics() {

    const totalGroups = groups.length;

    const totalSessions = sessions.length;

    const completedSessions = sessions.filter(
        session => session.completed === true
    ).length;

    const upcomingSessions = sessions.filter(
        session => getSessionStatus(session) === "upcoming"
    ).length;

    totalGroupsElement.textContent = totalGroups;

    totalSessionsElement.textContent = totalSessions;

    completedSessionsElement.textContent = completedSessions;

    upcomingSessionsElement.textContent = upcomingSessions;

}


/* =====================================================
   29. PAGE NAVIGATION
===================================================== */

function switchView(view) {

    const validViews = [
        "dashboard",
        "sessions",
        "groups",
        "completed"
    ];

    if (!validViews.includes(view)) {
        return;
    }

    currentView = view;

    // UPDATE ACTIVE SIDEBAR ITEM

    menuItems.forEach(item => {

        const isActive = item.dataset.view === view;

        item.classList.toggle("active", isActive);

    });

    // HIDE ALL MAIN SECTIONS

    statsSection.hidden = true;

    welcomeBanner.hidden = true;

    sessionsSection.hidden = true;

    groupsSection.hidden = true;

    // SHOW SELECTED VIEW

    if (view === "dashboard") {

        pageTitle.textContent = "Dashboard";

        statsSection.hidden = false;

        welcomeBanner.hidden = false;

        sessionsSection.hidden = false;

        sessionsHeading.textContent = "Upcoming Study Sessions";

    } else if (view === "sessions") {

        pageTitle.textContent = "Study Sessions";

        sessionsSection.hidden = false;

        sessionsHeading.textContent = "All Study Sessions";

    } else if (view === "groups") {

        pageTitle.textContent = "Study Groups";

        groupsSection.hidden = false;

    } else if (view === "completed") {

        pageTitle.textContent = "Completed Sessions";

        sessionsSection.hidden = false;

        sessionsHeading.textContent = "Completed Study Sessions";

    }

    // RESET FILTERS WHEN CHANGING PAGE

    searchTerm = "";

    selectedStatus = "all";

    searchSessions.value = "";

    statusFilter.value = "all";

    renderGroups();

    renderSessions();

    updateStatistics();

    // CLOSE MOBILE SIDEBAR

    sidebar.classList.remove("open");

    menuToggle.setAttribute("aria-expanded", "false");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


/* =====================================================
   30. SIDEBAR NAVIGATION EVENTS
===================================================== */

menuItems.forEach(item => {

    item.addEventListener("click", () => {

        const view = item.dataset.view;

        switchView(view);

    });

});


/* =====================================================
   31. SEARCH FUNCTIONALITY
===================================================== */

searchSessions.addEventListener("input", function () {

    searchTerm = this.value.trim().toLowerCase();

    renderSessions();

});


/* =====================================================
   32. STATUS FILTER
===================================================== */

statusFilter.addEventListener("change", function () {

    selectedStatus = this.value;

    renderSessions();

});


/* =====================================================
   33. DARK MODE
===================================================== */

function applyTheme(theme) {

    const isDark = theme === "dark";

    document.body.classList.toggle(
        "dark-mode",
        isDark
    );

    themeToggle.textContent = isDark
        ? "☀️ Light Mode"
        : "🌙 Dark Mode";

    themeToggle.setAttribute(
        "aria-pressed",
        String(isDark)
    );

}

let savedTheme = "light";

try {

    savedTheme = localStorage.getItem(
        THEME_STORAGE_KEY
    ) || "light";

} catch (error) {

    console.warn("Unable to load theme:", error);

}

applyTheme(savedTheme);

themeToggle.addEventListener("click", () => {

    const isDark = document.body.classList.contains(
        "dark-mode"
    );

    const newTheme = isDark ? "light" : "dark";

    applyTheme(newTheme);

    try {

        localStorage.setItem(
            THEME_STORAGE_KEY,
            newTheme
        );

    } catch (error) {

        console.warn("Unable to save theme:", error);

    }

});


/* =====================================================
   34. MOBILE SIDEBAR
===================================================== */

menuToggle.addEventListener("click", () => {

    const isOpen = sidebar.classList.toggle("open");

    menuToggle.setAttribute(
        "aria-expanded",
        String(isOpen)
    );

});

// CLOSE SIDEBAR WHEN CLICKING OUTSIDE

document.addEventListener("click", event => {

    if (window.innerWidth > 700) {
        return;
    }

    if (
        sidebar.classList.contains("open") &&
        !sidebar.contains(event.target) &&
        !menuToggle.contains(event.target)
    ) {

        sidebar.classList.remove("open");

        menuToggle.setAttribute("aria-expanded", "false");

    }

});


/* =====================================================
   35. GROUP MODAL BUTTON EVENTS
===================================================== */

createGroupBtn.addEventListener("click", () => {
    openGroupModal();
});

emptyGroupBtn.addEventListener("click", () => {
    openGroupModal();
});

closeGroupModalBtn.addEventListener("click", () => {
    hideModal(groupModal);
});

cancelGroupBtn.addEventListener("click", () => {
    hideModal(groupModal);
});

groupForm.addEventListener(
    "submit",
    handleGroupSubmit
);


/* =====================================================
   36. SESSION MODAL BUTTON EVENTS
===================================================== */

createSessionBtn.addEventListener("click", () => {
    openSessionModal();
});

welcomeScheduleBtn.addEventListener("click", () => {
    openSessionModal();
});

emptySessionBtn.addEventListener("click", () => {
    openSessionModal();
});

closeSessionModalBtn.addEventListener("click", () => {
    hideModal(sessionModal);
});

cancelSessionBtn.addEventListener("click", () => {
    hideModal(sessionModal);
});

sessionForm.addEventListener(
    "submit",
    handleSessionSubmit
);


/* =====================================================
   37. CLOSE MODALS BY CLICKING OUTSIDE
===================================================== */

[groupModal, sessionModal].forEach(modal => {

    modal.addEventListener("click", event => {

        if (event.target === modal) {
            hideModal(modal);
        }

    });

});


/* =====================================================
   38. KEYBOARD ACCESSIBILITY
===================================================== */

document.addEventListener("keydown", event => {

    const activeModal = [groupModal, sessionModal].find(
        modal => !modal.hidden
    );

    if (event.key === "Escape") {

        if (activeModal) {

            hideModal(activeModal);

        } else if (sidebar.classList.contains("open")) {

            sidebar.classList.remove("open");

            menuToggle.setAttribute("aria-expanded", "false");

            menuToggle.focus();

        }

        return;

    }

    if (event.key !== "Tab" || !activeModal) {
        return;
    }

    const focusableElements = Array.from(
        activeModal.querySelectorAll(
            'button:not([disabled]), input:not([type="hidden"]), select, textarea'
        )
    );

    if (focusableElements.length === 0) {
        return;
    }

    const first = focusableElements[0];

    const last = focusableElements[
        focusableElements.length - 1
    ];

    if (
        event.shiftKey &&
        document.activeElement === first
    ) {

        event.preventDefault();

        last.focus();

    } else if (
        !event.shiftKey &&
        document.activeElement === last
    ) {

        event.preventDefault();

        first.focus();

    }

});


/* =====================================================
   39. INITIALIZE APPLICATION
===================================================== */

function initializeApp() {

    updateGroupOptions();

    renderGroups();

    renderSessions();

    updateStatistics();

    switchView("dashboard");

    console.log(
        "StudySync Student Group Study Scheduler is ready!"
    );

}

initializeApp();