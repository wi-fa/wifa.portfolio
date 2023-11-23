// Description

// 2. Let's Talk modal
// 3. Portfolio image slider


document.addEventListener('DOMContentLoaded', function () {
    // 2. Let's Talk modal
    const letsTalkBtn = document.getElementById('lets-talk-btn');
    const overlayElement = document.getElementById('config-overlay');
    const backdropElement = document.getElementById('backdrop');
    const closeModalBtn = document.getElementById('close-modal');

    // Function to open modal
    function openModal() {
        if (overlayElement && backdropElement) {
            overlayElement.style.display = 'block';
            backdropElement.style.display = 'block';
        }
    }

    // Function to close modal
    function closeModal() {
        if (overlayElement && backdropElement) {
            overlayElement.style.display = 'none';
            backdropElement.style.display = 'none';
        }
    }

    // Bind event listeners if elements exist
    if (letsTalkBtn && closeModalBtn && backdropElement) {
        letsTalkBtn.addEventListener('click', openModal);
        closeModalBtn.addEventListener('click', closeModal);
        backdropElement.addEventListener('click', closeModal);
    }

    // 3. Portfolio image slider
    const slider = document.querySelector('.slider');
    if (slider) {
        const slides = slider.querySelectorAll('.slide');
        const dotsContainer = document.querySelector('.slider-dots');
        let currentSlide = 0;

        // Function to navigate to a slide
        function goToSlide(slideIndex) {
            if (slideIndex < 0 || slideIndex >= slides.length) return;
            currentSlide = slideIndex;
            slider.style.transform = `translateX(-${slideIndex * 100}%)`;
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentSlide);
            });
        }

        // Create navigation dots for each slide
        slides.forEach((slide, index) => {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            dot.addEventListener('click', () => {
                goToSlide(index);
            });
            if (dotsContainer) {
                dotsContainer.appendChild(dot);
            }
        });

        const dots = dotsContainer ? dotsContainer.querySelectorAll('.dot') : [];
        goToSlide(currentSlide); // Initial slide
    }

    // Link arrow animation
    const portfolioLinks = document.getElementsByClassName('portfolio-link');
    Array.from(portfolioLinks).forEach(portfolioLink => {
        portfolioLink.addEventListener('mouseover', function() {
            const linkArrow = this.querySelector('.link-arrow');
            if (linkArrow) {
                linkArrow.style.marginLeft = '3rem';
            }
        });
        portfolioLink.addEventListener('mouseleave', function() {
            const linkArrow = this.querySelector('.link-arrow');
            if (linkArrow) {
                linkArrow.style.marginLeft = '0.5rem';
            }
        });
    });
});
