// Function to show the preloader
function showPreloader() {
    // Selects the preloader element by ID
    const preloader = document.getElementById('preloader')
    // Sets the display style of the preloader to 'block' to make it visible
    preloader.style.display = 'block'
}

// Function to hide the preloader
function hidePreloader() {
    // Selects the preloader element by ID
    const preloader = document.getElementById('preloader')
    // Hides the preloader by setting its display to 'none'
    preloader.style.display = 'none'

    // Selects all content elements except for the preloader and backdrop
    const contentElements = document.querySelectorAll(
        'body > *:not(#preloader, #backdrop)'
    )

    // Iterates over each content element to make them visible
    contentElements.forEach((element) => {
        element.style.display = 'block' // Show all other body content
    })

    // Extracts the active page's name
    const activePage = extractActivePage()

    // Specific display logic for the contact page
    if (activePage === 'contact') {
        const contactView = document.getElementById('contact-view')
        if (contactView) {
            contactView.style.display = 'flex'
        }
    }

    // Special handling for error or 404 pages
    if (document.body.dataset.is404 || activePage === 'error') {
        const getBackBtnContainer = document.getElementById('btn-container')
        if (getBackBtnContainer) {
            getBackBtnContainer.style.display = 'flex'
            getBackBtnContainer.style.justifyContent = 'center'
        }
    } else {
        const getBackBtnContainer = document.getElementById('btn-container')
        if (getBackBtnContainer) {
            getBackBtnContainer.style.display = 'flex'
        }
    }
}

// Event listener for when the DOM content is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Extracts the active page's name
    const activePage = extractActivePage()
    // Retrieves stored data from local storage
    const storedData = getDataFromLocal(activePage)

    if (!storedData) {
        // If no data is found in local storage, show the preloader
        showPreloader()
        // Note: The 'hidePreloader' function will be called after fetching data
    } else {
        // If data exists in local storage, hide the preloader immediately
        hidePreloader()
    }
})

/* All JavaScript is validated with Esprima JS validator */
