# Redox Solver

A high-performance tool for solving, balancing, and analyzing redox reactions. The project provides both an interactive command line interface (CLI) and a beautiful, modern web-based interface for chemical modeling.

## Features

- **Automatic Balancing**: Efficiently balances redox reactions across neutral, acidic, and basic media.
- **Oxidation State Calculation**: Calculates oxidation states of elements within compounds dynamically.
- **Agents Identification**: Automatically identifies the oxidizing and reducing agents.
- **Half-Reaction Generation**: Computes balanced oxidation and reduction half-reactions.
- **Interactive Web App**: Modern client-side UI with presets, interactive tables, and smooth animations.
- **Zero Dependencies**: The Python tool runs entirely using Python standard libraries (no external packages required).

## Project Structure

```lua
├── redox_solver.py      # Main CLI application script
├── reaction.py          # Handles redox reaction logic
├── element.py           # Manages chemical elements and properties
├── utils.py             # Utility functions for parsing and validation
├── test_redox_solver.py # Unit tests for validating chemical logic
├── data.csv             # Dataset containing element names, electronegativities, and oxidation states
├── LICENSE              # Project license details (MIT)
├── web/                 # Web application files
│   ├── index.html       # Web app user interface
│   ├── style.css        # Custom CSS styling for visual aesthetics
│   └── redoxSolver.js   # Client-side JavaScript solver engine
└── README.md            # Project documentation
```

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/108er/RedoxSolver.git
   ```
2. **Navigate to the project directory**:
   ```bash
   cd RedoxSolver
   ```

No external dependencies are required for the Python backend or CLI! The web application runs fully client-side.

## Usage

### 1. Interactive Web Interface
To open the web application, simply open the [web/index.html](web/index.html) file directly in any modern web browser. Alternatively, you can serve it locally using Python:
```bash
python -m http.server 8000
```
Then navigate to `http://localhost:8000/web/` in your browser.

### 2. Command Line Interface (CLI)
Run the main script to start the interactive CLI:
```bash
python redox_solver.py
```

### 3. Programmatic Usage (Python)
You can import the `RedoxSolver` class to use the engine programmatically:
```python
from redox_solver import RedoxSolver

solver = RedoxSolver()
reaction = "MnO4- + Fe2+ -> Mn2+ + Fe3+"
balanced_reaction = solver.balance_reaction(reaction, medium="acidic")
print("Balanced Reaction:", balanced_reaction)
```

### 4. Running Unit Tests
To execute the test suite and verify parser correctness:
```bash
python -m unittest test_redox_solver.py
```

## Contribution

Contributions are welcome! If you'd like to improve the project, please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/YourFeature`).
3. Commit your changes (`git commit -m 'Add your feature'`).
4. Push to the branch (`git push origin feature/YourFeature`).
5. Create a pull request.

### Top contributors:

<a href="https://github.com/108er/RedoxSolver/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=108er/RedoxSolver" alt="contrib.rocks image" />
</a>

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

Feel free to report issues or request new features in the [Issues](https://github.com/108er/RedoxSolver/issues) section!
