document.addEventListener('DOMContentLoaded', () => {
    // --- TRANSLATION ---
    const translations = {
        en: {
            subtitle: "Full Stack Creator",
            about_title: "About Me",
            about_p: "I’m David Gvakharia — an Economics student who fell in love with art. I enjoy creating 3D visuals, moods, and little stories that feel alive. Art helps me say things words can’t. I’m always learning, trying new styles, and pushing myself to get better with every project. My goal is simple — to create something that connects with people and leaves a small feeling behind.",
            featured_title: "Featured Work",
            skills_title: "Skills & Software",
            skills_cat1_title: "Creative & Technical Skills",
            skills_cat2_title: "Software",
            gallery_title: "Artwork Gallery",
            gallery_p: "A selection of my recent creations. Click any image to view it in full screen.",
            captures_title: "Captures",
            captures_p: "A selection of my recent captures. Click any image to view it in full screen.",
            footer_contact: "Get in touch:",
            videos_title: "Videos",
            videos_p: "A selection of my video projects. Click to watch.",
            modal_software: "Software: Cinema 4D & Octane Renderer",
            modal_camera: "Camera: Sony HX-300"
        },
        ge: {
            subtitle: "Full Stack დეველოპერი",
            about_title: "ჩემს შესახებ",
            about_p: "მე ვარ ეკონომიკის სტუდენტი, რომელსაც ხელოვნება შემოეყვარა. მსიამოვნებს 3D ვიზუალიზაციების, განწყობების და პატარა ისტორიების შექმნა, რომლებიც ცოცხალ შეგრძნებას ტოვებს. ხელოვნება მეხმარება ისეთი რაღაცები ვთქვა, რასაც სიტყვები ვერ ამბობს. სულ ვსწავლობ, ვცდი ახალ სტილებს და ვცდილობ, რომ ყოველი პროექტით გავუმჯობესდე. ჩემი მიზანი მარტივია — შევქმნა ისეთი რამ, რაც ადამიანებთან კავშირს დაამყარებს და პატარა შეგრძნებას დატოვებს.",
            featured_title: "გამორჩეული ნამუშევარი",
            skills_title: "უნარები და პროგრამები",
            skills_cat1_title: "უნარები",
            skills_cat2_title: "პროგრამები",
            gallery_title: "ნამუშევრები",
            gallery_p: "ნამუშევრების კრებული. დააჭირეთ სურათს სრულ ეკრანზე სანახავად.",
            captures_title: "ფოტოები",
            captures_p: "",
            videos_title: "ვიდეოები",
            videos_p: "ჩემი ვიდეო პროექტების კრებული. დააჭირეთ საყურებლად.",
            footer_contact: "დამიკავშირდით:",
            modal_software: "პროგრამები: Cinema 4D & Octane Renderer",
            modal_camera: "კამერა: Sony HX-300"
        }
    };

    // --- GALLERY CONFIGURATION ---
    // This new "universal" function will check for up to 200 numbered images
    // and automatically display the ones it finds, in the correct order.
    // You no longer need to edit any numbers here.
    const MAX_ARTWORKS_TO_CHECK = 200;

    // --- FEATURED COMPARISON SLIDER ---
    const comparisonSlider = document.getElementById('featured-comparison-slider');
    if (comparisonSlider) {
        const afterImage = comparisonSlider.querySelector('.image-after');
        const handle = comparisonSlider.querySelector('.comparison-handle');
        let isDragging = false;

        const startDrag = () => {
            isDragging = true;
            // Disable transition during drag for instant feedback
            handle.style.transition = 'none';
            afterImage.style.transition = 'none';
        };
        const stopDrag = () => {
            if (!isDragging) return;
            isDragging = false;
            // Re-enable transition and animate back to center
            handle.style.transition = 'left 0.4s ease';
            afterImage.style.transition = 'clip-path 0.4s ease';
            handle.style.left = '50%';
            afterImage.style.clipPath = 'inset(0 50% 0 0)';
        };

        const onDrag = (e) => {
            if (!isDragging) return;

            // Get the position of the mouse or touch
            const clientX = e.clientX || (e.touches && e.touches[0].clientX);
            if (clientX === undefined) return;

            const rect = comparisonSlider.getBoundingClientRect();
            let position = (clientX - rect.left) / rect.width;

            // Clamp the position between 0 and 1
            position = Math.max(0, Math.min(1, position));

            // Update the handle position and image clip
            handle.style.left = `${position * 100}%`;
            afterImage.style.clipPath = `inset(0 ${100 - position * 100}% 0 0)`;
        };

        // Mouse events
        comparisonSlider.addEventListener('mousedown', startDrag);
        window.addEventListener('mouseup', stopDrag);
        window.addEventListener('mousemove', onDrag);

        // Touch events
        comparisonSlider.addEventListener('touchstart', startDrag, { passive: true });
        window.addEventListener('touchend', stopDrag);
        window.addEventListener('touchmove', onDrag, { passive: true });
    }

    // --- GALLERY CREATION ---
    const mainContent = document.querySelector('main');
    let galleryData = {}; // Object to hold items for each gallery

    // This new, more robust function finds your images automatically.
    async function populateGallery(folder, gridId, loaderId) {
        const galleryGrid = document.getElementById(gridId);
        const galleryLoader = document.getElementById(loaderId);
        if (!galleryGrid || !galleryLoader) return;

        galleryLoader.style.display = 'block'; // Ensure loader is visible
        const imagePromises = [];

        // Create a list of potential image paths to check
        for (let i = 1; i <= MAX_ARTWORKS_TO_CHECK; i++) {
            const jpgPath = `${folder}/${i}.jpg`;
            const pngPath = `${folder}/${i}.png`;

            // Create a promise for each potential image
            const checkImage = (path) => new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = () => resolve({ path, number: i });
                img.onerror = reject;
                img.src = path;
            });

            imagePromises.push(checkImage(jpgPath));
            imagePromises.push(checkImage(pngPath));
        }

        // Wait for all checks to complete
        const results = await Promise.allSettled(imagePromises);

        // Filter for only the images that were successfully found
        const foundImages = results
            .filter(result => result.status === 'fulfilled')
            .map(result => result.value);

        // Sort them by their number to ensure correct order
        foundImages.sort((a, b) => a.number - b.number);

        // Store the sorted list for this specific gallery
        galleryData[gridId] = foundImages;

        // Create and append the gallery items in the correct order
        foundImages.forEach(({ path, number }) => {
            const thumbPath = `${folder}/thumbs/${path.split('/')[1]}`;

            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item';
            galleryItem.dataset.src = path;
            // Use the thumbnail for the initial display and provide the full image via srcset
            galleryItem.innerHTML = `<img src="${thumbPath}" srcset="${thumbPath} 1x, ${path} 2x" alt="Artwork ${number}">`;
            galleryGrid.appendChild(galleryItem);
        });

        // Hide the loader after everything is done
        galleryLoader.style.display = 'none';
    }

    async function populateVideoGallery() {
        try {
            const response = await fetch('videos.json');
            if (!response.ok) return;
            const videos = await response.json();
            const videoGrid = document.getElementById('video-grid');
            if (!videoGrid) return;

            videos.forEach(video => {
                const videoItem = document.createElement('div');
                videoItem.className = 'video-item';
                videoItem.dataset.videoId = video.videoId;
                // Automatically generate YouTube thumbnail URL
                const thumbnailUrl = `https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`;
                videoItem.innerHTML = `<img src="${thumbnailUrl}" alt="${video.title}">`;
                videoGrid.appendChild(videoItem);
            });

        } catch (error) {
            console.error("Could not load video data:", error);
        }
    }


    let orderedGalleryItems = [];
    let currentImageIndex = -1;

    // New function to orchestrate all content loading
    async function loadAllContent() {
        const pageLoader = document.getElementById('page-loader');
        document.body.classList.add('loading'); // Hide scrollbar

        // Run all gallery population tasks in parallel
        await Promise.all([
            populateGallery('artworks', 'gallery-grid', 'gallery-loader'),
            populateGallery('captures', 'captures-grid', 'captures-loader'),
            populateVideoGallery()
        ]);

        // Hide the main page loader and restore scrollbar after everything is done
        pageLoader.classList.add('hidden');
        document.body.classList.remove('loading');
    }

    loadAllContent();
    // --- MODAL (FULLSCREEN) LOGIC ---
    const modal = document.getElementById('modal');
    const modalImg = document.getElementById('modal-img');
    const modalSliderContent = document.getElementById('modal-slider-content');
    const closeModal = document.querySelector('.close-modal');
    const modalPrev = document.getElementById('modal-prev');
    const modalNext = document.getElementById('modal-next');
    const modalVideoContainer = document.getElementById('modal-video-container');
    const softwareInfo = document.querySelector('.software-info');
    let modalSlides = [];
    let currentModalSlide = 0;

    function showModalSlide(index) {
        const slides = modalSliderContent.querySelectorAll('img');
        slides.forEach((slide, i) => {
            slide.style.display = i === index ? 'block' : 'none';
        });
    }

    // --- KEYBOARD NAVIGATION & MODAL CLOSING ---
    function handleKeyDown(e) {
        if (!modal.classList.contains('visible')) return;

        switch (e.key) {
            case 'Escape':
                closeTheModal();
                break;
            case 'ArrowRight':
                // If it's an internal slider (not a single gallery image)
                if (modalSliderContent.style.display === 'block') {
                    modalNext.click();
                } else { // Otherwise, navigate the main gallery
                    navigateToGalleryImage(1);
                }
                break;
            case 'ArrowLeft':
                // If it's an internal slider (not a single gallery image)
                if (modalSliderContent.style.display === 'block') {
                    modalPrev.click();
                } else { // Otherwise, navigate the main gallery
                    navigateToGalleryImage(-1);
                }
                break;
        }
    }

    function closeTheModal() {
        modal.classList.remove('visible');
        document.body.classList.remove('modal-open');
        // Stop video playback when closing modal
        if (modalVideoContainer) {
            modalVideoContainer.innerHTML = '';
        }
        document.removeEventListener('keydown', handleKeyDown);
    }

    closeModal.onclick = closeTheModal;

    function navigateToGalleryImage(direction) {
        if (orderedGalleryItems.length === 0) return;

        // Prevent multiple clicks during animation
        if (modalImg.classList.contains('modal-img-out-left') || modalImg.classList.contains('modal-img-out-right')) {
            return;
        }

        const newIndex = currentImageIndex + direction;

        // Prevent looping: check if the new index is out of bounds.
        if (newIndex < 0 || newIndex >= orderedGalleryItems.length) {
            return; // Do nothing if we are at the beginning or end.
        }
        
        // 1. Animate the current image out
        const outClass = direction === 1 ? 'modal-img-out-left' : 'modal-img-out-right';
        modalImg.classList.add(outClass);

        // After the 'out' animation finishes, swap the image and animate it 'in'
        setTimeout(() => {
            currentImageIndex = newIndex;
            const newPath = orderedGalleryItems[newIndex].path;
            modalImg.src = newPath;
            updateGalleryNavButtons();

            // Remove the 'out' class and prepare the 'in' animation by positioning it off-screen
            const inClass = direction === 1 ? 'modal-img-in-from-right' : 'modal-img-in-from-left';
            modalImg.classList.remove(outClass);
            modalImg.classList.add(inClass);

            // Force a reflow, then remove the 'in' class to trigger the transition to the center
            void modalImg.offsetWidth;
            modalImg.classList.remove(inClass);
        }, 300); // This timeout should match the CSS transition duration
    }

    function updateGalleryNavButtons() {
        modalPrev.classList.toggle('hidden', currentImageIndex === 0);
        modalNext.classList.toggle('hidden', currentImageIndex === orderedGalleryItems.length - 1);
    }
    // --- EVENT LISTENERS ---

    // Use event delegation on the main element to handle clicks from any gallery
    mainContent.addEventListener('click', (e) => {
        const item = e.target.closest('.gallery-item');
        const videoItem = e.target.closest('.video-item');

        if (!item && !videoItem) return;

        modal.classList.add('visible');
        document.body.classList.add('modal-open');

        // Hide all content containers initially
        modalImg.style.display = 'none';
        modalSliderContent.style.display = 'none';
        modalVideoContainer.style.display = 'none';
        softwareInfo.style.display = 'none';
        modalPrev.classList.add('hidden');
        modalNext.classList.add('hidden');

        if (videoItem) {
            const videoId = videoItem.dataset.videoId;
            modalVideoContainer.style.display = 'block';
            modalVideoContainer.innerHTML = `<iframe src="https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
            return; // Stop here for videos
        }

        const parentGridId = item.closest('.gallery-grid').id;
        orderedGalleryItems = galleryData[parentGridId] || [];

        // Update the info text based on which gallery was clicked
        const currentLang = localStorage.getItem('portfolio_lang') || 'en';
        if (parentGridId === 'captures-grid') {
            softwareInfo.dataset.langKey = 'modal_camera';
            softwareInfo.style.display = 'block';
            if (translations[currentLang]) {
                softwareInfo.textContent = translations[currentLang].modal_camera;
            }
        } else { // Default to artworks
            softwareInfo.dataset.langKey = 'modal_software';
            softwareInfo.style.display = 'block';
            if (translations[currentLang]) {
                softwareInfo.textContent = translations[currentLang].modal_software;
            }
        }

        document.addEventListener('keydown', handleKeyDown);

        const clickedPath = item.dataset.src;
        currentImageIndex = orderedGalleryItems.findIndex(img => img.path === clickedPath);

        if (item.dataset.src) {
            modalImg.src = item.dataset.src;
            modalImg.style.display = 'block';
            modalSliderContent.style.display = 'none';
            modalPrev.style.display = 'block';
            modalNext.style.display = 'block';
            updateGalleryNavButtons();
        } else if (item.dataset.slider) {
            modalSlides = JSON.parse(item.dataset.slider);
            modalSliderContent.innerHTML = modalSlides.map(src => `<img src="${src}" alt="Artwork" style="display: none;">`).join('');
            modalImg.style.display = 'none';
            modalSliderContent.style.display = 'block';
            modalPrev.style.display = 'block';
            modalNext.style.display = 'block';
            currentModalSlide = 0;
            showModalSlide(currentModalSlide);
        }
    });

    modal.onclick = (e) => {
        if (e.target === modal) {
            closeTheModal();
        }
    };

    modalNext.addEventListener('click', () => {
        if (modalSliderContent.style.display === 'block') {
            currentModalSlide = (currentModalSlide + 1) % modalSlides.length;
            showModalSlide(currentModalSlide);
        } else {
            navigateToGalleryImage(1);
        }
    });

    modalPrev.addEventListener('click', () => {
        if (modalSliderContent.style.display === 'block') {
            currentModalSlide = (currentModalSlide - 1 + modalSlides.length) % modalSlides.length;
            showModalSlide(currentModalSlide);
        } else {
            navigateToGalleryImage(-1);
        }
    });

    // --- FOOTER ---
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // --- TRANSLATION LOGIC ---
    const langButtons = document.querySelectorAll('.lang-btn');

    function setLanguage(lang) {
        // Update text content
        document.querySelectorAll('[data-lang-key]').forEach(el => {
            const key = el.getAttribute('data-lang-key');
            if (translations[lang] && translations[lang][key]) {
                el.textContent = translations[lang][key];
            }
        });

        // Update body class for font switching
        document.body.classList.toggle('lang-ge', lang === 'ge');

        // Update active button
        langButtons.forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
        });

        // Save preference
        localStorage.setItem('portfolio_lang', lang);
    }

    langButtons.forEach(button => {
        button.addEventListener('click', () => {
            setLanguage(button.getAttribute('data-lang'));
        });
    });

    // Set initial language from storage or default to 'en'
    const savedLang = localStorage.getItem('portfolio_lang') || 'en';
    setLanguage(savedLang);

    // --- Console Protection (Deterrents) ---

    // 1. Disable Right-Click Context Menu
    document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
    });

    // 2. Disable Common Developer Keyboard Shortcuts
    document.addEventListener('keydown', (e) => {
        // Disable F12
        if (e.key === 'F12') {
            e.preventDefault();
        }
        // Disable Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C
        if (e.ctrlKey && e.shiftKey && ['I', 'J', 'C'].includes(e.key.toUpperCase())) {
            e.preventDefault();
        }
        // Disable Ctrl+U (View Source)
        if (e.ctrlKey && e.key.toUpperCase() === 'U') {
            e.preventDefault();
        }
    });

    // 3. Implement a debugger trap to make the console difficult to use.
    // This will repeatedly pause execution if the developer tools are open.
    function startDebuggerTrap() {
        setInterval(() => {
            debugger;
        }, 500);
    }
    // startDebuggerTrap(); // Uncomment this line to re-enable the console protection.
});