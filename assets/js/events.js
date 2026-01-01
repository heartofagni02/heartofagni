// Events Page JavaScript - events.js

// This file handles all event-related functionality including:
// - Event filtering and searching
// - Calendar functionality
// - Event navigation to gallery pages

// Wait for DOM to be fully loaded before executing JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // ======================
    // EVENT FILTERING FUNCTIONALITY
    // ======================
    
    // Get references to filter elements
    const eventSearch = document.getElementById('eventSearch');
    const categoryFilter = document.getElementById('categoryFilter');
    const timeFilter = document.getElementById('timeFilter');
    const resetFiltersBtn = document.getElementById('resetFilters');
    
    // ======================
    // EVENT CALENDAR FUNCTIONALITY
    // ======================
    
    // Initialize calendar variables
    let currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();
    
    // Month names for display
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    
    // Get references to calendar elements
    const calendarDays = document.getElementById('calendarDays');
    const currentMonthElement = document.getElementById('currentMonth');
    const prevMonthBtn = document.getElementById('prevMonth');
    const nextMonthBtn = document.getElementById('nextMonth');
    
    // Calendar events data - maps dates to event types
    const calendarEvents = {
        "2023-06-15": ["academic"],
        "2023-06-17": ["academic"],
        "2023-06-22": ["workshop"],
        "2023-06-28": ["social"],
        "2023-07-05": ["academic"],
        "2023-07-12": ["seminar"],
        "2023-07-19": ["cultural"],
        "2023-07-25": ["workshop"]
    };
    
    // ======================
    // INITIALIZE CALENDAR
    // ======================
    function initCalendar() {
        // Render initial calendar view
        renderCalendar(currentMonth, currentYear);
        
        // Add event listener for previous month button
        prevMonthBtn.addEventListener('click', function() {
            currentMonth--;
            if (currentMonth < 0) {
                currentMonth = 11;
                currentYear--;
            }
            renderCalendar(currentMonth, currentYear);
        });
        
        // Add event listener for next month button
        nextMonthBtn.addEventListener('click', function() {
            currentMonth++;
            if (currentMonth > 11) {
                currentMonth = 0;
                currentYear++;
            }
            renderCalendar(currentMonth, currentYear);
        });
    }
    
    // ======================
    // RENDER CALENDAR
    // ======================
    function renderCalendar(month, year) {
        // Update month display text
        currentMonthElement.textContent = `${monthNames[month]} ${year}`;
        
        // Clear previous calendar days
        calendarDays.innerHTML = '';
        
        // Get first day of the month
        const firstDay = new Date(year, month, 1);
        const startingDay = firstDay.getDay();
        
        // Get number of days in the month
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        
        // Get today's date for highlighting current day
        const today = new Date();
        const todayFormatted = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;
        
        // Add empty cells for days before the first day of the month
        for (let i = 0; i < startingDay; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'calendar-day empty';
            calendarDays.appendChild(emptyDay);
        }
        
        // Add days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            dayElement.textContent = day;
            
            // Format date for comparison
            const dateFormatted = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
            
            // Check if today and add 'today' class
            if (dateFormatted === todayFormatted) {
                dayElement.classList.add('today');
            }
            
            // Check if date has events
            if (calendarEvents[dateFormatted]) {
                dayElement.classList.add('event-day');
                
                // Create event indicator container
                const eventIndicator = document.createElement('div');
                eventIndicator.className = 'event-indicator';
                
                // Add colored dots for each event type
                calendarEvents[dateFormatted].forEach(eventType => {
                    const eventDot = document.createElement('span');
                    eventDot.className = `event-dot ${eventType}`;
                    eventIndicator.appendChild(eventDot);
                });
                
                dayElement.appendChild(eventIndicator);
                
                // Add click event to show events for this day
                dayElement.addEventListener('click', function() {
                    showEventsForDate(dateFormatted);
                });
            }
            
            calendarDays.appendChild(dayElement);
        }
    }
    
    // ======================
    // SHOW EVENTS FOR DATE
    // ======================
    function showEventsForDate(date) {
        const eventDate = new Date(date);
        const formattedDate = eventDate.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
        
        // In a real application, this would fetch events for the selected date
        // For demo purposes, show an alert
        alert(`Events for ${formattedDate}\n\nThis feature would show detailed events for the selected date.`);
    }
    
    // ======================
    // EVENT SEARCH FUNCTIONALITY
    // ======================
    if (eventSearch) {
        eventSearch.addEventListener('input', function() {
            filterEvents();
        });
    }
    
    // ======================
    // CATEGORY FILTER FUNCTIONALITY
    // ======================
    if (categoryFilter) {
        categoryFilter.addEventListener('change', function() {
            filterEvents();
        });
    }
    
    // ======================
    // TIME FILTER FUNCTIONALITY
    // ======================
    if (timeFilter) {
        timeFilter.addEventListener('change', function() {
            filterEvents();
        });
    }
    
    // ======================
    // RESET FILTERS FUNCTIONALITY
    // ======================
    if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener('click', function() {
            // Reset all filter values to default
            eventSearch.value = '';
            categoryFilter.value = 'all';
            timeFilter.value = 'all';
            filterEvents();
        });
    }
    
    // ======================
    // FILTER EVENTS FUNCTION
    // ======================
    function filterEvents() {
        const searchTerm = eventSearch.value.toLowerCase();
        const selectedCategory = categoryFilter.value;
        const selectedTime = timeFilter.value;
        
        console.log(`Filtering: Search="${searchTerm}", Category="${selectedCategory}", Time="${selectedTime}"`);
        
        // Get all event cards
        const eventCards = document.querySelectorAll('.upcoming-event-card, .past-event-card');
        
        // Loop through each event card and apply filters
        eventCards.forEach(card => {
            const cardTitle = card.querySelector('h3').textContent.toLowerCase();
            const cardCategory = card.querySelector('.event-category')?.textContent.toLowerCase() || '';
            
            // Check if card matches search term
            let matchesSearch = !searchTerm || cardTitle.includes(searchTerm);
            
            // Check if card matches selected category
            let matchesCategory = selectedCategory === 'all' || cardCategory.includes(selectedCategory);
            
            // Check if card matches selected time filter
            let matchesTime = true;
            if (selectedTime === 'upcoming') {
                matchesTime = card.closest('.upcoming-events') !== null;
            } else if (selectedTime === 'past') {
                matchesTime = card.closest('.past-events') !== null;
            } else if (selectedTime === 'month') {
                // For month filter - in a real app, you'd check dates
                matchesTime = true; // Simplified for demo
            }
            
            // Show or hide card based on filter matches
            if (matchesSearch && matchesCategory && matchesTime) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }
    
    // ======================
    // ANIMATE STATS COUNTERS
    // ======================
    function animateStats() {
        const statNumbers = document.querySelectorAll('.stat-info h3');
        
        statNumbers.forEach(stat => {
            const target = parseInt(stat.textContent);
            const duration = 1500; // Animation duration in milliseconds
            const increment = target / (duration / 16); // 16ms per frame (approx 60fps)
            let current = 0;
            
            // Create counting animation
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                stat.textContent = Math.floor(current);
            }, 16);
        });
    }
    
    // ======================
    // SETUP EVENT BUTTONS
    // ======================
    function setupEventButtons() {
        // Setup register buttons for upcoming events
        const registerButtons = document.querySelectorAll('.event-actions .btn-primary');
        
        registerButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const eventTitle = this.closest('.upcoming-event-card').querySelector('h3').textContent;
                
                // In a real application, this would open a registration form
                alert(`Registration for "${eventTitle}"\n\nThis would open a registration form in a real application.`);
            });
        });
        
        // Setup detail buttons for all events
        const detailButtons = document.querySelectorAll('.event-actions .btn-secondary, .list-event-action');
        
        detailButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const eventCard = this.closest('.upcoming-event-card, .past-event-card, .list-event-item');
                const eventTitle = eventCard.querySelector('h3, h4').textContent;
                
                // In a real application, this would navigate to event detail page
                alert(`Event Details: "${eventTitle}"\n\nThis would navigate to a detailed event page in a real application.`);
            });
        });
    }
    
    // ======================
    // SETUP PAST EVENT GALLERY NAVIGATION
    // ======================
    function setupGalleryNavigation() {
        // Get all view gallery buttons
        const viewGalleryButtons = document.querySelectorAll('.view-gallery');
        
        viewGalleryButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const eventCard = this.closest('.past-event-card');
                const eventTitle = eventCard.querySelector('h3').textContent;
                
                // Get event ID or name for filtering in gallery
                const eventId = eventCard.getAttribute('data-event-id') || 
                               eventTitle.toLowerCase().replace(/\s+/g, '-');
                
                // Store event ID in sessionStorage to filter gallery
                sessionStorage.setItem('selectedEvent', eventId);
                
                // Navigate to gallery page
                window.location.href = 'gallery.html';
            });
        });
        
        // Also make the entire past event card clickable for better UX
        const pastEventCards = document.querySelectorAll('.past-event-card');
        pastEventCards.forEach(card => {
            card.addEventListener('click', function(e) {
                // Don't trigger if clicking on buttons or links inside
                if (e.target.closest('.view-gallery') || e.target.tagName === 'A') {
                    return;
                }
                
                const eventTitle = card.querySelector('h3').textContent;
                const eventId = card.getAttribute('data-event-id') || 
                               eventTitle.toLowerCase().replace(/\s+/g, '-');
                
                // Store event ID and navigate to gallery
                sessionStorage.setItem('selectedEvent', eventId);
                window.location.href = 'gallery.html';
            });
        });
    }
    
    // ======================
    // INITIALIZE EVERYTHING
    // ======================
    function initializePage() {
        initCalendar();         // Initialize calendar
        animateStats();         // Animate statistic counters
        setupEventButtons();    // Setup event button handlers
        setupGalleryNavigation(); // Setup gallery navigation
        setupScrollAnimations(); // Setup scroll animations
    }
    
    // ======================
    // SETUP SCROLL ANIMATIONS
    // ======================
    function setupScrollAnimations() {
        const statCards = document.querySelectorAll('.stat-card');
        
        if (statCards.length > 0) {
            const observerOptions = {
                threshold: 0.5 // Trigger when 50% of element is visible
            };
            
            const observer = new IntersectionObserver(function(entries) {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        // Animate in when visible
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                        observer.unobserve(entry.target); // Stop observing after animation
                    }
                });
            }, observerOptions);
            
            // Set initial state for animation
            statCards.forEach(card => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                observer.observe(card);
            });
        }
    }
    
    // Start the page initialization
    initializePage();
});