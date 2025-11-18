document.addEventListener('DOMContentLoaded', () => {
    // --- TRANSLATION ---
    const translations = {
        en: {
            subtitle: "Full Stack Creator",
            about_title: "About Me",
            about_p: "Welcome to my creative space. I am a Full Stack Creator, blending the art of design with the precision of code. My passion lies in building beautiful, functional, and user-centric digital experiences. From concept to deployment, I bring ideas to life.",
            featured_title: "Featured Work",
            skills_title: "Skills & Software",
            skills_cat1_title: "Creative & Technical Skills",
            skills_cat2_title: "Software",
            gallery_title: "Artwork Gallery",
            gallery_p: "A selection of my recent creations. Click any image to view it in full screen.",
            footer_contact: "Get in touch:",
            modal_software: "Software: Cinema 4D & Octane Renderer"
        },
        ge: {
            subtitle: "Full Stack დეველოპერი",
            about_title: "ჩემს შესახებ",
            about_p: "კეთილი იყოს თქვენი მობრძანება ჩემს შემოქმედებით სივრცეში. მე ვარ Full Stack დეველოპერი, რომელიც აერთიანებს დიზაინის ხელოვნებასა და კოდის სიზუსტეს. ჩემი გატაცებაა ლამაზი, ფუნქციური და მომხმარებელზე ორიენტირებული ციფრული გამოცდილების შექმნა. კონცეფციიდან საბოლოო პროდუქტამდე, მე ვაცოცხლებ იდეებს.",
            featured_title: "გამორჩეული ნამუშევარი",
            skills_title: "უნარები და პროგრამები",
            skills_cat1_title: "უნარები",
            skills_cat2_title: "პროგრამები",
            gallery_title: "ნამუშევრები",
            gallery_p: "ნამუშევრების კრებული. დააჭირეთ სურათს სრულ ეკრანზე სანახავად.",
            footer_contact: "დამიკავშირდით:",
            modal_software: "პროგრამები: Cinema 4D & Octane Renderer"
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
    const galleryGrid = document.getElementById('gallery-grid');
    const galleryLoader = document.getElementById('gallery-loader');

    // This new, more robust function finds your images automatically.
    async function generateGallery() {
        const pageLoader = document.getElementById('page-loader');
        galleryLoader.style.display = 'block'; // Ensure loader is visible
        const imagePromises = [];

        // Create a list of potential image paths to check
        for (let i = 1; i <= MAX_ARTWORKS_TO_CHECK; i++) {
            const jpgPath = `artworks/${i}.jpg`;
            const pngPath = `artworks/${i}.png`;

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

        // ** THE FIX **: Store the sorted list for keyboard navigation.
        orderedGalleryItems = foundImages;

        // Create and append the gallery items in the correct order
        foundImages.forEach(({ path, number }) => {
            const thumbPath = `artworks/thumbs/${path.split('/')[1]}`;

            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item';
            galleryItem.dataset.src = path;
            // Use the thumbnail for the initial display and provide the full image via srcset
            galleryItem.innerHTML = `<img src="${thumbPath}" srcset="${thumbPath} 1x, ${path} 2x" alt="Artwork ${number}">`;
            galleryGrid.appendChild(galleryItem);
        });

        // Hide the loader after everything is done
        galleryLoader.style.display = 'none';

        // Hide the main page loader
        if (pageLoader) {
            pageLoader.classList.add('hidden');
        }
    }

    let orderedGalleryItems = [];
    let currentImageIndex = -1;

    generateGallery();

    // --- MODAL (FULLSCREEN) LOGIC ---
    const modal = document.getElementById('modal');
    const modalImg = document.getElementById('modal-img');
    const modalSliderContent = document.getElementById('modal-slider-content');
    const closeModal = document.querySelector('.close-modal');
    const modalPrev = document.getElementById('modal-prev');
    const modalNext = document.getElementById('modal-next');
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
        if (modal.style.display !== 'flex') return;

        switch (e.key) {
            case 'Escape':
                closeTheModal();
                break;
            case 'ArrowRight':
                // If it's a slider, use the slider's own navigation
                if (modalNext.style.display === 'block') {
                    modalNext.click();
                } else { // Otherwise, navigate the main gallery
                    navigateToGalleryImage(1);
                }
                break;
            case 'ArrowLeft':
                // If it's a slider, use the slider's own navigation
                if (modalPrev.style.display === 'block') {
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
        document.removeEventListener('keydown', handleKeyDown);
    }

    closeModal.onclick = closeTheModal;

    function navigateToGalleryImage(direction) {
        if (orderedGalleryItems.length === 0) return;

        const newIndex = currentImageIndex + direction;

        // Prevent looping: check if the new index is out of bounds.
        if (newIndex < 0 || newIndex >= orderedGalleryItems.length) {
            return; // Do nothing if we are at the beginning or end.
        }

        // If the move is valid, update the index and proceed.
        currentImageIndex = newIndex;
        const newPath = orderedGalleryItems[newIndex].path;

        // Ensure we are in single-image view mode
        modalImg.style.display = 'block';
        modalSliderContent.style.display = 'none';
        modalPrev.style.display = 'none';
        modalNext.style.display = 'none';

        updateGalleryNavButtons();
        modalImg.src = newPath;
    }

    function updateGalleryNavButtons() {
        modalPrev.classList.toggle('hidden', currentImageIndex === 0);
        modalNext.classList.toggle('hidden', currentImageIndex === orderedGalleryItems.length - 1);
    }
    // --- EVENT LISTENERS ---

    galleryGrid.addEventListener('click', (e) => {
        const item = e.target.closest('.gallery-item');
        if (!item) return;

        modal.classList.add('visible');
        document.body.classList.add('modal-open');
        
        document.addEventListener('keydown', handleKeyDown);

        const clickedPath = item.dataset.src;
        currentImageIndex = orderedGalleryItems.findIndex(img => img.path === clickedPath);

        if (item.dataset.src) {
            modalImg.src = item.dataset.src;
            modalImg.style.display = 'block';
            modalSliderContent.style.display = 'none';
            modalPrev.style.display = 'none';
            modalNext.style.display = 'none';
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
});