import json
from flask import Flask, request, jsonify
from dotenv import load_dotenv, find_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.memory import ConversationBufferMemory, FileChatMessageHistory
from langchain.chains import LLMChain
from langchain.schema import HumanMessage
from langchain.prompts import ChatPromptTemplate, HumanMessagePromptTemplate, MessagesPlaceholder
import os
from pymongo import MongoClient
from bson import ObjectId
import re

app = Flask(__name__)
app.secret_key = os.urandom(24)

# Load environment variables
load_dotenv(find_dotenv(), override=True)

mongo_uri = "mongodb+srv://alihamza:Player.123@cluster0.l5p91.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
client = MongoClient(mongo_uri)
db = client['test']  # Database name
events_collection = db['events']  # Collection name

# Initialize the LLM
llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash")

memory = ConversationBufferMemory(
    memory_key='chat_history',
    return_messages=True
)

# Define the prompt template for creating events
create_event_prompt_template = ChatPromptTemplate(
    messages=[
        MessagesPlaceholder(variable_name='chat_history'),
        HumanMessagePromptTemplate.from_template("{input}")
    ]
)

# Define the LLM chain for creating events
create_event_chain = LLMChain(
    llm=llm,
    prompt=create_event_prompt_template,
    memory=memory,
    verbose=True
)

def get_chatbot_response(user_message, chain):
    try:
        response = chain.invoke({'input': user_message})
        response_text = response.get('text', '')
        
        # Strip Markdown code block delimiters if present
        response_text = response_text.strip()
        if response_text.startswith('```') and response_text.endswith('```'):
            response_text = response_text[3:-3].strip()
        
        # If it starts with 'json', remove that as well
        if response_text.lower().startswith('json'):
            response_text = response_text[4:].strip()
        
        return response_text

    except Exception as e:
        print(f"Error in chatbot response: {e}")
        return "Sorry, there was an error processing your request."
    

def json_serialize(obj):
    if isinstance(obj, ObjectId):
        return str(obj)
    return obj

def convert_mongo_doc(doc):
    return {k: json_serialize(v) for k, v in doc.items()}

@app.route('/get-event-details', methods=['POST'])
def get_event_details():
    data = request.json
    user_message = data.get('text', '')

    # Define the prompt template for extracting event name from user input
    get_event_details_prompt_template = ChatPromptTemplate(
        messages=[
            MessagesPlaceholder(variable_name='chat_history'),
            HumanMessagePromptTemplate.from_template("""
            You are tasked with extracting the name of the event from the following user input. 
            Please identify and return the event name from the text below:
            Input: {input}
            Example Input:
            'Tell me about the "Tech Conference".'
            Required Output (JSON):
            {{
                "event_name": "Tech Conference"
            }}

            If the event name is not clear, or the request is to create an event, respond with a JSON object containing a "missing_info" key indicating that the event name could not be identified.
            """)
        ]
    )

    get_event_details_chain = LLMChain(
        llm=llm,
        prompt=get_event_details_prompt_template,
        memory=memory,
        verbose=True
    )

    # Get the chatbot response without concatenating the template
    response_text = get_chatbot_response(user_message, get_event_details_chain)

    try:
        # Check if the response is already in JSON format
        if isinstance(response_text, dict):
            response_json = response_text
        else:
            # Attempt to parse the response as JSON
            response_json = json.loads(response_text)
        print("Parsed JSON response:", response_json)

        if "missing_info" in response_json:
            return jsonify({
                "status": "incomplete",
                "message": "Could not identify the event name. Please provide more details or specify the event name clearly."
            }), 400

        # Query the database for the event details
        event_name = response_json.get("event_name")
        if not event_name:
            return jsonify({"error": "No event name provided"}), 400
        
        event = events_collection.find_one({"name": {"$regex": f"^{re.escape(event_name)}$", "$options": "i"}})
        
        if event:
            serializable_event = convert_mongo_doc(event)
            
            # Create a new prompt for generating a friendly message
            friendly_message_prompt = ChatPromptTemplate(
                messages=[
                    HumanMessagePromptTemplate.from_template("""
                    Given the following event details, please create a friendly and intuitive paragraph 
                    describing the event.

                    Event Details:
                    Name: {name}
                    Description: {description}
                    Date: {date}
                    Location: {location}
                    Tags: {tags}

                    Please provide your response as a plain text paragraph, without any JSON formatting.
                    """)
                ]
            )

            friendly_message_chain = LLMChain(
                llm=llm,
                prompt=friendly_message_prompt,
                verbose=True
            )

            # Generate the friendly message
            friendly_response = friendly_message_chain.invoke({
                "name": serializable_event.get('name', 'N/A'),
                "description": serializable_event.get('description', 'N/A'),
                "date": serializable_event.get('date', 'N/A'),
                "location": serializable_event.get('location', 'N/A'),
                "tags": ', '.join(serializable_event.get('tags', []))
            })

            friendly_message = friendly_response['text'].strip()

            return jsonify({
                "status": "success",
                "message": friendly_message,
                "event": serializable_event
            })
        else:
            return jsonify({"error": f"Event '{event_name}' not found"}), 404

    except json.JSONDecodeError as e:
        print(f"Error parsing JSON response: {e}")
        print("Response text that caused the error:", response_text)
        return jsonify({"error": "Invalid response format from the language model"}), 400
    except Exception as e:
        print(f"Error processing request: {e}")
        return jsonify({"error": "Error retrieving event details"}), 500

@app.route('/create-event', methods=['POST'])
def create_event():
    data = request.json
    user_message = data.get('text', '')

    # Isolated create event prompt
    create_event_prompt = """
    You are tasked with creating events for an event organizer application using the provided information. Extract the following details from the text and pass them as parameters to the 'create-event' route:

    - event_name: Name of the event
    - description: A brief description of the event
    - date: The date of the event in "YYYY-MM-DD" format
    - location: The venue or location of the event
    - tags: A list of relevant tags, which can include categories like ['web', 'mobile', etc.]

    Use the 'create-event' route and structure the response in JSON format as shown below:

    Example Input:
    'Create an event called "Tech Conference 2024" on October 12, 2024, at the Convention Center. The event will cover modern web and mobile technologies.'

    Required Output (JSON):
    {
        "route": "create-event",
        "parameters": {
            "event_name": "Tech Conference 2024",
            "description": "The event will cover modern web and mobile technologies.",
            "date": "2024-10-12",
            "location": "Convention Center",
        }
    }

    If any required information is missing, respond with a JSON object containing a "missing_info" key listing the missing fields.
    If there's irrelevant information, ignore it and only include the relevant details in the JSON response.
    if request is to get information of event respond with a JSON object containing a "request can not be fullfilled" key indicating that the request could not be identified
    """

    # Get the chatbot response
    response_text = get_chatbot_response(user_message + "\n\n" + create_event_prompt, create_event_chain)

    try:
        # Attempt to parse the response as JSON
        response_json = json.loads(response_text)
        print("Parsed JSON response:", response_json)
        
        # Check if the response is asking for missing information
        if "missing_info" in response_json:
            missing_fields = response_json["missing_info"]
            return jsonify({
                "status": "incomplete",
                "message": f"Please provide the following missing information: {', '.join(missing_fields)}",
                "missing_fields": missing_fields
            }), 400
        
        # Validate the response structure
        if (isinstance(response_json, dict) and 
            'route' in response_json and 
            response_json['route'] == 'create-event' and
            'parameters' in response_json):
            
            params = response_json['parameters']
            required_fields = ['event_name', 'description', 'date', 'location']
            
            # Check if all required fields are present
            if all(field in params for field in required_fields):
                # Here you would typically save the event to your database
                # For now, we'll just return a success message
                return jsonify({
                    "status": "success",
                    "message": "Event created successfully",
                    "event": params
                })
            else:
                missing = [field for field in required_fields if field not in params]
                return jsonify({
                    "status": "incomplete",
                    "message": f"Missing required fields: {', '.join(missing)}",
                    "missing_fields": missing
                }), 400
        else:
            print("Invalid response format:", response_json)
            return jsonify({"error": "Invalid response format from LLM"}), 400

    except json.JSONDecodeError as e:
        print(f"Error parsing JSON response: {e}")
        print("Response text that caused the error:", response_text)
        return jsonify({"error": "Error parsing JSON response from LLM"}), 400
    except Exception as e:
        print(f"Error processing request: {e}")
        return jsonify({"error": "Error processing event creation request"}), 400

if __name__ == '__main__':
    app.run(debug=True)