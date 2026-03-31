# Highest-Grossing Films — DWAV Assignment

This project was created as part of the **Data Wrangling, Visualization, and Web Presentation** assignment.

## Project Objective

The goal of this project is to extract data from the Wikipedia page about the highest-grossing films, clean and structure the data, store it in a relational database, and present part of the dataset through an interactive web page hosted on GitHub Pages.

## Data Source

The main source of data is the Wikipedia page:

- List of highest-grossing films

## Project Structure

```text
highest-grossing-films/
│
├── data/
│   ├── films.db
│   └── films.json
│
├── notebook/
│   └── dwav_assignment.ipynb
│
├── docs/
│   ├── index.html
│   ├── style.css
│   ├── script.js
│   └── films.json
│
├── report/
│   └── report.md
│
├── README.md
└── requirements.txt
```

## Technologies Used

- Python
- Jupyter Notebook
- requests
- BeautifulSoup
- pandas
- SQLite
- HTML5
- CSS3
- JavaScript
- GitHub Pages

## Main Tasks Completed

- Parsed film-related data from Wikipedia
- Cleaned and structured the extracted data
- Stored the data in a relational database
- Exported the database content to JSON format
- Built a static interactive web page
- Deployed the page using GitHub Pages

## Database Schema

The project uses a relational database with a table called `films`.

Main fields:

- `id`
- `title`
- `release_year`
- `director`
- `box_office`
- `country`

## Web Page Features

The web page displays selected information from the dataset and includes interactive functionality such as:

- searching films by title
- sorting data
- filtering records
- dynamic rendering using JavaScript

## How to Run the Project Locally

### 1. Clone the repository

```bash
git clone <your-repository-link>
cd highest-grossing-films
```

### 2. Install dependencies

```bash
pip install -r requirements.txt
```

### 3. Open the Jupyter Notebook

```bash
jupyter notebook
```

Then open:

```text
notebook/dwav_assignment.ipynb
```

### 4. Open the web page

You can open `docs/index.html` in the browser, or use a local server.

Example with Python:

```bash
cd docs
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## Author

Student: `Elvina Belorusova`

## Notes

This project was developed for educational purposes as part of the DWAV assignment.
