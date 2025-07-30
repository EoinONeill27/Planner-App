from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
import uuid

app = Flask(__name__)
CORS(app)

# In-memory storage for tasks (in production, use a database)
tasks = []

@app.route('/api/tasks', methods=['GET'])
def get_tasks():
    """Get all tasks"""
    return jsonify(tasks)

@app.route('/api/tasks', methods=['POST'])
def create_task():
    """Create a new task"""
    data = request.get_json()
    
    if not data or 'title' not in data:
        return jsonify({'error': 'Title is required'}), 400
    
    task = {
        'id': str(uuid.uuid4()),
        'title': data['title'],
        'description': data.get('description', ''),
        'category': data.get('category', 'General'),
        'priority': data.get('priority', 'Medium'),
        'due_date': data.get('due_date'),
        'is_recurring': data.get('is_recurring', False),
        'recurrence_type': data.get('recurrence_type', 'none'),  # daily, weekly, monthly, none
        'recurrence_interval': data.get('recurrence_interval', 1),  # every X days/weeks/months
        'last_completed': None,
        'next_due': data.get('due_date'),
        'completed': False,
        'created_at': datetime.now().isoformat(),
        'updated_at': datetime.now().isoformat()
    }
    
    tasks.append(task)
    return jsonify(task), 201

@app.route('/api/tasks/<task_id>', methods=['PUT'])
def update_task(task_id):
    """Update a task"""
    data = request.get_json()
    
    task = next((t for t in tasks if t['id'] == task_id), None)
    if not task:
        return jsonify({'error': 'Task not found'}), 404
    
    # Update fields
    if 'title' in data:
        task['title'] = data['title']
    if 'description' in data:
        task['description'] = data['description']
    if 'category' in data:
        task['category'] = data['category']
    if 'priority' in data:
        task['priority'] = data['priority']
    if 'due_date' in data:
        task['due_date'] = data['due_date']
    if 'is_recurring' in data:
        task['is_recurring'] = data['is_recurring']
    if 'recurrence_type' in data:
        task['recurrence_type'] = data['recurrence_type']
    if 'recurrence_interval' in data:
        task['recurrence_interval'] = data['recurrence_interval']
    if 'completed' in data:
        task['completed'] = data['completed']
    
    task['updated_at'] = datetime.now().isoformat()
    
    return jsonify(task)

@app.route('/api/tasks/<task_id>', methods=['DELETE'])
def delete_task(task_id):
    """Delete a task"""
    global tasks
    task = next((t for t in tasks if t['id'] == task_id), None)
    if not task:
        return jsonify({'error': 'Task not found'}), 404
    
    tasks = [t for t in tasks if t['id'] != task_id]
    return jsonify({'message': 'Task deleted successfully'})

@app.route('/api/tasks/<task_id>/toggle', methods=['PUT'])
def toggle_task(task_id):
    """Toggle task completion status"""
    task = next((t for t in tasks if t['id'] == task_id), None)
    if not task:
        return jsonify({'error': 'Task not found'}), 404
    
    current_time = datetime.now()
    
    if task['completed']:
        # Mark as incomplete
        task['completed'] = False
        task['last_completed'] = None
    else:
        # Mark as complete
        task['completed'] = True
        task['last_completed'] = current_time.isoformat()
        
        # If it's a recurring task, calculate next due date
        if task['is_recurring'] and task['recurrence_type'] != 'none':
            from datetime import timedelta
            if task['recurrence_type'] == 'daily':
                next_due = current_time + timedelta(days=task['recurrence_interval'])
            elif task['recurrence_type'] == 'weekly':
                next_due = current_time + timedelta(weeks=task['recurrence_interval'])
            elif task['recurrence_type'] == 'monthly':
                # Simple monthly calculation (30 days)
                next_due = current_time + timedelta(days=30 * task['recurrence_interval'])
            else:
                next_due = current_time + timedelta(days=1)
            
            task['next_due'] = next_due.strftime('%Y-%m-%d')
            task['completed'] = False  # Reset for next occurrence
    
    task['updated_at'] = current_time.isoformat()
    
    return jsonify(task)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000) 