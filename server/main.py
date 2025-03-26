# app.py
from time import sleep
from flask import Flask, request
import os
from openmanus.app.agent.manus import Manus
from openmanus.app.schema import AgentState
import asyncio
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key'  # Required for Flask-SocketIO
socketio = SocketIO(app, cors_allowed_origins="*")  # Allow connections from any origin


root_dir = os.path.dirname(os.path.dirname(__file__))
config_path = os.path.join(root_dir, "config", "config.json")
agent = Manus()

@app.route("/")
def hello():
    return "Hello from Flask + Gunicorn!"

@app.route("/api/config_exists")
def config_exists():
    return '1' if os.path.exists(config_path) else '0'

@app.route("/api/save_config")
def save_config():
    with open(config_path, "w") as f:
        f.write("{}")
    return "Config saved"

@app.route("/api/prompt")
def prompt():
    task_id = request.args.get('task_id', 'default_task')
    prompt_text = request.args.get('prompt', 'summary aapl stock trends this year')
    socketio.start_background_task(run_agent_task, prompt_text, task_id)

    asyncio.create_task(agent.run('summary aapl stock trends this year'))
    return "Prompt"


@socketio.on('connect')
def handle_connect():
    """Handle client connection"""
    print(f"Client connected: {request.sid}")
    emit('connection_response', {'status': 'connected'})

@socketio.on('disconnect')
def handle_disconnect():
    """Handle client disconnection"""
    print(f"Client disconnected: {request.sid}")

# WebSocket task subscription handler
# @socketio.on('subscribe_to_task')
# def handle_task_subscription(data):
#     """Handle client subscription to task updates"""
#     prompt_text = data.get('prompt', '')
#     task_id = data.get('task_id', 'default_task')
    
#     # Start the task in a non-blocking way
#     socketio.start_background_task(run_agent_task, prompt_text, task_id)
    
#     return {'status': 'subscribed', 'task_id': task_id}

def run_agent_task(prompt_text, task_id):
    """Run the agent task and continuously send status updates to the client"""
    try:
        # Check status in a loop until completion
        status = 'running'
        while agent.state == AgentState.IDLE:
            sleep(0.2)
        while agent.state == AgentState.RUNNING:
            # Get current status (implement this method in your Manus class)
            last_message = agent.messages[-1].content
            print('🦄',last_message)

            # Send update to client
            emit('task_update', {
                'task_id': task_id,
                'status': agent.state,
                'message_content': last_message,
                'message': agent.messages[-1].to_dict()
            }, broadcast=True)
            
            # Wait before checking again
            socketio.sleep(1)
        
        # Final update with results
        result = agent.get_task_result(task_id)
        emit('task_complete', {
            'task_id': task_id,
            'status': status,
            'result': result
        }, broadcast=True)
        
    except Exception as e:
        # Handle errors
        emit('task_error', {
            'task_id': task_id,
            'status': 'failed',
            'error': str(e)
        }, broadcast=True)
