![juur_ai](https://github.com/user-attachments/assets/683704f2-eda2-4a62-9194-2074c5f85fca)

## Table of Contents
- [About](#-about)
- [How to Use](#-how-to-use)
  - [Web application](#-web-application)
  - [Notebook](#-notebook)  

## About

**juur.ai** is a web application developed for the [Google - Gemini Long Context](https://www.kaggle.com/competitions/gemini-long-context) competition and the University of Tartu IDS 2024 course. The application leverages Gemini's high token capacity to efficiently analyze **390** laws.

## How to use

### Web application

To build the web application locally, follow these steps:

```shell
# Open a terminal (Command Prompt or PowerShell for Windows, Terminal for macOS or Linux)

# Ensure Git is installed
# Visit https://git-scm.com to download and install console Git if not already installed

# Clone the repository
git clone https://github.com/chirbard/gemini-long-context-competition.git

# Navigate to the web application directory
cd gemini-long-context-competition/nuxt-web-app

# Check if Node.js is installed
node -v  # Check the installed version of Node.js
# Visit https://nodejs.org/en/download/package-manager to install or update it if necessary

# Install packages
npm install

# Start the project
npm run dev

# Open web browser
http://localhost:3000/

```

### Notebook

To build the notebook in docker, follow these steps:
```shell
# Open a terminal (Command Prompt or PowerShell for Windows, Terminal for macOS or Linux)

# Ensure Git is installed
# Visit https://git-scm.com to download and install console Git if not already installed

# Clone the repository
git clone https://github.com/chirbard/gemini-long-context-competition.git

# Navigate to the notebook directory
cd gemini-long-context-competition/notebook

# Build and run container
docker compose up

# open notebook in browser
http://127.0.0.1:8888/lab?token=...
```


To build the notebook locally, follow these steps:

```shell
# Open a terminal (Command Prompt or PowerShell for Windows, Terminal for macOS or Linux)

# Ensure Git is installed
# Visit https://git-scm.com to download and install console Git if not already installed

# Clone the repository
git clone https://github.com/chirbard/gemini-long-context-competition.git

# Navigate to the notebook directory
cd gemini-long-context-competition/notebook

# Check if Jupyter Notebook is installed
jupyter notebook --version  # Check the installed version of Jupyter Notebook
# Visit https://jupyter.org/install to install or update it if necessary

# Start the Jupyter server
jupyter notebook

# Navigate to the correct directory
cd /volume

# Open the Notebook

juur-ai-simplify-law.ipynb
```
