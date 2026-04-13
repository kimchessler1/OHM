# AI Testing

A repo for AI Testing at Lumen Learning

## Question Authoring

A preliminary test to compare the quality of output and the input & output tokens per model across 5 learning outcomes. Includes testing prompts both with and without the textbook content.

### Anthropic Tests

- Anthropic API Docs: https://docs.anthropic.com/en/docs/welcome
- Anthropic Python SDK: https://github.com/anthropics/anthropic-sdk-python
- API Keys: https://console.anthropic.com/settings/keys

**Running the Script**

Ensure your system has [Python v3.7](https://www.python.org/downloads/) or higher installed before setting up:

1. Create a python virtual environment: `python -m venv claude-env`

2. Start the virtual env:
   - macOS or Linux: `source claude-env/bin/activate`
   - Windows: `claude-env\Scripts\activate`

3. Install the Anthropic SDK: `pip install anthropic`

4. Configure the API key in the environment: `export ANTHROPIC_API_KEY='your-api-key-here'`

5. Run the script: `python3 anthropic-tests.py`

### Gemini Tests

- Gemini API Docs: https://ai.google.dev/gemini-api/docs
- Gemini Python SDK: https://ai.google.dev/gemini-api/docs/quickstart?lang=python#install-sdk
- API Keys: https://ai.google.dev/gemini-api/docs/api-key

**Running the Script**

Ensure your system has Python v3.9 or higher installed before setting up:
1. Install the Gemini Python SDK: `pip install -q -U google-generativeai
`
2. This code runs in a Jupyter Notebook. I recommend copying the code into one.
3. Set up your API key. The current version of the code allows you to simply store it in a variable in the script.
