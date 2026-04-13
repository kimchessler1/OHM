import google.generativeai as genai
import json
import re
import time

QUESTIONS_JSON_REGEX = ".*{(?s:.)*}"

ROLE = "You are an Instructional Designer who specializes in authoring questions that assess learning outcomes. You care deeply about using inclusive language that is equitable and represents diverse perspectives."

PROMPT_STRUCTURE = '''Execute the <question-generator> task with the following input values:
    1. LEARNING_OUTCOME={}
    2. NUM_OPTIONS=4
    3. NUM_QUESTIONS=1
'''

SYSTEM_INSTRUCTION = '''You are an Instructional Designer who specializes in authoring questions that assess learning outcomes. You care deeply about using inclusive language that is equitable and represents diverse perspectives.
      You are generating multiple-choice questions for students. 
      The number of questions you generate is specified in the NUM_QUESTIONS input
      The questions must assess the learning outcome provided in the LEARNING_OUTCOME input. The questions should be informed by the CONTENT input, if it is provided. 
      The prompt for the first question will be the PROMPT input, if provided. And otherwise, you will write a prompt that assesses a students understanding of the learning outcome from the LEARNING_OUTCOME input.
      When generating a prompt, a sentence to lead into the question can be included and must use a equitable human name.
      The questions will have as many answer options as the NUM_OPTIONS input. One option must be the correct answer to the prompt
      The output will follow the JSON format defined next.
      The JSON format should look like this: "questions": [{"prompt": "", "options": [], "correct_answer": 0}]
      questions is an array of question objects
      prompt is a string representing the question
      options is an array containing the possible answers as strings
      correct_answer is the index (0-based) of the correct answer in the options array
'''
MODELS = [
    "gemini-1.5-flash",
    "gemini-1.5-pro"
]

# The learning outcome and content inputs
input_file = open('./inputs/input_test_cases.json', 'r')
inputs = json.load(input_file)

api_key=''
genai.configure(api_key=api_key)

def convert_response_string_to_questions_dictionary(content):
    print("Using RE to find questions JSON in the following text: " + content)
    matches = re.findall(QUESTIONS_JSON_REGEX, content)  # match the content to the questions regular expression
    questions_json_str = matches[0]  # the JSON should be the first and only match group
    return json.loads(questions_json_str),  # convert stringified JSON to an object (dictionary) in Python


# generate the JSON to represent a response and the unique combination of identifiers for it
def response_json(content, model, learning_outcome, included_content_in_prompt):
    return {
        "content": convert_response_string_to_questions_dictionary(content),
        "model": model,
        "learning_outcome": learning_outcome,
        "included_content_in_prompt": included_content_in_prompt
    }


def build_prompt(input_test_case, include_textbook_content):
    prompt = PROMPT_STRUCTURE.format(input_test_case["LEARNING_OUTCOME"])
    if include_textbook_content:
        prompt = prompt + "\n\t4. CONTENT={}".format(input_test_case["CONTENT"])
    return prompt


def request_question(model_name, prompt):
    model = genai.GenerativeModel(model_name=model_name, system_instruction=SYSTEM_INSTRUCTION)
    response = model.generate_content(prompt)
    return response


def summarize_results(responses):
    input_tokens_with_content = []
    output_tokens_with_content = []
    input_tokens_without_content = []
    output_tokens_without_content = []

    for response in responses:
        if response["included_content_in_prompt"] == True:
            input_tokens_with_content.append(response["response"].usage_metadata.prompt_token_count)
            output_tokens_with_content.append(response["response"].usage_metadata.candidates_token_count)
        else:
            input_tokens_without_content.append(response["response"].usage_metadata.prompt_token_count)
            output_tokens_without_content.append(response["response"].usage_metadata.candidates_token_count)

    def average(arr):
        return sum(arr) / len(arr)

    return {
        "input_tokens_per_request_with_content": average(input_tokens_with_content),
        "output_tokens_per_request_with_content": average(output_tokens_with_content),
        "input_tokens_per_request_without_content": average(input_tokens_without_content),
        "output_tokens_per_request_without_content": average(output_tokens_without_content),
    }


def run():
    json_output = []
    model_responses = []
    for model_name in MODELS:
        for input_test_case in inputs:
            for include_textbook_content in [True, False]:
                prompt = build_prompt(input_test_case, include_textbook_content)
                response = request_question(model_name, prompt)

                json_output.append(response_json(response.text, model_name, input_test_case["LEARNING_OUTCOME"],
                                                 include_textbook_content))
                model_responses.append({"response": response, "included_content_in_prompt": include_textbook_content})
                time.sleep(5.0)
        model_json_output_file_str = "./outputs/{}_output.json".format(model_name)
        with open(model_json_output_file_str, 'w') as model_json_output_file:
            json.dump({
                "raw_outputs": json_output,
                "summary": summarize_results(model_responses)
            }, model_json_output_file)
    return


run()
input_file.close()