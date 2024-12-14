const chalk = require('chalk');
const crypto = require('crypto');
const yargs = require('yargs');

// Generate random hex color
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
const randomColor = getRandomColor();

// Set up command-line options
const argv = yargs
    .option('bin', {
        alias: 'b',
        description: 'BIN to use for card generation',
        type: 'string',
        demandOption: true, // BIN is required
        validate: (bin) => {
            // Ensure the BIN is a 4-digit numeric string
            if (!/^\d{4}$/.test(bin)) {
                throw new Error('BIN must be a numeric string, containing exactly 4 digits.');
            }
        }
    })
    .option('silent', {
        alias: 's',
        description: 'Disable displaying invalid (BAD) cards',
        type: 'boolean',
        default: false, // By default, both GOOD and BAD cards are displayed
    })
    .argv;

// Function to generate a random card number
function generateCardNumber(bin) {
    let cardNumber = bin;

    // Generate random numbers for the remaining digits
    for (let i = 0; i < 16 - bin.length - 1; i++) {
        cardNumber += Math.floor(Math.random() * 10);
    }

    // Calculate the checksum (Luhn Algorithm)
    const checksum = calculateLuhnChecksum(cardNumber);
    return cardNumber + checksum;
}

// Luhn Algorithm for validating card numbers
function calculateLuhnChecksum(cardNumber) {
    let sum = 0;
    let shouldDouble = false;

    for (let i = cardNumber.length - 1; i >= 0; i--) {
        let digit = parseInt(cardNumber[i], 10);

        if (shouldDouble) {
            digit *= 2;
            if (digit > 9) digit -= 9;
        }

        sum += digit;
        shouldDouble = !shouldDouble;
    }

    return (10 - (sum % 10)) % 10;
}

// Function to generate a random expiry date
function generateExpiryDate() {
    const currentYear = new Date().getFullYear();
    const year = Math.floor(Math.random() * 5) + currentYear; // Up to 5 years in the future
    const month = Math.floor(Math.random() * 12) + 1;
    return `${month.toString().padStart(2, '0')}/${year.toString().slice(-2)}`;
}

// Function to generate a random CVV
function generateCVV() {
    return Math.floor(100 + Math.random() * 900).toString(); // 3 digits
}

// Function to validate card details
function validateCardDetails(card) {
    const { cardNumber, expiryDate, cvv } = card;

    // Check Luhn algorithm
    if (!isValidLuhn(cardNumber)) {
        return { valid: false, message: "Card number is invalid (Luhn)." };
    }

    // Check expiry date format (MM/YY)
    const expiryMatch = expiryDate.match(/^(0[1-9]|1[0-2])\/\d{2}$/);
    if (!expiryMatch) {
        return { valid: false, message: "Expiry date is in the wrong format." };
    }

    // Check if the expiry date is not in the past
    const [month, year] = expiryDate.split('/');
    const currentDate = new Date();
    const cardExpiry = new Date(`20${year}`, parseInt(month) - 1);
    if (cardExpiry < currentDate) {
        return { valid: false, message: "Card has expired." };
    }

    // Check CVV format (should be 3 digits)
    if (!/^\d{3}$/.test(cvv)) {
        return { valid: false, message: "CVV is invalid." };
    }

    return { valid: true, message: "Card valid for testing." };
}

// Luhn Algorithm for validating card numbers
function isValidLuhn(cardNumber) {
    let sum = 0;
    let shouldDouble = false;

    for (let i = cardNumber.length - 1; i >= 0; i--) {
        let digit = parseInt(cardNumber[i], 10);

        if (shouldDouble) {
            digit *= 2;
            if (digit > 9) digit -= 9;
        }

        sum += digit;
        shouldDouble = !shouldDouble;
    }

    return sum % 10 === 0;
}

// Generate a card using the BIN provided by the user
const bin = argv.bin;

// Function to generate and validate a card
function generateAndValidateCard() {
    const simulatedCard = {
        cardNumber: generateCardNumber(bin),
        expiryDate: generateExpiryDate(),
        cvv: generateCVV(),
    };

    const validationResult = validateCardDetails(simulatedCard);

    // If in silent mode and the card is invalid, don't display anything
    if (argv.silent && !validationResult.valid) {
        return; // If it's invalid and we're in silent mode, do nothing
    }

    // Select the color for display
    const resultColor = validationResult.valid ? chalk.green : chalk.red;

    // Display the generated card and validation result
    console.log(resultColor(`[${validationResult.valid ? 'GOOD' : 'BAD'}] CARD: ${simulatedCard.cardNumber} | EXP ${simulatedCard.expiryDate} | CVV ${simulatedCard.cvv}`));
}

// Display the banner only once
console.clear();
console.log(chalk.hex(randomColor).bold(`
████████████████████████████████████████████████████████
██                                                    ██
██  █████████████████████████████████████████████████ ██
██  █████████████████████████████████████████████████ ██
██                                                    ██
██                                                    ██
██                                                    ██
██   Card Number: XXXX XXXX XXXX XXXX                 ██
██   Expiry Date: XX/XX                               ██
██   Card Holder: OXIJENUUU                           ██
██                                                    ██
████████████████████████████████████████████████████████
`));

// Generate and validate cards every 2 seconds
const interval = setInterval(generateAndValidateCard, 2000);

// Stop the generator after a period of time or manually (ctrl+c)
process.on('SIGINT', () => {
    clearInterval(interval);
    console.log(chalk.hex(randomColor)("\nCard generator has been stopped."));
    process.exit();
});
