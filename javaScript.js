/* SADU - JavaScript file shared by all pages.
   Each function has a comment above it that says which page uses it. */


/* ========== SHARED HELPERS (used by several pages) ========== */

// Page: All pages
// The names of the months (used by the calendars)
var monthNames = ["January", "February", "March", "April", "May", "June",
                  "July", "August", "September", "October", "November", "December"];

// Page: All pages
// Check if an element has a CSS class
function hasClass(element, name) {
    var classes = element.className.split(" ");
    return classes.indexOf(name) != -1;
}

// Page: All pages
// Add a CSS class to an element
function addClass(element, name) {
    if (!hasClass(element, name)) {
        element.className = element.className + " " + name;
    }
}

// Page: All pages
// Remove a CSS class from an element
function removeClass(element, name) {
    var classes = element.className.split(" ");
    var result = [];

    for (var i = 0; i < classes.length; i++) {
        if (classes[i] != name && classes[i] != "") {
            result.push(classes[i]);
        }
    }

    element.className = result.join(" ");
}

// Page: All pages
// Check if the clicked element is inside another element
function isInside(target, element) {
    while (target != null) {
        if (target == element) {
            return true;
        }
        target = target.parentNode;
    }
    return false;
}

// Page: All pages
// Remove the spaces at the start and the end of a text
function trimText(text) {
    return text.replace(/^\s+|\s+$/g, "");
}

// Page: about.html, request-offering.html, evaluate-offering.html, add-new-offering.html,
//       manage-activity-leaders.html, community.html
// Check that a text is empty or contains spaces only
function isEmpty(text) {
    return text.match(/\S/) == null;
}

// Page: about.html, add-new-offering.html, manage-activity-leaders.html
// Check that a chosen file is an image (by its type and extension)
function isImage(file) {
    return file.type.search(/^image\//) == 0 &&
           file.name.search(/\.(jpg|jpeg|png|webp)$/i) != -1;
}

// Page: about.html, add-new-offering.html, manage-activity-leaders.html
// Show the name of the chosen file next to a file input
function showFileName(input, textId) {
    var text = document.getElementById(textId);

    if (input.files.length > 0) {
        text.innerHTML = input.files[0].name;
    } else {
        text.innerHTML = "PNG, JPG or WEBP";
    }
}

// Page: about.html, request-offering.html, manage-activity-leaders.html
// Add a zero before numbers less than 10 (for example 5 -> 05)
function twoDigits(number) {
    if (number < 10) {
        return "0" + number;
    }
    return "" + number;
}

// Page: All pages that have a dropdown or a calendar
// List of open menus: each one is closed when the user clicks outside it
var menusToClose = [];

// Page: All pages that have a dropdown or a calendar
// Close every menu that does not contain the clicked element
document.onclick = function (event) {
    for (var i = 0; i < menusToClose.length; i++) {
        if (!isInside(event.target, menusToClose[i].box)) {
            menusToClose[i].close();
        }
    }
};

// Page: All pages that have a dropdown or a calendar
// Close all menus when the user presses the Escape key
document.onkeydown = function (event) {
    if (event.key == "Escape") {
        for (var i = 0; i < menusToClose.length; i++) {
            menusToClose[i].close();
        }
    }
};


/* ========== ALL PAGES - FOOTER CLOCK ========== */

// Page: All pages
// Show the current time inside the footer clock
function updateClock() {
    var clock = document.getElementById("clock");

    if (clock == null) {
        return;
    }

    var now = new Date();
    var hours = now.getHours();
    var minutes = now.getMinutes();
    var period = "AM";

    if (hours >= 12) {
        period = "PM";
    }

    // Change from 24-hour to 12-hour format
    hours = hours % 12;
    if (hours == 0) {
        hours = 12;
    }

    clock.innerHTML = hours + ":" + twoDigits(minutes) + " " + period;
}


/* ========== HOME PAGE (home.html) - THEMES ========== */

// Page: All pages (the theme is chosen on home.html)
// Apply the saved theme when any page opens
function applySavedTheme() {
    if (localStorage.getItem("sadu-theme") == "light") {
        addClass(document.body, "light-theme");
    }
}

// Page: home.html
// Switch between the two themes (called by the theme button)
function changeTheme() {
    if (hasClass(document.body, "light-theme")) {
        // Light -> Dark
        removeClass(document.body, "light-theme");
        localStorage.setItem("sadu-theme", "dark");
    } else {
        // Dark -> Light
        addClass(document.body, "light-theme");
        localStorage.setItem("sadu-theme", "light");
    }

    updateThemeIcon();
}

// Page: home.html
// Show the moon in the light theme and the sun in the dark theme
function updateThemeIcon() {
    var button = document.getElementById("theme-toggle");
    var icon = document.getElementById("theme-icon");

    if (button == null || icon == null) {
        return;
    }

    if (hasClass(document.body, "light-theme")) {
        icon.innerHTML = "&#9790;";   // moon
        button.title = "Switch to dark theme";
    } else {
        icon.innerHTML = "&#9728;";   // sun
        button.title = "Switch to light theme";
    }

    button.setAttribute("aria-label", button.title);
}


/* ========== HOME PAGE (home.html) - BACK TO TOP BUTTON ========== */

// Page: home.html
// Show the Back to Top button only after the user scrolls down 200px
function showBackToTop() {
    var topButton = document.getElementById("back-to-top");

    if (topButton == null) {
        return;
    }

    if (document.documentElement.scrollTop > 200 || document.body.scrollTop > 200) {
        addClass(topButton, "show");
    } else {
        removeClass(topButton, "show");
    }
}

// Page: home.html
// The timer that moves the page up step by step
var scrollTimer = null;

// Page: home.html
// Return to the top of the page gradually (called by the Back to Top button)
function backToTop() {
    clearInterval(scrollTimer);

    scrollTimer = setInterval(function () {
        var position = document.documentElement.scrollTop || document.body.scrollTop;

        if (position <= 0) {
            // We reached the top: stop the timer
            clearInterval(scrollTimer);
            return;
        }

        // Move up a part of the remaining distance (at least 40px each time)
        var step = Math.ceil(position / 6);
        if (step < 40) {
            step = 40;
        }
        window.scrollTo(0, position - step);
    }, 15);
}

// Page: home.html
// Connect the theme button and the Back to Top button to their functions
function setupHomePage() {
    var themeButton = document.getElementById("theme-toggle");
    var topButton = document.getElementById("back-to-top");

    if (themeButton != null) {
        themeButton.onclick = changeTheme;
        updateThemeIcon();
    }

    if (topButton != null) {
        topButton.onclick = backToTop;
        window.onscroll = showBackToTop;
    }
}


/* ========== CLUB OFFERINGS, COURSES AND COMPETITIONS PAGES - SORT AND SEARCH ========== */

// Page: club-offerings.html, courses.html, competitions.html
// Read the name of an offering card
function getCardName(card) {
    if (card.getAttribute("data-name") != null) {
        return card.getAttribute("data-name");
    }

    var heading = card.getElementsByTagName("h2")[0];
    if (heading == null) {
        heading = card.getElementsByTagName("h3")[0];
    }

    return trimText(heading.innerHTML.replace(/<[^>]*>/g, ""));
}

// Page: club-offerings.html, courses.html, competitions.html
// Read the price of an offering card
function getCardPrice(card) {
    if (card.getAttribute("data-price") != null) {
        return parseInt(card.getAttribute("data-price"));
    }

    var priceText = card.getElementsByClassName("offering-price")[0].innerHTML;
    var numbers = priceText.match(/[0-9]+/);

    return parseInt(numbers[0]);
}

// Page: club-offerings.html, courses.html, competitions.html
// Compare two names alphabetically (A to Z)
function compareNames(a, b) {
    a = a.toLowerCase();
    b = b.toLowerCase();

    if (a < b) {
        return -1;
    }
    if (a > b) {
        return 1;
    }
    return 0;
}

// Page: club-offerings.html
// Shuffle an array into a random order
function shuffle(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

// Page: club-offerings.html, courses.html, competitions.html
// Sort the cards, then show only the cards that match the search (and the level)
function sortCards(container, startOrder, sortValue, searchText, level, emptyMessageId) {
    var emptyMessage = document.getElementById(emptyMessageId);
    searchText = trimText(searchText.toLowerCase());

    // Copy the cards into a new array (starting from the saved order)
    var cards = [];
    for (var i = 0; i < startOrder.length; i++) {
        cards.push(startOrder[i]);
    }

    // Sort alphabetically or by price
    if (sortValue == "name-asc") {
        cards.sort(function (a, b) {
            return compareNames(getCardName(a), getCardName(b));
        });
    } else if (sortValue == "name-desc") {
        cards.sort(function (a, b) {
            return compareNames(getCardName(b), getCardName(a));
        });
    } else if (sortValue == "price-asc") {
        cards.sort(function (a, b) {
            return getCardPrice(a) - getCardPrice(b);
        });
    } else if (sortValue == "price-desc") {
        cards.sort(function (a, b) {
            return getCardPrice(b) - getCardPrice(a);
        });
    }

    // Display the cards in the new order and hide the cards that do not match
    var shown = 0;

    for (var k = 0; k < cards.length; k++) {
        var name = getCardName(cards[k]).toLowerCase();
        var matchesSearch = name.indexOf(searchText) != -1;
        var matchesLevel = true;

        if (level != "all") {
            var info = cards[k].getElementsByClassName("course-info")[0];
            matchesLevel = info.innerHTML.toLowerCase().search(level) != -1;
        }

        if (matchesSearch && matchesLevel) {
            cards[k].style.display = "";
            shown++;
        } else {
            cards[k].style.display = "none";
        }

        // Keep the "no results" message after the cards
        if (emptyMessage != null && emptyMessage.parentNode == container) {
            container.insertBefore(cards[k], emptyMessage);
        } else {
            container.appendChild(cards[k]);
        }
    }

    // Show the "no results" message when no card matches the search
    if (emptyMessage != null) {
        emptyMessage.hidden = shown != 0;
    }
}

// Page: club-offerings.html, courses.html
// Make a custom dropdown (button + list of options) work like the hidden select
function setupCustomDropdown(buttonId, textId, optionsId, optionClass, selectId, afterChoose) {
    var button = document.getElementById(buttonId);
    var text = document.getElementById(textId);
    var list = document.getElementById(optionsId);
    var select = document.getElementById(selectId);

    if (button == null || list == null || select == null) {
        return;
    }

    var options = list.getElementsByClassName(optionClass);

    // Open or close the list of options
    button.onclick = function () {
        var open = list.hidden;
        list.hidden = !open;
        button.setAttribute("aria-expanded", "" + open);
    };

    // Choose an option
    for (var i = 0; i < options.length; i++) {
        options[i].onclick = function () {
            select.value = this.getAttribute("data-value");
            text.innerHTML = trimText(this.innerHTML);

            for (var k = 0; k < options.length; k++) {
                options[k].setAttribute("aria-selected", "" + (options[k] == this));
            }

            list.hidden = true;
            button.setAttribute("aria-expanded", "false");
            afterChoose();
        };
    }

    // Close the list when the user clicks outside the dropdown
    menusToClose.push({
        box: button.parentNode,
        close: function () {
            list.hidden = true;
            button.setAttribute("aria-expanded", "false");
        }
    });
}


// Page: club-offerings.html
// The cards in the random order that was made when the page opened
var offeringsOrder = [];

// Page: club-offerings.html
// Sort and search the club offerings
function sortOfferings() {
    var grid = document.getElementsByClassName("offerings-grid")[0];

    sortCards(grid, offeringsOrder,
              document.getElementById("sort-offerings").value,
              document.getElementById("search-offerings").value,
              "all", "offerings-empty");
}

// Page: club-offerings.html
// Show the offerings in a random order and connect the search and sort controls
function setupClubOfferingsPage() {
    var grid = document.getElementsByClassName("offerings-grid")[0];
    var search = document.getElementById("search-offerings");

    if (grid == null || search == null) {
        return;
    }

    var cards = grid.getElementsByClassName("offer-card");
    for (var i = 0; i < cards.length; i++) {
        offeringsOrder.push(cards[i]);
    }

    // Display the offerings in a random order
    shuffle(offeringsOrder);

    search.oninput = sortOfferings;
    setupCustomDropdown("offerings-sort-button", "offerings-sort-text", "offerings-sort-options",
                        "offerings-sort-option", "sort-offerings", sortOfferings);

    sortOfferings();
}


// Page: courses.html
// The original order of the course cards
var coursesOrder = [];

// Page: courses.html
// Sort, filter by level and search the courses
function sortCourses() {
    var grid = document.getElementsByClassName("course-grid")[0];
    var search = document.getElementsByClassName("search-field")[0].getElementsByTagName("input")[0];

    sortCards(grid, coursesOrder,
              document.getElementById("sort-courses").value,
              search.value,
              document.getElementById("course-level").value,
              "courses-empty");
}

// Page: courses.html
// Connect the search, level and sort controls of the courses page
function setupCoursesPage() {
    var level = document.getElementById("course-level");

    if (level == null) {
        return;
    }

    var grid = document.getElementsByClassName("course-grid")[0];
    var cards = grid.getElementsByClassName("course-card");
    for (var i = 0; i < cards.length; i++) {
        coursesOrder.push(cards[i]);
    }

    var search = document.getElementsByClassName("search-field")[0].getElementsByTagName("input")[0];
    search.oninput = sortCourses;

    setupCustomDropdown("courses-level-button", "courses-level-text", "courses-level-options",
                        "courses-level-option", "course-level", sortCourses);
    setupCustomDropdown("courses-sort-button", "courses-sort-text", "courses-sort-options",
                        "courses-sort-option", "sort-courses", sortCourses);

    sortCourses();
}


// Page: competitions.html
// The original order of the competition cards
var competitionsOrder = [];

// Page: competitions.html
// Sort and search the competitions
function sortCompetitions() {
    var list = document.getElementById("upcoming");
    var search = document.getElementsByClassName("search-field")[0].getElementsByTagName("input")[0];

    sortCards(list, competitionsOrder,
              document.getElementById("sort-competitions").value,
              search.value,
              "all", "competitions-empty");
}

// Page: competitions.html
// Connect the search and sort controls of the competitions page
function setupCompetitionsPage() {
    var sort = document.getElementById("sort-competitions");

    if (sort == null) {
        return;
    }

    var cards = document.getElementById("upcoming").getElementsByClassName("event-card");
    for (var i = 0; i < cards.length; i++) {
        competitionsOrder.push(cards[i]);
    }

    var search = document.getElementsByClassName("search-field")[0].getElementsByTagName("input")[0];
    search.oninput = sortCompetitions;
    sort.onchange = sortCompetitions;

    sortCompetitions();
}


/* ========== ABOUT US AND MANAGE LEADERS PAGES - DATE OF BIRTH CALENDAR ========== */

// Page: about.html, manage-activity-leaders.html
// Prepare the date of birth calendar
// (prefix is "about" on about.html and "leader" on manage-activity-leaders.html)
function setupBirthCalendar(prefix) {
    var dateButton = document.getElementById(prefix + "-dob-button");

    if (dateButton == null) {
        return;
    }

    var calendar = document.getElementById(prefix + "-calendar");
    var monthButton = document.getElementById(prefix + "-month-button");
    var monthList = document.getElementById(prefix + "-month-options");
    var yearButton = document.getElementById(prefix + "-year-button");
    var yearList = document.getElementById(prefix + "-year-options");
    var today = new Date();

    // The month and year that the calendar is showing now
    var shown = { prefix: prefix, month: today.getMonth(), year: today.getFullYear() };

    // Create the month options (January ... December)
    monthList.innerHTML = "";
    for (var m = 0; m < 12; m++) {
        var monthOption = document.createElement("button");
        monthOption.type = "button";
        monthOption.innerHTML = monthNames[m];
        monthOption.value = m;
        monthOption.onclick = function () {
            shown.month = parseInt(this.value);
            closeMonthYearLists(prefix);
            showBirthCalendar(shown);
        };
        monthList.appendChild(monthOption);
    }

    // Create the year options (this year ... 1900)
    yearList.innerHTML = "";
    for (var y = today.getFullYear(); y >= 1900; y--) {
        var yearOption = document.createElement("button");
        yearOption.type = "button";
        yearOption.innerHTML = y;
        yearOption.value = y;
        yearOption.onclick = function () {
            shown.year = parseInt(this.value);
            // Do not show a month after the current month
            if (shown.year == today.getFullYear() && shown.month > today.getMonth()) {
                shown.month = today.getMonth();
            }
            closeMonthYearLists(prefix);
            showBirthCalendar(shown);
        };
        yearList.appendChild(yearOption);
    }

    // Open or close the calendar
    dateButton.onclick = function () {
        var open = calendar.hidden;
        calendar.hidden = !open;
        dateButton.setAttribute("aria-expanded", "" + open);
        closeMonthYearLists(prefix);

        if (open) {
            showBirthCalendar(shown);
        }
    };

    // Open or close the month list
    monthButton.onclick = function () {
        var open = monthList.hidden;
        closeMonthYearLists(prefix);
        monthList.hidden = !open;
        monthButton.setAttribute("aria-expanded", "" + open);
    };

    // Open or close the year list
    yearButton.onclick = function () {
        var open = yearList.hidden;
        closeMonthYearLists(prefix);
        yearList.hidden = !open;
        yearButton.setAttribute("aria-expanded", "" + open);
    };

    // Previous month
    document.getElementById(prefix + "-prev-month").onclick = function () {
        shown.month--;
        if (shown.month < 0) {
            shown.month = 11;
            shown.year--;
        }
        closeMonthYearLists(prefix);
        showBirthCalendar(shown);
    };

    // Next month
    document.getElementById(prefix + "-next-month").onclick = function () {
        shown.month++;
        if (shown.month > 11) {
            shown.month = 0;
            shown.year++;
        }
        closeMonthYearLists(prefix);
        showBirthCalendar(shown);
    };

    // Close the calendar when the user clicks outside it
    menusToClose.push({
        box: calendar.parentNode,
        close: function () {
            calendar.hidden = true;
            dateButton.setAttribute("aria-expanded", "false");
            closeMonthYearLists(prefix);
        }
    });

    // Close the month and year lists when the user clicks outside them
    menusToClose.push({
        box: monthButton.parentNode.parentNode,
        close: function () {
            closeMonthYearLists(prefix);
        }
    });

    showBirthCalendar(shown);
}

// Page: about.html, manage-activity-leaders.html
// Close the month and year lists of the calendar
function closeMonthYearLists(prefix) {
    document.getElementById(prefix + "-month-options").hidden = true;
    document.getElementById(prefix + "-year-options").hidden = true;
    document.getElementById(prefix + "-month-button").setAttribute("aria-expanded", "false");
    document.getElementById(prefix + "-year-button").setAttribute("aria-expanded", "false");
}

// Page: about.html, manage-activity-leaders.html
// Draw the days of the month that the calendar is showing
function showBirthCalendar(shown) {
    var prefix = shown.prefix;
    var dobInput = document.getElementById(prefix + "-dob");
    var days = document.getElementById(prefix + "-calendar-days");
    var today = new Date();

    document.getElementById(prefix + "-month-text").innerHTML = monthNames[shown.month];
    document.getElementById(prefix + "-year-text").innerHTML = shown.year;

    days.innerHTML = "";

    // Empty boxes before the first day of the month
    var firstDay = new Date(shown.year, shown.month, 1).getDay();
    for (var i = 0; i < firstDay; i++) {
        days.appendChild(document.createElement("span"));
    }

    // One button for every day of the month
    var daysInMonth = new Date(shown.year, shown.month + 1, 0).getDate();
    for (var day = 1; day <= daysInMonth; day++) {
        var dayButton = document.createElement("button");
        dayButton.type = "button";
        dayButton.innerHTML = day;
        dayButton.value = shown.year + "-" + twoDigits(shown.month + 1) + "-" + twoDigits(day);

        if (dobInput.value == dayButton.value) {
            dayButton.className = "selected";
        }

        dayButton.onclick = function () {
            chooseBirthDate(prefix, this.value);
        };

        days.appendChild(dayButton);
    }

    // The calendar goes from January 1900 to the current month
    document.getElementById(prefix + "-prev-month").disabled =
        shown.year == 1900 && shown.month == 0;
    document.getElementById(prefix + "-next-month").disabled =
        shown.year == today.getFullYear() && shown.month == today.getMonth();

    // Mark the shown month and year in their lists
    var monthOptions = document.getElementById(prefix + "-month-options").getElementsByTagName("button");
    for (var m = 0; m < monthOptions.length; m++) {
        monthOptions[m].className = (m == shown.month) ? "selected" : "";
    }

    var yearOptions = document.getElementById(prefix + "-year-options").getElementsByTagName("button");
    for (var y = 0; y < yearOptions.length; y++) {
        yearOptions[y].className = (parseInt(yearOptions[y].value) == shown.year) ? "selected" : "";
    }
}

// Page: about.html, manage-activity-leaders.html
// Save the chosen day (value is "YYYY-MM-DD") and close the calendar
function chooseBirthDate(prefix, value) {
    var year = value.substring(0, 4);
    var month = parseInt(value.substring(5, 7)) - 1;
    var day = parseInt(value.substring(8, 10));

    document.getElementById(prefix + "-dob").value = value;
    document.getElementById(prefix + "-dob-text").innerHTML = monthNames[month] + " " + day + ", " + year;

    document.getElementById(prefix + "-calendar").hidden = true;
    document.getElementById(prefix + "-dob-button").setAttribute("aria-expanded", "false");
    closeMonthYearLists(prefix);
}


/* ========== ABOUT US PAGE (about.html) ========== */

// Page: about.html
// Validate the Join Our Team form (called when the form is submitted)
function validateJoinForm() {
    var form = document.getElementById("about-join-form");

    var name = form.elements["name"].value;
    var expertise = form.elements["expertise"].value;
    var photo = document.getElementById("about-team-photo");
    var birthDate = document.getElementById("about-dob").value;
    var skills = form.elements["skills"].value;
    var email = form.elements["email"].value;
    var education = form.elements["education"].value;

    // 1. There are no empty fields
    if (isEmpty(name) || isEmpty(expertise) || photo.files.length == 0 ||
        birthDate == "" || isEmpty(skills) || isEmpty(email) || isEmpty(education)) {
        alert("Please fill in all the fields.");
        return false;
    }

    // 2. The name cannot start with numbers
    if (name.search(/^\s*[0-9]/) != -1) {
        alert("The Name field cannot start with numbers.");
        return false;
    }

    // 3. The photo accepts only images
    if (!isImage(photo.files[0])) {
        alert("The Photo field accepts only images (JPG, PNG or WEBP).");
        return false;
    }

    // 4. The year of birth must be 2008 or earlier
    var year = parseInt(birthDate.substring(0, 4));

    if (year > 2008) {
        alert("The year of birth must be 2008 or earlier.");
        return false;
    }

    // The email must look like name@example.com
    if (email.search(/^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/) == -1) {
        alert("Please enter a valid email, for example: name@example.com");
        return false;
    }

    // The form is valid: show a confirmation with the sender's name
    alert("Thank you, " + trimText(name) + "! Your request to join our team has been sent.");

    // Clear the form
    form.reset();
    document.getElementById("about-photo-filename").innerHTML = "PNG, JPG or WEBP";
    document.getElementById("about-dob-text").innerHTML = "Select date of birth";

    return false;
}

// Page: about.html
// Connect the Join Our Team form, the photo input and the calendar
function setupAboutPage() {
    var form = document.getElementById("about-join-form");

    if (form == null) {
        return;
    }

    form.onsubmit = validateJoinForm;

    document.getElementById("about-team-photo").onchange = function () {
        showFileName(this, "about-photo-filename");
    };

    setupBirthCalendar("about");
}


/* ========== REQUEST TO JOIN AN OFFERING PAGE (request-offering.html) ========== */

// Page: request-offering.html
// The offerings of each type
var requestOfferings = {
    competitions: ["Desert Rivals", "Saudi Legends Arena", "Diriyah Duel"],
    courses: ["Najdi Pixel Art", "Sadu Game Makers", "From Heritage to Pixels"]
};

// Page: request-offering.html
// The available times of each offering
var requestTimes = {
    "Desert Rivals": ["10:00 AM", "4:00 PM"],
    "Saudi Legends Arena": ["1:00 PM", "7:00 PM"],
    "Diriyah Duel": ["4:00 PM", "7:00 PM"],
    "Najdi Pixel Art": ["10:00 AM", "1:00 PM"],
    "Sadu Game Makers": ["1:00 PM", "4:00 PM"],
    "From Heritage to Pixels": ["10:00 AM", "7:00 PM"]
};

// Page: request-offering.html
// The chosen day, the chosen time, and the month shown in the calendar
var requestDate = null;
var requestTime = "";
var requestDateDone = false;
var requestMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);

// Page: request-offering.html
// Write a date like "November 25, 2026"
function formatLongDate(date) {
    return monthNames[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear();
}

// Page: request-offering.html
// Change the text inside a dropdown button
function setDropdownLabel(buttonId, text) {
    var button = document.getElementById(buttonId);
    button.getElementsByClassName("sadu-dropdown-label")[0].innerHTML = text;
}

// Page: request-offering.html
// Close the Offering Type and Offering Name dropdowns
function closeRequestMenus() {
    document.getElementById("offering-type-menu").hidden = true;
    document.getElementById("offering-name-menu").hidden = true;
    document.getElementById("offering-type-button").setAttribute("aria-expanded", "false");
    document.getElementById("offering-name-button").setAttribute("aria-expanded", "false");
}

// Page: request-offering.html
// Close the calendar of the preferred date
function closeRequestCalendar() {
    document.getElementById("calendar-panel").hidden = true;
    document.getElementById("date-picker-button").setAttribute("aria-expanded", "false");
}

// Page: request-offering.html
// Open one dropdown (and close the other dropdown and the calendar)
function openRequestMenu(buttonId, menuId) {
    var menu = document.getElementById(menuId);
    var open = menu.hidden;

    closeRequestMenus();
    closeRequestCalendar();

    menu.hidden = !open;
    document.getElementById(buttonId).setAttribute("aria-expanded", "" + open);
}

// Page: request-offering.html
// Create the options of a dropdown from its hidden select
function fillRequestMenu(selectId, menuId, buttonId) {
    var select = document.getElementById(selectId);
    var menu = document.getElementById(menuId);

    menu.innerHTML = "";

    for (var i = 0; i < select.options.length; i++) {
        if (select.options[i].value == "") {
            continue;
        }

        var item = document.createElement("button");
        item.type = "button";
        item.className = "sadu-dropdown-option";
        item.innerHTML = select.options[i].text;
        item.value = select.options[i].value;

        if (select.value == item.value) {
            addClass(item, "selected");
        }

        item.onclick = function () {
            chooseRequestOption(selectId, buttonId, this.value, this.innerHTML);
        };

        menu.appendChild(item);
    }
}

// Page: request-offering.html
// Save the chosen option in the hidden select
function chooseRequestOption(selectId, buttonId, value, text) {
    document.getElementById(selectId).value = value;
    setDropdownLabel(buttonId, text);
    closeRequestMenus();

    if (selectId == "offering-type") {
        // A new type was chosen: show its offerings
        fillOfferingNames();
    } else {
        // A new offering was chosen: choose the date again
        resetRequestDate();
    }
}

// Page: request-offering.html
// Put the offerings of the chosen type inside the Offering Name select
function fillOfferingNames() {
    var type = document.getElementById("offering-type").value;
    var select = document.getElementById("offering-name");
    var names = requestOfferings[type];

    select.innerHTML = "<option value=\"\">Select an offering</option>";

    if (names != null) {
        for (var i = 0; i < names.length; i++) {
            var option = document.createElement("option");
            option.value = names[i];
            option.text = names[i];
            select.appendChild(option);
        }
    }

    setDropdownLabel("offering-name-button", "Select an offering");
    resetRequestDate();
}

// Page: request-offering.html
// Remove the chosen date and time
function resetRequestDate() {
    requestDate = null;
    requestTime = "";
    requestDateDone = false;

    document.getElementById("selected-date-text").innerHTML = "Select an available date and time";
    document.getElementById("calendar-days").innerHTML = "";
    document.getElementById("time-slots").innerHTML = "";
    document.getElementById("calendar-month").innerHTML = "";
    document.getElementById("selected-day-label").innerHTML = "Choose an available day";
    document.getElementById("calendar-done").disabled = true;

    closeRequestCalendar();
}

// Page: request-offering.html
// Draw the days of the month in the calendar
function showRequestCalendar() {
    var panel = document.getElementById("calendar-panel");
    var days = document.getElementById("calendar-days");
    var offering = document.getElementById("offering-name").value;
    var locked = requestTimes[offering] == null;

    // Lock the calendar until an offering is selected
    if (locked) {
        addClass(panel, "locked");
    } else {
        removeClass(panel, "locked");
    }
    panel.getElementsByClassName("calendar-lock-message")[0].hidden = !locked;

    var year = requestMonth.getFullYear();
    var month = requestMonth.getMonth();

    document.getElementById("calendar-month").innerHTML = monthNames[month] + " " + year;
    days.innerHTML = "";

    // Empty boxes before the first day of the month
    var firstDay = new Date(year, month, 1).getDay();
    for (var i = 0; i < firstDay; i++) {
        days.appendChild(document.createElement("span"));
    }

    // One button for every day of the month
    var daysInMonth = new Date(year, month + 1, 0).getDate();
    for (var day = 1; day <= daysInMonth; day++) {
        var dayButton = document.createElement("button");
        dayButton.type = "button";
        dayButton.innerHTML = day;
        dayButton.disabled = locked;

        if (requestDate != null && requestDate.getFullYear() == year &&
            requestDate.getMonth() == month && requestDate.getDate() == day) {
            dayButton.className = "selected";
        }

        dayButton.onclick = function () {
            chooseRequestDay(this);
        };

        days.appendChild(dayButton);
    }

    document.getElementById("previous-month").disabled = locked;
    document.getElementById("next-month").disabled = locked;

    if (locked) {
        document.getElementById("time-slots").innerHTML = "";
        document.getElementById("selected-day-label").innerHTML = "Choose an available day";
        document.getElementById("calendar-done").disabled = true;
    }
}

// Page: request-offering.html
// Select a day in the calendar, then show its available times
function chooseRequestDay(dayButton) {
    requestDate = new Date(requestMonth.getFullYear(), requestMonth.getMonth(),
                           parseInt(dayButton.innerHTML));

    // Mark only the clicked day (the calendar stays open)
    var buttons = document.getElementById("calendar-days").getElementsByTagName("button");
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].className = "";
    }
    dayButton.className = "selected";

    showRequestTimes();
}

// Page: request-offering.html
// Show the available time buttons of the selected offering
function showRequestTimes() {
    var slots = document.getElementById("time-slots");
    var times = requestTimes[document.getElementById("offering-name").value];

    slots.innerHTML = "";
    requestTime = "";
    requestDateDone = false;
    document.getElementById("calendar-done").disabled = true;

    if (requestDate == null || times == null) {
        document.getElementById("selected-day-label").innerHTML = "Choose an available day";
        return;
    }

    document.getElementById("selected-day-label").innerHTML =
        "Available Times - " + formatLongDate(requestDate);

    for (var i = 0; i < times.length; i++) {
        var timeButton = document.createElement("button");
        timeButton.type = "button";
        timeButton.innerHTML = times[i];

        timeButton.onclick = function () {
            requestTime = this.innerHTML;

            var buttons = slots.getElementsByTagName("button");
            for (var k = 0; k < buttons.length; k++) {
                buttons[k].className = "";
            }
            this.className = "selected";

            document.getElementById("calendar-done").disabled = false;
        };

        slots.appendChild(timeButton);
    }
}

// Page: request-offering.html
// Save the chosen date and time when the user clicks Done
function confirmRequestDate() {
    if (requestDate == null || requestTime == "") {
        return;
    }

    requestDateDone = true;
    document.getElementById("selected-date-text").innerHTML =
        formatLongDate(requestDate) + " - " + requestTime;

    closeRequestCalendar();
}

// Page: request-offering.html
// Clear the form so the member can add another request
function resetRequestForm() {
    document.getElementById("request-form").reset();
    setDropdownLabel("offering-type-button", "Select a type");
    requestMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    fillOfferingNames();
    closeRequestMenus();
}

// Page: request-offering.html
// Validate the request and add it to the table (called when the form is submitted)
function submitRequest() {
    var type = document.getElementById("offering-type").value;
    var offering = document.getElementById("offering-name").value;
    var name = trimText(document.getElementById("full-name").value).replace(/\s+/g, " ");

    // Collect everything that is missing or wrong
    var problems = "";

    // 1. An offering must be selected
    if (type == "") {
        problems += "- Please select an offering type.\n";
    }
    if (offering == "") {
        problems += "- Please select an offering.\n";
    }

    // 2. The name must be a full name without numbers or characters such as ?, ! or @
    if (name == "") {
        problems += "- Please enter your full name.\n";
    } else if (name.search(/[0-9]/) != -1) {
        problems += "- The name cannot contain numbers.\n";
    } else if (name.search(/[?!@]/) != -1 || name.search(/[^A-Za-zء-ي ]/) != -1) {
        problems += "- The name cannot contain characters such as ?, ! or @.\n";
    } else if (name.split(" ").length < 2) {
        problems += "- Please enter your full name (first and last name).\n";
    }

    // 3. The preferred date must be a future date
    if (requestDate == null || requestTime == "" || !requestDateDone) {
        problems += "- Please choose a preferred date and time, then press Done.\n";
    } else {
        // Add the chosen time to the chosen day, for example "4:00 PM"
        var hours = parseInt(requestTime.split(":")[0]) % 12;
        var minutes = parseInt(requestTime.split(":")[1]);
        if (requestTime.search("PM") != -1) {
            hours = hours + 12;
        }

        var chosen = new Date(requestDate.getFullYear(), requestDate.getMonth(),
                              requestDate.getDate(), hours, minutes);

        if (chosen <= new Date()) {
            problems += "- The preferred date must be a future date.\n";
        }
    }

    // Stop and explain what exactly is missing
    if (problems != "") {
        alert("Please check your request:\n" + problems);
        return false;
    }

    // Add the request to the table on this page
    var row = document.createElement("tr");
    row.innerHTML = "<td>" + offering + "</td>" +
                    "<td>" + name + "</td>" +
                    "<td>" + formatLongDate(requestDate) + "</td>" +
                    "<td>" + requestTime + "</td>";
    document.getElementById("requests-body").appendChild(row);

    // Ask the member to stay or return to the dashboard
    var stay = confirm("Your request was sent successfully!\n\n" +
                       "Press OK to stay on this page, or Cancel to return to the dashboard.");

    if (stay) {
        resetRequestForm();
        document.getElementById("new-requests").hidden = false;
        document.getElementById("new-requests").scrollIntoView();
    } else {
        // Leaving the page removes all newly added requests
        window.location.href = "member-dashboard.html";
    }

    return false;
}

// Page: request-offering.html
// Connect the dropdowns, the calendar and the form of the request page
function setupRequestPage() {
    var form = document.getElementById("request-form");

    if (form == null) {
        return;
    }

    // Message shown in the calendar until an offering is selected
    var lockMessage = document.createElement("div");
    lockMessage.className = "calendar-lock-message";
    lockMessage.innerHTML = "Please select an Offering.";
    lockMessage.hidden = true;
    document.getElementById("calendar-panel").appendChild(lockMessage);

    // Offering Type dropdown
    document.getElementById("offering-type-button").onclick = function () {
        fillRequestMenu("offering-type", "offering-type-menu", "offering-type-button");
        openRequestMenu("offering-type-button", "offering-type-menu");
    };

    // Offering Name dropdown
    document.getElementById("offering-name-button").onclick = function () {
        if (document.getElementById("offering-type").value == "") {
            document.getElementById("offering-name-menu").innerHTML =
                "<div class=\"sadu-dropdown-hint\">Please select an Offering Type first.</div>";
        } else {
            fillRequestMenu("offering-name", "offering-name-menu", "offering-name-button");
        }
        openRequestMenu("offering-name-button", "offering-name-menu");
    };

    // Open or close the calendar
    document.getElementById("date-picker-button").onclick = function () {
        var panel = document.getElementById("calendar-panel");
        var open = panel.hidden;

        closeRequestMenus();
        panel.hidden = !open;
        this.setAttribute("aria-expanded", "" + open);

        if (open) {
            showRequestCalendar();
            if (document.getElementById("offering-name").value != "") {
                showRequestTimes();
            }
        }
    };

    // Previous and next month
    document.getElementById("previous-month").onclick = function () {
        requestMonth = new Date(requestMonth.getFullYear(), requestMonth.getMonth() - 1, 1);
        showRequestCalendar();
    };
    document.getElementById("next-month").onclick = function () {
        requestMonth = new Date(requestMonth.getFullYear(), requestMonth.getMonth() + 1, 1);
        showRequestCalendar();
    };

    document.getElementById("calendar-done").onclick = confirmRequestDate;
    form.onsubmit = submitRequest;

    // Close the dropdowns and the calendar when the user clicks outside them
    var wraps = form.getElementsByClassName("sadu-select-wrap");
    menusToClose.push({ box: wraps[0], close: function () {
        document.getElementById("offering-type-menu").hidden = true;
        document.getElementById("offering-type-button").setAttribute("aria-expanded", "false");
    } });
    menusToClose.push({ box: wraps[1], close: function () {
        document.getElementById("offering-name-menu").hidden = true;
        document.getElementById("offering-name-button").setAttribute("aria-expanded", "false");
    } });
    menusToClose.push({ box: document.getElementById("date-picker-wrapper"), close: closeRequestCalendar });

    fillOfferingNames();
}


/* ========== OFFERING EVALUATION PAGE (evaluate-offering.html) ========== */

// Page: evaluate-offering.html
// Validate the evaluation and show a thank-you or apology message
function submitEvaluation() {
    var dropdown = document.getElementById("completed-offering-dropdown");
    var ratingBox = document.getElementsByClassName("rating-fieldset")[0];
    var feedback = document.getElementById("feedback");
    var offerings = document.getElementsByName("completed-offering");
    var ratings = document.getElementsByName("rating");

    // Find the selected offering
    var offering = "";
    for (var i = 0; i < offerings.length; i++) {
        if (offerings[i].checked) {
            offering = offerings[i].parentNode.getElementsByTagName("span")[0].innerHTML;
        }
    }

    // Find the selected rating
    var rating = 0;
    for (var j = 0; j < ratings.length; j++) {
        if (ratings[j].checked) {
            rating = parseInt(ratings[j].value);
        }
    }

    // Highlight every unfilled input and remember what is missing
    var missing = "";

    if (offering == "") {
        addClass(dropdown, "invalid-field");
        missing += "- Completed Offering\n";
    } else {
        removeClass(dropdown, "invalid-field");
    }

    if (rating == 0) {
        addClass(ratingBox, "invalid-field");
        missing += "- Rating\n";
    } else {
        removeClass(ratingBox, "invalid-field");
    }

    if (isEmpty(feedback.value)) {
        addClass(feedback, "invalid-field");
        missing += "- Feedback\n";
    } else {
        removeClass(feedback, "invalid-field");
    }

    if (missing != "") {
        alert("Please complete the highlighted fields:\n" + missing);
        return false;
    }

    // Good rating (4 or 5 stars) gets a thank-you message, otherwise an apology
    if (rating >= 4) {
        alert("Thank you for your great rating! We are glad you enjoyed " + offering + ".");
    } else {
        alert("We are sorry that " + offering + " did not meet your expectations. " +
              "Thank you for your feedback.");
    }

    // Transfer the member to the dashboard
    window.location.href = "member-dashboard.html";

    return false;
}

// Page: evaluate-offering.html
// Connect the offering list, the stars, the feedback box and the Submit button
function setupEvaluationPage() {
    var form = document.getElementById("evaluation-form");

    if (form == null) {
        return;
    }

    var dropdown = document.getElementById("completed-offering-dropdown");
    var offerings = document.getElementsByName("completed-offering");
    var ratings = document.getElementsByName("rating");
    var feedback = document.getElementById("feedback");

    // Show the chosen offering and close the list
    for (var i = 0; i < offerings.length; i++) {
        offerings[i].onchange = function () {
            document.getElementById("completed-offering-display").innerHTML =
                this.parentNode.getElementsByTagName("span")[0].innerHTML;
            dropdown.open = false;
            removeClass(dropdown, "invalid-field");
        };
    }

    // Remove the highlight when the member fixes a field
    for (var j = 0; j < ratings.length; j++) {
        ratings[j].onchange = function () {
            removeClass(document.getElementsByClassName("rating-fieldset")[0], "invalid-field");
        };
    }

    feedback.oninput = function () {
        if (!isEmpty(feedback.value)) {
            removeClass(feedback, "invalid-field");
        }
    };

    document.getElementById("submit-evaluation").onclick = submitEvaluation;
    form.onsubmit = submitEvaluation;

    // Close the offering list when the user clicks outside it
    menusToClose.push({ box: dropdown, close: function () {
        dropdown.open = false;
    } });
}


/* ========== ADD A NEW OFFERING PAGE (add-new-offering.html) ========== */

// Page: add-new-offering.html
// Validate the new offering and save it in localStorage (called when the form is submitted)
function addOffering() {
    var form = document.getElementById("add-offering-form");
    var name = document.getElementById("offering-name").value;
    var image = document.getElementById("offering-image");
    var price = document.getElementById("offering-price").value;
    var description = document.getElementById("offering-description").value;

    // Check for empty fields
    var missing = "";

    if (isEmpty(name)) {
        missing += "- Offering Name\n";
    }
    if (image.files.length == 0) {
        missing += "- Image\n";
    }
    if (isEmpty(price)) {
        missing += "- Price / Registration Fee\n";
    }
    if (isEmpty(description)) {
        missing += "- Description\n";
    }

    if (missing != "") {
        alert("Please fill in the following fields:\n" + missing);
        return false;
    }

    // Check that each field matches the required information type
    if (name.search(/^\s*[0-9]/) != -1) {
        alert("The Offering Name cannot start with numbers.");
        return false;
    }

    if (price.match(/^\s*[0-9]+(\.[0-9]+)?\s*$/) == null) {
        alert("The Price must be a number.");
        return false;
    }

    if (!isImage(image.files[0])) {
        alert("The Image must be a JPG, PNG or WEBP file.");
        return false;
    }

    name = trimText(name);
    description = trimText(description);

    // Read the image so it can be saved and shown on the dashboard
    var reader = new FileReader();

    reader.onload = function () {
        // Get the saved offerings array (or create a new one)
        var offerings = JSON.parse(localStorage.getItem("managerOfferings"));

        if (offerings == null) {
            offerings = [];
        }

        // Add the new offering object to the array and save it
        var offering = {
            name: name,
            image: reader.result,
            price: parseFloat(price),
            description: description
        };

        offerings.push(offering);

        try {
            localStorage.setItem("managerOfferings", JSON.stringify(offerings));
        } catch (error) {
            alert("The image is too large to be saved. Please choose a smaller image.");
            return;
        }

        alert("The offering \"" + name + "\" has been added successfully.");

        // Clear the form
        form.reset();
        document.getElementById("selected-file-name").innerHTML = "PNG, JPG or WEBP";
    };

    reader.readAsDataURL(image.files[0]);

    return false;
}

// Page: add-new-offering.html
// Connect the form and the image input of the Add a New Offering page
function setupAddOfferingPage() {
    var form = document.getElementById("add-offering-form");

    if (form == null) {
        return;
    }

    form.onsubmit = addOffering;

    document.getElementById("offering-image").onchange = function () {
        showFileName(this, "selected-file-name");
    };
}


/* ========== CLUB MANAGER DASHBOARD PAGE (manager-dashboard.html) ========== */

// Page: manager-dashboard.html
// Show all offerings that were saved in localStorage
function displayOfferings() {
    var container = document.getElementById("new-offerings");

    if (container == null) {
        return;
    }

    var offerings = JSON.parse(localStorage.getItem("managerOfferings"));

    // At the start there are no new offerings
    if (offerings == null) {
        return;
    }

    for (var i = 0; i < offerings.length; i++) {
        container.innerHTML +=
            "<div class=\"manager-offering-card\">" +
                "<div class=\"manager-card-art\">" +
                    "<img src=\"" + offerings[i].image + "\" alt=\"" + offerings[i].name + "\">" +
                "</div>" +
                "<h4>" + offerings[i].name + "</h4>" +
                "<p>" + offerings[i].description + "</p>" +
                "<p>Price: " + offerings[i].price + " SAR</p>" +
            "</div>";
    }
}


/* ========== MANAGE ACTIVITY LEADERS AND INSTRUCTORS PAGE (manage-activity-leaders.html) ========== */

// Page: manage-activity-leaders.html
// Array of objects: all available activity leaders and instructors
var leaders = [
    {
        name: "Yusef Alotaibi",
        role: "Organizer",
        expertise: "Tournament Organization, Event Management",
        photo: "images/yusef-alotaibi.jpg"
    },
    {
        name: "Ali Alqahtani",
        role: "Organizer",
        expertise: "Gaming Events, Competition Management",
        photo: "images/ali-alqahtani.jpg"
    },
    {
        name: "Fahad Alotaibi",
        role: "Instructor",
        expertise: "Competitive Gaming, Player Development",
        photo: "images/fahad-alotaibi.jpg"
    },
    {
        name: "Maha Alqahtani",
        role: "Instructor",
        expertise: "Pixel Art, Digital Illustration",
        photo: "images/maha-alqahtani.jpg"
    }
];

// Page: manage-activity-leaders.html
// Display a checkbox, photo and name for every person in the array
function showLeaders() {
    var list = document.getElementById("leaders-list");
    list.innerHTML = "";

    for (var i = 0; i < leaders.length; i++) {
        list.innerHTML +=
            "<div class=\"manage-leader-person\">" +
                "<input type=\"checkbox\" id=\"leader" + i + "\" name=\"selected-leaders\" value=\"" + i + "\">" +
                "<img class=\"manage-leader-photo\" src=\"" + leaders[i].photo + "\" alt=\"Photo of " + leaders[i].name + "\">" +
                "<div class=\"manage-leader-info\">" +
                    "<label for=\"leader" + i + "\">" + leaders[i].name + "</label>" +
                    "<p>" + leaders[i].role + " &ndash; " + leaders[i].expertise + "</p>" +
                "</div>" +
            "</div>";
    }
}

// Page: manage-activity-leaders.html
// Delete the selected people after the manager confirms (called by Delete Selected)
function deleteLeaders() {
    var boxes = document.getElementsByName("selected-leaders");
    var selected = [];
    var names = "";

    for (var i = 0; i < boxes.length; i++) {
        if (boxes[i].checked) {
            selected.push(parseInt(boxes[i].value));
            names += "- " + leaders[parseInt(boxes[i].value)].name + "\n";
        }
    }

    if (selected.length == 0) {
        alert("Please select at least one person to delete.");
        return false;
    }

    // Show the names of the selected people in the confirm box
    if (!confirm("Are you sure you want to delete:\n" + names)) {
        return false;
    }

    // Remove from the end of the array first so the indexes stay correct
    for (var j = selected.length - 1; j >= 0; j--) {
        leaders.splice(selected[j], 1);
    }

    showLeaders();
    alert("The following people have been deleted successfully:\n" + names);

    return false;
}

// Page: manage-activity-leaders.html
// Validate the form and add a new person to the list (called when the form is submitted)
function addLeader() {
    var form = document.getElementById("add-leader-form");
    var name = trimText(document.getElementById("leader-name").value).replace(/\s+/g, " ");
    var role = document.getElementById("leader-role").value;
    var photo = document.getElementById("leader-photo");
    var birthDate = document.getElementById("leader-dob").value;
    var email = trimText(document.getElementById("leader-email").value);
    var expertise = trimText(document.getElementById("leader-expertise").value);
    var skills = trimText(document.getElementById("leader-skills").value);
    var education = trimText(document.getElementById("leader-education").value);

    // Check for empty fields
    var missing = "";

    if (name == "") { missing += "- Name\n"; }
    if (role == "") { missing += "- Role\n"; }
    if (photo.files.length == 0) { missing += "- Photo\n"; }
    if (birthDate == "") { missing += "- Date of Birth\n"; }
    if (email == "") { missing += "- Email\n"; }
    if (expertise == "") { missing += "- Area of Expertise\n"; }
    if (skills == "") { missing += "- Skills\n"; }
    if (education == "") { missing += "- Education\n"; }

    if (missing != "") {
        alert("Please fill in the following fields:\n" + missing);
        return false;
    }

    // Check that each field matches the required information type
    if (name.search(/^[A-Za-zء-ي]+( [A-Za-zء-ي]+)+$/) == -1) {
        alert("The Name must be a full name with letters only (first and last name).");
        return false;
    }

    if (!isImage(photo.files[0])) {
        alert("The Photo must be a JPG, PNG or WEBP image.");
        return false;
    }

    // The person must be 18 years old or older
    var today = new Date();
    var birth = new Date(parseInt(birthDate.substring(0, 4)),
                         parseInt(birthDate.substring(5, 7)) - 1,
                         parseInt(birthDate.substring(8, 10)));
    var limit = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());

    if (birth > limit) {
        alert("The leader or instructor must be at least 18 years old.");
        return false;
    }

    if (email.search(/^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/) == -1) {
        alert("Please enter a valid email, for example: name@example.com");
        return false;
    }

    if (expertise.search(/^[A-Za-z][A-Za-z ,&-]*$/) == -1) {
        alert("The Area of Expertise must contain letters only.");
        return false;
    }

    if (skills.search(/^[A-Za-z]/) == -1) {
        alert("The Skills field must start with a letter.");
        return false;
    }

    if (education.search(/^[A-Za-z]/) == -1) {
        alert("The Education field must start with a letter.");
        return false;
    }

    // Read the photo, then add the new person object to the array
    var reader = new FileReader();

    reader.onload = function () {
        leaders.push({
            name: name,
            role: role,
            expertise: expertise,
            photo: reader.result
        });

        showLeaders();

        alert(name + " has been added successfully.");

        form.reset();
    };

    reader.readAsDataURL(photo.files[0]);

    return false;
}

// Page: manage-activity-leaders.html
// Close the role list
function closeRoleList() {
    document.getElementById("leader-role-options").hidden = true;
    document.getElementById("leader-role-button").setAttribute("aria-expanded", "false");
}

// Page: manage-activity-leaders.html
// Connect the two forms, the role dropdown and the calendar of the page
function setupManageLeadersPage() {
    var deleteForm = document.getElementById("delete-leaders-form");
    var addForm = document.getElementById("add-leader-form");

    if (deleteForm == null || addForm == null) {
        return;
    }

    showLeaders();

    deleteForm.onsubmit = deleteLeaders;
    addForm.onsubmit = addLeader;

    document.getElementById("leader-photo").onchange = function () {
        showFileName(this, "leader-selected-file-name");
    };

    // Role dropdown
    var roleButton = document.getElementById("leader-role-button");
    var roleList = document.getElementById("leader-role-options");
    var roles = roleList.getElementsByTagName("button");

    roleButton.onclick = function () {
        var open = roleList.hidden;
        roleList.hidden = !open;
        roleButton.setAttribute("aria-expanded", "" + open);
    };

    for (var i = 0; i < roles.length; i++) {
        roles[i].onclick = function () {
            var role = this.getAttribute("data-role");

            document.getElementById("leader-role").value = role;
            document.getElementById("leader-role-text").innerHTML = role;

            for (var k = 0; k < roles.length; k++) {
                roles[k].className = "";
            }
            this.className = "selected";

            closeRoleList();
        };
    }

    menusToClose.push({ box: roleButton.parentNode, close: closeRoleList });

    // Date of birth calendar
    setupBirthCalendar("leader");

    // When the form is cleared, clear the custom controls too
    addForm.onreset = function () {
        document.getElementById("leader-role-text").innerHTML = "--Select a role--";
        document.getElementById("leader-dob-text").innerHTML = "Select date of birth";
        document.getElementById("leader-selected-file-name").innerHTML = "PNG, JPG or WEBP";

        for (var k = 0; k < roles.length; k++) {
            roles[k].className = "";
        }

        closeRoleList();
        document.getElementById("leader-calendar").hidden = true;
    };
}


/* ========== COMMUNITY PAGE (community.html) - CHAT ========== */

// Page: community.html
// Add one sent message to the chat box
function showMessage(text, time) {
    var chat = document.getElementById("chat-box");
    var message = document.createElement("div");

    message.className = "message sent";
    message.innerHTML =
        "<span class=\"avatar\" aria-hidden=\"true\">NA</span>" +
        "<div class=\"bubble\">" +
            "<p class=\"message-info\"><strong>Najd</strong> &middot; " + time + "</p>" +
            "<p></p>" +
        "</div>";

    // Put the text with createTextNode so it is shown exactly as typed
    message.getElementsByTagName("p")[1].appendChild(document.createTextNode(text));

    chat.appendChild(message);
    chat.scrollTop = chat.scrollHeight;
}

// Page: community.html
// Load the saved messages when the Community page opens
function loadMessages() {
    var messages = JSON.parse(localStorage.getItem("communityMessages"));

    if (messages == null) {
        return;
    }

    for (var i = 0; i < messages.length; i++) {
        showMessage(messages[i].text, messages[i].time);
    }
}

// Page: community.html
// Send a new message (called when the chat form is submitted)
function sendMessage() {
    var input = document.getElementById("chat-message");
    var text = trimText(input.value);

    if (text == "") {
        alert("Please type a message before sending.");
        return false;
    }

    // Current time, for example 4:05 PM
    var now = new Date();
    var hours = now.getHours() % 12;
    if (hours == 0) {
        hours = 12;
    }
    var time = hours + ":" + twoDigits(now.getMinutes()) + " AM";
    if (now.getHours() >= 12) {
        time = hours + ":" + twoDigits(now.getMinutes()) + " PM";
    }

    showMessage(text, time);

    // Save the message in the messages array in localStorage
    var messages = JSON.parse(localStorage.getItem("communityMessages"));
    if (messages == null) {
        messages = [];
    }
    messages.push({ text: text, time: time });
    localStorage.setItem("communityMessages", JSON.stringify(messages));

    input.value = "";

    return false;
}

// Page: community.html
// Connect the chat form and show the saved messages
function setupCommunityPage() {
    var form = document.getElementById("community-message-form");

    if (form == null) {
        return;
    }

    form.onsubmit = sendMessage;
    loadMessages();
}


/* ========== START (runs on every page) ========== */

// Page: All pages
// Apply the saved theme and start the clock as soon as the page is read
applySavedTheme();
updateClock();
setInterval(updateClock, 1000);

// Page: home.html, club-offerings.html, courses.html, competitions.html, about.html,
//       request-offering.html, evaluate-offering.html, add-new-offering.html,
//       manager-dashboard.html, manage-activity-leaders.html, community.html
// Prepare the parts that exist on this page (called by <body onload="startPage()">)
function startPage() {
    setupHomePage();
    setupClubOfferingsPage();
    setupCoursesPage();
    setupCompetitionsPage();
    setupAboutPage();
    setupRequestPage();
    setupEvaluationPage();
    setupAddOfferingPage();
    displayOfferings();
    setupManageLeadersPage();
    setupCommunityPage();
}
