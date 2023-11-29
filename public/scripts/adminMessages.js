// Event listener for when the DOM content is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Selects all elements with the class 'message-card'
    const messageCards = document.querySelectorAll('.message-card')

    // Iterates over each message card
    messageCards.forEach((card) => {
        // Adds a click event listener to the message-summary elements inside the card
        card.querySelector('.message-summary').addEventListener('click', () => {
            // Selecting the elements
            const details = card.querySelector('.message-details')

            // Toggle the 'expanded' class on the details element
            details.classList.toggle('expanded')
        })
    })
})

/* All JavaScript is validated with Esprima JS validator */
