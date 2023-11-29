document.addEventListener('DOMContentLoaded', () => {
    // Theme initialization
    // Getting the theme from localstorage or setting default to dark
    const currentTheme = localStorage.getItem('theme') || 'dark'
    document.documentElement.setAttribute('data-theme', currentTheme)
    // Getting access to the toggleswitch from the DOM
    const themeToggle = document.getElementById('theme-toggle')
    // Setting the toggle depending on the current theme
    themeToggle.checked = currentTheme === 'dark'

    // Updating the text above the toggleswithc depending on what theme is active
    updateThemeParagraphText(currentTheme)

    // Getting access to the Let's Talk modal elements from the DOM
    const letsTalkBtn = document.getElementById('lets-talk-btn')
    const overlayElement = document.getElementById('config-overlay')
    const backdropElement = document.getElementById('backdrop')
    const closeModalBtn = document.getElementById('close-modal')

    // Function to open modal
    function openModal() {
        // Showing the modal by setting the display to block
        if (overlayElement && backdropElement) {
            overlayElement.style.display = 'block'
            backdropElement.style.display = 'block'
        }
    }

    // Function to close modal
    function closeModal() {
        // Closing the modal by setting the display to none :)
        if (overlayElement && backdropElement) {
            overlayElement.style.display = 'none'
            backdropElement.style.display = 'none'
        }
    }

    // Bind event listeners if elements exist
    if (letsTalkBtn && closeModalBtn && backdropElement) {
        // Opening and closing the modal when the lets talk btn is clicked.
        letsTalkBtn.addEventListener('click', openModal)
        closeModalBtn.addEventListener('click', closeModal)
        // Closing the modal if the backdrop is clicked
        backdropElement.addEventListener('click', closeModal)
    }

    // 3. Portfolio image slider
    // Accessing the slider container from the DOM
    const slider = document.querySelector('.slider')
    // Checking if the slider exist to avoid errors
    if (slider) {
        // Selecting all the slides and container for nav dots
        const slides = slider.querySelectorAll('.slide')
        const dotsContainer = document.querySelector('.slider-dots')
        // Setting current slide to 0
        let currentSlide = 0

        // Function to navigate to a slide
        function goToSlide(slideIndex) {
            // Setting the current slide to slideindex to keep track of what slide is acitve
            currentSlide = slideIndex
            // Making the slides slide depending on what index is active
            slider.style.transform = `translateX(-${slideIndex * 100}%)`
            // Updating the dots to show what slide is active by adding the active class to the dot thats matches the current slide
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentSlide)
            })
        }

        // Create navigation dots for each slide
        slides.forEach((slide, index) => {
            const dot = document.createElement('div')
            dot.classList.add('dot')
            dot.addEventListener('click', () => {
                goToSlide(index)
            })
            if (dotsContainer) {
                dotsContainer.appendChild(dot)
            }
        })

        let dots
        // Looking for the dotsContainer
        // If it exists we use queryselectorall to get all the elements with the class .dot
        if (dotsContainer) {
            dots = dotsContainer.querySelectorAll('.dot')
        } else {
            // If it doesnt wxist we set dots to an empty array so the rest of the code works
            dots = []
        }
        // Navigating to the first slide
        goToSlide(currentSlide)
    }

    // Link arrow animation
    const portfolioLinks = document.getElementsByClassName('portfolio-link')
    // Looping though each portfolio item and adding eventlisteners to each item
    Array.from(portfolioLinks).forEach((portfolioLink) => {
        portfolioLink.addEventListener('mouseover', function () {
            const linkArrow = this.querySelector('.link-arrow')
            if (linkArrow) {
                // Making the arrow slide 3rem to the right when hovering over it
                linkArrow.style.marginLeft = '3rem'
            }
        })
        // Making it slide back when not hovering over the arrow
        portfolioLink.addEventListener('mouseleave', function () {
            const linkArrow = this.querySelector('.link-arrow')
            if (linkArrow) {
                linkArrow.style.marginLeft = '0.5rem'
            }
        })
    })
})

// 4. More theme code.
// Adding an eventlistener for the theme toggle
document
    .getElementById('theme-toggle')
    .addEventListener('change', function (e) {
        let theme
        // Check if the theme toggle is checked
        if (e.target.checked) {
            // Set theme to dark if the toggle is checked
            theme = 'dark'
        } else {
            // Set theme to light if the toggle is not checked
            theme = 'light'
        }

        // Set the theme attribute to the whole app (root element)
        document.documentElement.setAttribute('data-theme', theme)
        // Store the selected theme in local storage
        localStorage.setItem('theme', theme)
        // Update the theme-related text
        updateThemeParagraphText(theme)
    })

// Updating the label for the switch
function updateThemeParagraphText(theme) {
    const themeParagraph = document.getElementById('theme-p')
    if (theme === 'dark') {
        // Text for dark theme
        themeParagraph.textContent = 'Noctem'
    } else {
        // Text for light theme
        themeParagraph.textContent = 'Diem'
    }
}

/* All JavaScript is validated with Esprima JS validator */
