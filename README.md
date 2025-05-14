# 🌳 TreeJack: Interactive Decision Tree Visualizer

![TreeJack Logo](https://example.com/logo.png)

Welcome to **TreeJack**, a web-based interactive tool designed for visualizing, simulating, and debugging decision trees. This tool aims to help developers and product owners understand logic flows, identify unreachable paths, and test various input scenarios through a clean, minimalistic interface.

[![Latest Release](https://img.shields.io/github/release/eclipsence/TreeJack.svg)](https://github.com/eclipsence/TreeJack/releases)

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Features

- **Interactive Visualization**: Easily visualize decision trees with an intuitive interface.
- **Simulation**: Test various input scenarios to see how your decision tree behaves.
- **Debugging**: Identify unreachable paths and logic errors quickly.
- **Clean UI**: A minimalistic design that focuses on usability.
- **Fullstack Application**: Built with React for the frontend and FastAPI for the backend.
- **JSON Editor**: Modify your decision tree structures directly in JSON format.
- **Flowchart Representation**: Visualize complex decision-making processes in a straightforward manner.

## Technologies Used

TreeJack leverages several powerful technologies to deliver a smooth user experience:

- **Frontend**: React for building user interfaces.
- **Backend**: FastAPI for fast and efficient server-side operations.
- **Visualization**: D3.js for creating dynamic, interactive data visualizations.
- **Data Management**: JSON for tree structure representation.
- **System Design**: Structured to handle various user inputs and scenarios.

## Installation

To get started with TreeJack, follow these steps:

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/eclipsence/TreeJack.git
   ```

2. **Navigate to the Directory**:
   ```bash
   cd TreeJack
   ```

3. **Install Dependencies**:
   For the frontend:
   ```bash
   cd frontend
   npm install
   ```

   For the backend:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

4. **Run the Application**:
   Start the backend server:
   ```bash
   uvicorn main:app --reload
   ```

   Start the frontend application:
   ```bash
   npm start
   ```

Your application should now be running on `http://localhost:3000`.

## Usage

Once you have the application running, you can access the TreeJack interface through your web browser. Here’s how to make the most of it:

1. **Load a Decision Tree**: Use the JSON editor to load an existing decision tree or create a new one.
2. **Visualize**: The decision tree will be displayed graphically. Click on nodes to explore paths.
3. **Simulate Inputs**: Enter different input scenarios to see how the decision tree responds.
4. **Debugging**: Identify any unreachable paths and correct them as needed.

For the latest releases, visit [Releases](https://github.com/eclipsence/TreeJack/releases).

## Contributing

We welcome contributions to TreeJack! If you would like to contribute, please follow these steps:

1. **Fork the Repository**: Click the "Fork" button on the top right corner of the page.
2. **Create a Branch**: Create a new branch for your feature or bug fix.
   ```bash
   git checkout -b feature/YourFeature
   ```
3. **Make Changes**: Implement your changes and test them thoroughly.
4. **Commit Your Changes**:
   ```bash
   git commit -m "Add Your Feature"
   ```
5. **Push to Your Fork**:
   ```bash
   git push origin feature/YourFeature
   ```
6. **Create a Pull Request**: Go to the original repository and click on "New Pull Request".

We appreciate your help in improving TreeJack!

## License

TreeJack is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.

## Contact

For questions or feedback, please reach out to the maintainers:

- **Maintainer Name**: [Your Name](https://github.com/yourprofile)
- **Email**: your.email@example.com

Thank you for your interest in TreeJack! We hope you find it useful for your decision tree visualization and debugging needs. If you encounter any issues, please check the [Releases](https://github.com/eclipsence/TreeJack/releases) section for updates and fixes.

---

![Tree Visualization](https://example.com/tree-visualization.png)

### Additional Resources

- [D3.js Documentation](https://d3js.org/)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://reactjs.org/)

Feel free to explore and experiment with TreeJack. Happy coding!