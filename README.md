# Card Generator (Educational Tool)

This is a simple card generator tool that simulates generating and validating credit card details, including the card number, expiry date, and CVV. The tool also validates the generated cards using the Luhn algorithm.

### Features:
- **BIN-based card generation**: You can provide a **BIN** (Bank Identification Number), and the tool will generate a card number based on it.
- **Expiry Date**: Generates a random expiry date valid for the next 5 years.
- **CVV**: Generates a random 3-digit CVV.
- **Card Validation**: The tool validates the generated card using the Luhn algorithm.
- **Silent Mode**: Option to suppress invalid card logs and only display valid cards.

### Requirements:
- **BIN**: You must provide a BIN that is exactly 4 digits long.
- **Silent Mode**: Use this option to hide invalid cards and only display valid ones.

---

### Installation:

1. Clone the repository:
   ```bash
   git clone https://github.com/OxiJenuuu/alexCC.git
   ```

2. Install the dependencies:
   ```bash
   cd alexCC
   npm install
   ```

---

### Usage Tutorial:

Here’s an example command to generate a card based on a 4-digit BIN and validate the cards.

#### 1. **Generate a card using a 4-digit BIN**:

Make sure the BIN is a valid 4-digit number. You can provide it using the `-b` or `--bin` option.

Example command:
```bash
node index.js -b 1234
```
This will generate a card number based on the BIN `1234`, a random CVV, and a random expiry date. The card will then be validated.

#### 2. **Silent Mode**:

If you want to only display valid cards and suppress invalid ones, use the `-s` or `--silent` option.

Example command:
```bash
node index.js -b 1234 -s
```
This will generate and validate the cards, but will only display valid ones, hiding the invalid ones.

#### 3. **Error Messages**:

If you try to provide a BIN that is not exactly 4 digits, the program will throw an error like this:
```bash
Error: BIN must be a numeric string, containing exactly 4 digits.
```

### Example Commands:

- **Generate card with a valid BIN**:
  ```bash
  node index.js -b 1234
  ```

- **Generate card with a valid BIN and silent mode**:
  ```bash
  node index.js -b 1234 -s
  ```

---

### What You Need to Know:
- The BIN must be exactly **4 digits** long and numeric.
- The card validation is performed using the Luhn algorithm to check the validity of the card number.
- The expiry date will be random but valid for the next 5 years.
