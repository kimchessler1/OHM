import time
import json
import xml.etree.ElementTree as ET
import re
from octoai.text_gen import ChatMessage
from octoai.client import OctoAI

QUESTIONS_JSON_REGEX = ".*{(?s:.)*}"
MAX_TOKENS = 1024 # max tokens in the output

# define the role to pass to the LLM
ROLE = "You are an Instructional Designer who specializes in authoring questions that assess learning outcomes. You care deeply about using inclusive language that is equitable and represents diverse perspectives"

# the set of models being tested
MODELS = [
    "meta-llama-3.1-8b-instruct",
    #"meta-llama-3.1-70b-instruct"
]

# structure for prompting, with learning outcome to-be-replaced
PROMPT_STRUCTURE = '''Execute the <question-generator> task with the following input values:
    1. LEARNING_OUTCOME={}
    2. NUM_OPTIONS=4
    3. NUM_QUESTIONS=1'''

# the task description, excluding input values, to pass in
tree = ET.parse('./inputs/task.xml')
root = tree.getroot()
# convert the XML into string format, for the API
xmlstr = ET.tostring(root, encoding='utf8', method='xml') 
TASK = xmlstr.decode(encoding='utf8')

# the learning outcome and content inputs
input_file = open('./inputs/input_test_cases.json', 'r')
inputs = json.load(input_file)

def request_questions(model, prompt):
    client = OctoAI()
    response = client.text_gen.create_chat_completion(
        max_tokens=MAX_TOKENS,
        messages=[
            ChatMessage(
                content=ROLE,
                role="system"
            ),
            ChatMessage(
                content=TASK,
                role="user"
            ),
            ChatMessage(
                content=prompt,
                role="user"
            )
        ],
        model=model,
        presence_penalty=0,
        temperature=0,
        top_p=1
    )

    print(json.dumps(response.dict(), indent=2))

    return response

def convert_response_string_to_questions_dictionary(content):
    print("Using RE to find questions JSON in the following text: " + content)
    matches = re.findall(QUESTIONS_JSON_REGEX, content) # match the content to the questions regular expression
    print("matches: " + str(matches))
    questions_json_str = matches[0] # the JSON should be the first and only match group
    return json.loads(questions_json_str), # convert stringified JSON to an object (dictionary) in Python

# generate the JSON to represent a response and the unique combination of identifiers for it
def response_json(content, model, learning_outcome, included_content_in_prompt):
    return {
        "content": convert_response_string_to_questions_dictionary(content),
        "model": model,
        "learning_outcome": learning_outcome,
        "included_content_in_prompt": included_content_in_prompt
    }

# build the prompt given the set of inputs and whether to include content 
def build_prompt(input_test_case, include_textbook_content):
    prompt = PROMPT_STRUCTURE.format(input_test_case["LEARNING_OUTCOME"])
    if include_textbook_content == True:
        prompt = prompt + "\n\t4. CONTENT={}".format(input_test_case["CONTENT"])
    return prompt

def summarize_results(responses):
    input_tokens_with_content = []
    output_tokens_with_content = []
    input_tokens_without_content = []
    output_tokens_without_content = []
    
    for response in responses:
        if response["included_content_in_prompt"] == True:
            input_tokens_with_content.append(response["response"].usage.prompt_tokens)
            output_tokens_with_content.append(response["response"].usage.completion_tokens)
        else:
            input_tokens_without_content.append(response["response"].usage.prompt_tokens)
            output_tokens_without_content.append(response["response"].usage.completion_tokens)

    def average(arr):
        return sum(arr) / len(arr)

    return {
        "input_tokens_per_request_with_content": average(input_tokens_with_content),
        "output_tokens_per_request_with_content": average(output_tokens_with_content),
        "input_tokens_per_request_without_content": average(input_tokens_without_content),
        "output_tokens_per_request_without_content": average(output_tokens_without_content),
    }

def run():
    # Use the same tests on each model
    #
    # In total: num_models * num_test_cases * 2
    for model in MODELS:
        model_json_output = [] # store the output grouped by model
        model_responses = []

        # each test case is tested across the True/False inclusion of Content in the prompt
        for input_test_case in inputs:
            for include_textbook_content in [ True, False ]:
                prompt = build_prompt(input_test_case, include_textbook_content)
                response = request_questions(model, prompt)
                print(response)
                # store each response and throttle the request
                model_json_output.append(response_json(response.choices[0].message.content, model, input_test_case["LEARNING_OUTCOME"], include_textbook_content))
                model_responses.append({"response": response, "included_content_in_prompt": include_textbook_content})
                time.sleep(0.25)

        # store the array of outputs with the model in the file name
        model_json_output_file_str = "./outputs/{}_output.json".format(model)
        with open(model_json_output_file_str, 'w') as model_json_output_file:
            json.dump({
                "raw_outputs": model_json_output,
                "summary": summarize_results(model_responses)
            },model_json_output_file)
        return

run()
input_file.close()