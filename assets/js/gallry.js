// Gallery Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Gallery Filtering
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const gallerySearch = document.getElementById('gallerySearch');
    const loadMoreBtn = document.getElementById('loadMore');
    const shownCount = document.getElementById('shownCount');
    const totalCount = document.getElementById('totalCount');
    
    // Gallery data for filtering
    let currentFilter = 'all';
    let currentSearch = '';
    let visibleItems = 12;
    const itemsPerLoad = 6;
    
    // Initialize gallery
    function initGallery() {
        updateItemCount();
        setupEventListeners();
        animateStats();
    }
    
    // Setup event listeners
    function setupEventListeners() {
        // Filter button clicks
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Update active button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                // Set filter and update gallery
                currentFilter = this.getAttribute('data-filter');
                filterGallery();
            });
        });
        
        // Search input
        if (gallerySearch) {
            gallerySearch.addEventListener('input', function() {
                currentSearch = this.value.toLowerCase().trim();
                filterGallery();
            });
        }
        
        // Load more button
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', function() {
                loadMoreItems();
            });
        }
        
        // View button clicks for lightbox
        const viewButtons = document.querySelectorAll('.view-btn');
        viewButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const itemId = this.getAttribute('data-id');
                openLightbox(itemId);
            });
        });
        
        // Video play buttons
        const videoPlayButtons = document.querySelectorAll('.video-play, .video-thumb');
        videoPlayButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const parentItem = this.closest('.gallery-item');
                const itemId = parentItem.querySelector('.view-btn').getAttribute('data-id');
                openVideoModal(itemId);
            });
        });
        
        // Upload button
        const uploadBtn = document.getElementById('uploadBtn');
        if (uploadBtn) {
            uploadBtn.addEventListener('click', function() {
                alert('Upload feature would open a file upload dialog in a real application.\n\nSupported formats: JPG, PNG, MP4, MOV\nMax file size: 50MB');
            });
        }
        
        // Collection links
        const collectionLinks = document.querySelectorAll('.collection-link');
        collectionLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const collectionTitle = this.closest('.collection-card').querySelector('h3').textContent;
                alert(`This would open the "${collectionTitle}" collection in a real application.`);
            });
        });
    }
    
    // Filter gallery based on current filter and search
    function filterGallery() {
        let visibleCount = 0;
        
        galleryItems.forEach((item, index) => {
            const category = item.getAttribute('data-category');
            const title = item.querySelector('h3').textContent.toLowerCase();
            const description = item.querySelector('.gallery-description').textContent.toLowerCase();
            
            // Check if item matches filter
            const matchesFilter = currentFilter === 'all' || category === currentFilter;
            
            // Check if item matches search
            const matchesSearch = !currentSearch || 
                title.includes(currentSearch) || 
                description.includes(currentSearch);
            
            // Show/hide item
            if (matchesFilter && matchesSearch) {
                item.classList.remove('hidden');
                visibleCount++;
                
                // Control initial visibility for load more
                if (visibleCount <= visibleItems) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            } else {
                item.classList.add('hidden');
                item.style.display = 'none';
            }
        });
        
        // Update counts
        updateItemCount();
        
        // Show/hide load more button
        const totalVisible = document.querySelectorAll('.gallery-item:not(.hidden)').length;
        if (totalVisible <= visibleItems) {
            loadMoreBtn.style.display = 'none';
        } else {
            loadMoreBtn.style.display = 'inline-flex';
        }
    }
    
    // Load more items
    function loadMoreItems() {
        visibleItems += itemsPerLoad;
        filterGallery();
        
        // Smooth scroll to newly loaded items
        const newItems = document.querySelectorAll('.gallery-item:not(.hidden)');
        if (newItems.length > 0) {
            const lastNewItem = newItems[Math.min(visibleItems, newItems.length) - 1];
            lastNewItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }
    
    // Update item count display
    function updateItemCount() {
        const totalVisible = document.querySelectorAll('.gallery-item:not(.hidden)').length;
        const currentlyShown = Math.min(visibleItems, totalVisible);
        
        if (shownCount) shownCount.textContent = currentlyShown;
        if (totalCount) totalCount.textContent = totalVisible;
        
        // Update stats based on filter
        updateStats(currentFilter, totalVisible);
    }
    
    // Update gallery stats based on filter
    function updateStats(filter, count) {
        const totalItems = document.getElementById('totalItems');
        const photosCount = document.getElementById('photosCount');
        const videosCount = document.getElementById('videosCount');
        const eventsCount = document.getElementById('eventsCount');
        
        if (filter === 'all') {
            if (totalItems) totalItems.textContent = count;
        } else if (filter === 'photos') {
            if (photosCount) photosCount.textContent = count;
        } else if (filter === 'videos') {
            if (videosCount) videosCount.textContent = count;
        } else if (filter === 'events') {
            if (eventsCount) eventsCount.textContent = count;
        }
    }
    
    // Animate stats counters
    function animateStats() {
        const statNumbers = document.querySelectorAll('.stat-number');
        
        statNumbers.forEach(stat => {
            const originalText = stat.textContent;
            const target = parseInt(originalText.replace(/,/g, ''));
            
            // Only animate if it's a number
            if (!isNaN(target)) {
                const duration = 1500;
                const increment = target / (duration / 16);
                let current = 0;
                
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        current = target;
                        clearInterval(timer);
                    }
                    stat.textContent = Math.floor(current).toLocaleString();
                }, 16);
            }
        });
    }
    
    // Lightbox functionality
    const lightboxModal = document.getElementById('lightboxModal');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');
    const lightboxTitle = document.getElementById('lightboxTitle');
    const lightboxDate = document.getElementById('lightboxDate');
    const lightboxDescription = document.getElementById('lightboxDescription');
    const lightboxCamera = document.getElementById('lightboxCamera');
    const lightboxViews = document.getElementById('lightboxViews');
    const lightboxDownload = document.getElementById('lightboxDownload');
    const lightboxShare = document.getElementById('lightboxShare');
    
    let currentLightboxIndex = 0;
    let lightboxItems = [];
    
    // Open lightbox
    function openLightbox(itemId) {
        // Get all visible gallery items
        lightboxItems = Array.from(document.querySelectorAll('.gallery-item:not(.hidden)'));
        
        // Find current item index
        currentLightboxIndex = lightboxItems.findIndex(item => {
            const viewBtn = item.querySelector('.view-btn');
            return viewBtn && viewBtn.getAttribute('data-id') === itemId;
        });
        
        if (currentLightboxIndex === -1) return;
        
        // Load current item
        loadLightboxItem(currentLightboxIndex);
        
        // Show lightbox
        lightboxModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Add keyboard event listeners
        document.addEventListener('keydown', handleLightboxKeyboard);
    }
    
    // Load lightbox item by index
    function loadLightboxItem(index) {
        if (index < 0 || index >= lightboxItems.length) return;
        
        const item = lightboxItems[index];
        const image = item.querySelector('.gallery-image img');
        const title = item.querySelector('h3').textContent;
        const date = item.querySelector('.gallery-date').textContent;
        const description = item.querySelector('.gallery-description').textContent;
        const metaSpans = item.querySelectorAll('.gallery-meta span');
        
        // Set lightbox content
        const lightboxMedia = lightboxModal.querySelector('.lightbox-media');
        lightboxMedia.innerHTML = `<img src="${image.src}" alt="${title}">`;
        
        lightboxTitle.textContent = title;
        lightboxDate.textContent = date;
        lightboxDescription.textContent = description;
        
        if (metaSpans.length >= 2) {
            lightboxCamera.textContent = metaSpans[0].textContent;
            lightboxViews.textContent = metaSpans[1].textContent;
        }
    }
    
    // Close lightbox
    function closeLightbox() {
        lightboxModal.classList.remove('active');
        document.body.style.overflow = 'auto';
        document.removeEventListener('keydown', handleLightboxKeyboard);
    }
    
    // Navigate to previous item
    function prevLightboxItem() {
        currentLightboxIndex--;
        if (currentLightboxIndex < 0) {
            currentLightboxIndex = lightboxItems.length - 1;
        }
        loadLightboxItem(currentLightboxIndex);
    }
    
    // Navigate to next item
    function nextLightboxItem() {
        currentLightboxIndex++;
        if (currentLightboxIndex >= lightboxItems.length) {
            currentLightboxIndex = 0;
        }
        loadLightboxItem(currentLightboxIndex);
    }
    
    // Handle keyboard navigation
    function handleLightboxKeyboard(e) {
        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowLeft') {
            prevLightboxItem();
        } else if (e.key === 'ArrowRight') {
            nextLightboxItem();
        }
    }
    
    // Video Modal functionality
    const videoModal = document.getElementById('videoModal');
    const videoClose = document.getElementById('videoClose');
    
    // Open video modal
    function openVideoModal(itemId) {
        // In a real application, this would load the actual video
        // For demo, we'll use a placeholder
        const videoPlayer = videoModal.querySelector('.video-player');
        videoPlayer.innerHTML = `
            <iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ" 
                    title="Sample Video" 
                    frameborder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowfullscreen>
            </iframe>
        `;
        
        videoModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    // Close video modal
    function closeVideoModal() {
        videoModal.classList.remove('active');
        document.body.style.overflow = 'auto';
        
        // Stop video playback
        const iframe = videoModal.querySelector('iframe');
        if (iframe) {
            const iframeSrc = iframe.src;
            iframe.src = iframeSrc; // Reset to stop video
        }
    }
    
    // Setup lightbox event listeners
    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }
    
    if (lightboxPrev) {
        lightboxPrev.addEventListener('click', prevLightboxItem);
    }
    
    if (lightboxNext) {
        lightboxNext.addEventListener('click', nextLightboxItem);
    }
    
    if (lightboxDownload) {
        lightboxDownload.addEventListener('click', function() {
            alert('Download feature would start file download in a real application.');
        });
    }
    
    if (lightboxShare) {
        lightboxShare.addEventListener('click', function() {
            alert('Share feature would open sharing options in a real application.');
        });
    }
    
    // Close lightbox when clicking on backdrop
    lightboxModal.addEventListener('click', function(e) {
        if (e.target === this) {
            closeLightbox();
        }
    });
    
    // Setup video modal event listeners
    if (videoClose) {
        videoClose.addEventListener('click', closeVideoModal);
    }
    
    // Close video modal when clicking on backdrop
    videoModal.addEventListener('click', function(e) {
        if (e.target === this) {
            closeVideoModal();
        }
    });
    
    // Initialize the gallery
    initGallery();
    
    // Add animation to gallery items on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Apply initial styles for animation
    galleryItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(item);
    });
    
    // Add animation to collection cards
    const collectionCards = document.querySelectorAll('.collection-card');
    collectionCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(card);
    });
});


