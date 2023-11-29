// Adding a global variable to store the data
let pageData

// Get the active page from the url
function extractActivePage() {
    // First we take the current path from window location
    const url = window.location.pathname

    // Extract the page name or default to 'home' if it's the root path
    const activePage = url.replace('/', '') || 'home'

    // Return the active page
    return activePage
}

// Function to fetch page data from the mongodb collections
function fetchPagesData() {
    // Check the active pages name
    const activePage = extractActivePage()
    //Then using axios to make a get request
    axios
        .get('/fetch-data')
        .then((response) => {
            // Then storing the response data in my global variable
            pageData = response.data

            // Calling functions to fill my html elements
            storeDataLocal(pageData)
            populateNavbar(pageData)
            updateHeroSection(pageData, extractActivePage())

            // Adding specific content depending on the active page
            if (activePage === 'about') {
                populateAboutSection(pageData)
            }
            if (activePage === 'contact') {
                populateContactSection(pageData)
            }
            if (activePage === 'home') {
                populateCards(pageData)
            }

            // After everything is fetched and populated + 2 sec, im hiding the preloader
            setTimeout(hidePreloader, 2000)

            // Returning the fetched data
            return pageData
        })
        .catch((error) => {
            // Log errors to the console
            console.error('Error fetching: ', error)
            setTimeout(hidePreloader, 2000)
        })
}

// Function to store data in the local storage
function storeDataLocal(data) {
    try {
        // Here i convert the data to a JSON string and store in localstorage
        localStorage.setItem(`pageData_all`, JSON.stringify(data))
    } catch (error) {
        // Logging errors to the console
        console.error('Error storing data in localStorage: ', error)
    }
}

// Function to get the data from the local storage
function getDataFromLocal() {
    try {
        // Get the data from local storage
        const storedData = localStorage.getItem(`pageData_all`)
        // If data exist we parse it then return it, else we return null
        return storedData ? JSON.parse(storedData) : null
    } catch (error) {
        // Log errors to the console and return null
        console.error('Error collecting data from localStorage: ', error)
        return null
    }
}

// Function to fill the navbar
function populateNavbar(pagesData) {
    // Order of navigation items
    const order = ['home', 'about', 'contact', 'portfolio']

    // Collection pages thats shouldnt be in the navbar
    const excludePages = ['thanks', 'error', '404']

    // Selecting the navigation element
    const navList = document.querySelector('.navigation')

    // Create a map of pages for quicker access
    const pageMap = {}
    pagesData.forEach((page) => {
        pageMap[page.link.url] = page
    })

    // Looping the order array creating the navbar with the items that i want and not the ones i dont want

    // I had to do this since the order of item in my db changed when dumped from the local db to atlas.
    order.forEach((pageName) => {
        const page = pageMap[pageName]
        if (page && !excludePages.includes(pageName)) {
            // Creating the elements for the pages that i want
            const li = document.createElement('li')
            const a = document.createElement('a')

            // Setting the href and text to the elements
            a.href = page.link.url
            a.textContent = page.link.text

            // Appending them to the DOM
            li.appendChild(a)
            navList.appendChild(li)
        }
    })
}

// Function to update the hero section of the active page
function updateHeroSection(data, activePage) {
    //Debugging code for the hero
    console.log('Updating hero section for page:', activePage)

    // Selecting the hero elements
    const heroTitle = document.getElementById('hero-title')
    const heroParagraph = document.getElementById('hero-paragraph')

    // Then finding the data for the active page
    let activePageData = data.find((page) => page.link.url === activePage)

    // If the data for the active page is found we update the hero section
    if (activePageData) {
        // Creating the element for the pageSymbol in the header
        const pageSymbol = activePageData.pageSymbol
        const titleContent = document.createElement('span')
        titleContent.textContent = activePageData.header

        // Setting the right style for the pageSymbol
        const brandColorSpan = document.createElement('span')
        brandColorSpan.className = 'brand-color'
        brandColorSpan.textContent = pageSymbol

        // Appending the element to the DOM
        titleContent.appendChild(brandColorSpan)

        // Setting the hero and appending it to the DOM
        heroTitle.innerHTML = ''
        heroTitle.appendChild(titleContent)

        // Changing the text in header
        heroParagraph.textContent = activePageData.headerParagraph
    }
}

// Function to fill cards on the page
function populateCards(data) {
    // Access cards data from the first page content
    // since its only on the homepage
    let cardsData = data[0].pageContent[0].content

    // Extracting keys of the data
    const cardKeys = Object.keys(cardsData)
    console.log(cardKeys)

    // Looping through each card key and updating the card elements
    cardKeys.forEach((key, index) => {
        const card = cardsData[key]
        // So index 0 becomes 1
        const cardIndex = index + 1

        // Selecting the cards h2's
        let cardTitles = document.getElementById(`card-${cardIndex}-h2`)

        // Selecting the cards paragraphs
        let cardParagraphs = document.getElementById(`card-${cardIndex}-p`)

        // Setting the right textcontent from db
        if (cardTitles) cardTitles.textContent = card.cardTitle
        // Making the paragraphs uppercase
        if (cardParagraphs)
            cardParagraphs.textContent = card.cardParagraph.toUpperCase()

        // Skill card has a diffrent strucutre so i
        // had to handle this card diffrent
        // If skill-card
        if (key === 'skills') {
            for (let i = 1; i <= 4; i++) {
                // Selecting the imgs/icons in the skill-card
                const imgElement = document.getElementById(`skill-img${i}`)
                if (imgElement) {
                    // Setting the right src and alt
                    imgElement.src = card[`cardIcon${i}`]
                    imgElement.alt = card[`cardIconAlt${i}`]
                }
            }
        } else {
            // Handling the images for the home, contact, and portfolio cards
            const cardImg = document.getElementById(`card-${cardIndex}-img`)
            if (cardImg) {
                cardImg.src = card.cardImg
                cardImg.alt = card.cardImgAlt // Assuming you have alt text for images
            }
        }

        // Updating the link for each card
        const cardLink = document.querySelector(`#card-${cardIndex} a`)
        if (cardLink) cardLink.href = card.cardHrf
    })
}

// Function to fill the about section
function populateAboutSection(data) {
    // Taking the data from the the about page in the db
    const aboutData = data[4].pageContent[0].content

    // Selecting all the elements for the about section
    const aboutHeader = document.getElementById('about-header')
    const aboutParagraph = document.getElementById('about-text')
    const aboutPhoto = document.getElementById('about-photo')
    const skillsHeader = document
        .getElementById('skills-and-experince')
        .querySelector('h2')
    const skillsText = document
        .getElementById('skills-and-experince')
        .querySelector('p')
    const skillIcons = document.querySelectorAll('#about-me-skills img')

    // If the data is found the header, img and p elements is updated
    if (aboutData) {
        aboutHeader.textContent = aboutData.h3
        aboutParagraph.textContent = aboutData.longParagraph
        aboutPhoto.src = aboutData.img
        skillsHeader.textContent = aboutData.h2
        skillsText.textContent = aboutData.paragraph

        // If a skill list is found in the db
        if (aboutData.list) {
            //Then we loop through and updating the images in the list
            aboutData.list.forEach((skill, index) => {
                if (index < skillIcons.length) {
                    skillIcons[index].src = skill.img
                    skillIcons[index].alt = skill.alt
                }
            })
        }
    }
    // Debugging code for the memoji
    if (!aboutPhoto) {
        console.error('aboutPhoto element not found!')
        return
    }
}

// Function to fill the contact section
function populateContactSection(data) {
    // Getting the data from my db
    const contactData = data[5].pageContent[0].content

    // Updating the form title
    const formTitle = document.getElementById('form-title')
    formTitle.textContent = contactData.formTitle

    // Updating input fields
    const formInputs = contactData.inputs
    // Looping though every contactData input
    formInputs.forEach((inputData) => {
        // Selecting all input elements
        const inputElement = document.querySelector(
            `input[name="${inputData.name}"]`
        )
        // If the elemets exist we update the elements
        if (inputElement) {
            inputElement.type = inputData.type
            inputElement.placeholder = inputData.placeholder
            inputElement.required = inputData.required
        }
    })

    // Selecting the submit btn and adding text to it
    const formBtn = document.getElementById('form-btn-element')
    formBtn.textContent = contactData.submitButton.text

    // Selecting the text above/aside the form and updating the text
    const contactTextHeader = document.getElementById('contact-text-header')
    const contactTextParagraph = document.getElementById(
        'contact-text-paragraph'
    )
    contactTextHeader.textContent = contactData.contactHeader
    contactTextParagraph.textContent = contactData.contactParagraph
}

// Function to handle form submission
function handleSubmit(event) {
    event.preventDefault()

    // Get form data
    const formData = new FormData(event.target)

    // Convert formData to an object
    const formObject = {}
    formData.forEach((value, key) => {
        formObject[key] = value
    })

    // Send form data to the server using Axios
    axios
        .post('/contact', formObject)
        .then((response) => {
            // Handle a successful response from the server, e.g., show a success message
            console.log('Form submitted successfully')
            // You can also redirect the user to a thank you page if needed
            window.location.href = '/thanks'
        })
        .catch((error) => {
            // Handle an error response from the server, e.g., show an error message
            console.error('Form submission error:', error)
        })
}

// Event listener for DOMContentLoaded event
document.addEventListener('DOMContentLoaded', () => {
    // Extract active page and check local storage for data
    const activePage = extractActivePage()
    let storedData = getDataFromLocal()

    console.log('Stored data:', storedData)

    // Populate the page with stored data or fetch new data
    if (storedData) {
        console.log('from storage')
        populateNavbar(storedData)
        updateHeroSection(storedData, activePage)
    } else {
        console.log('from fetch..')
        fetchPagesData()
    }

    // Populate specific sections based on the active page
    if (activePage === 'home') {
        populateCards(storedData)
    }
    if (activePage === 'about') {
        populateAboutSection(storedData)
    }
    if (activePage === 'contact') {
        populateContactSection(storedData)
    }
})

/* All JavaScript is validated with Esprima JS validator */
