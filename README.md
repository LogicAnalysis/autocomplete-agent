# Autocomplete Agent 🤖

An AI agent designed to automate form filling using generative AI.

## 🚀 Getting Started

Follow these steps to configure, build, and run the agent.

### 1. Configure Environment Variables
You need to set up your Google API key.

1.  **Get your API Key:** Obtain a key from Google AI Studio: [https://aistudio.google.com/apikey](https://aistudio.google.com/apikey)

2.  **Create the `.env` file:** In the base directory of the project, duplicate `example.env` and rename it to `.env`.

3.  **Add your Key:** Open your new `.env` file and paste your API key:

### 2. Configure Form Data
Define the data that the agent will use to autofill forms.

1.  **Create the data file:** Navigate to the `data/` folder.
2.  **Match the template:** Create a new file named `forms.json` using `data/example.forms.json` as your template.
3.  **Input your data:** Fill `forms.json` with the specific information you want the agent to use.

---

## 🛠️ Usage

### Build the Agent
Run the following command to build the project:

```bash
make build
```

### Start the container
Run the following command to start the container:

```bash
make up
```

### Supervise the agent
Once the build is complete, go to this URL to supervise the agent:
http://localhost:6080/

### Run the agent
With the browser view open, execute the run command in your terminal to have the agent start filling out forms:
```bash
make run
```