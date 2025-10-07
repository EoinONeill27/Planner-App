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
        'estimated_duration': data.get('estimated_duration', 30),  # in minutes
        'actual_duration': data.get('actual_duration', 0),  # in minutes
        'time_entries': [],  # Array of time tracking entries
        'tags': data.get('tags', []),  # Array of custom tags
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
    if 'estimated_duration' in data:
        task['estimated_duration'] = data['estimated_duration']
    if 'actual_duration' in data:
        task['actual_duration'] = data['actual_duration']
    if 'tags' in data:
        task['tags'] = data['tags']
    
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

@app.route('/api/tasks/<task_id>/time', methods=['POST'])
def add_time_entry(task_id):
    """Add a time tracking entry to a task"""
    data = request.get_json()
    
    task = next((t for t in tasks if t['id'] == task_id), None)
    if not task:
        return jsonify({'error': 'Task not found'}), 404
    
    time_entry = {
        'id': str(uuid.uuid4()),
        'duration': data.get('duration', 0),  # in minutes
        'description': data.get('description', ''),
        'started_at': data.get('started_at', datetime.now().isoformat()),
        'created_at': datetime.now().isoformat()
    }
    
    task['time_entries'].append(time_entry)
    task['actual_duration'] = sum(entry['duration'] for entry in task['time_entries'])
    task['updated_at'] = datetime.now().isoformat()
    
    return jsonify(time_entry), 201

@app.route('/api/tasks/<task_id>/time/<entry_id>', methods=['DELETE'])
def delete_time_entry(task_id, entry_id):
    """Delete a time tracking entry from a task"""
    task = next((t for t in tasks if t['id'] == task_id), None)
    if not task:
        return jsonify({'error': 'Task not found'}), 404
    
    task['time_entries'] = [entry for entry in task['time_entries'] if entry['id'] != entry_id]
    task['actual_duration'] = sum(entry['duration'] for entry in task['time_entries'])
    task['updated_at'] = datetime.now().isoformat()
    
    return jsonify({'message': 'Time entry deleted successfully'})

# Task templates storage
templates = [
    {
        'id': '1',
        'name': 'Daily Standup',
        'title': 'Daily Standup Meeting',
        'description': 'Review progress and plan for the day',
        'category': 'Work',
        'priority': 'Medium',
        'estimated_duration': 30,
        'is_recurring': True,
        'recurrence_type': 'daily',
        'recurrence_interval': 1,
        'tags': ['meeting', 'daily']
    },
    {
        'id': '2',
        'name': 'Code Review',
        'title': 'Code Review Session',
        'description': 'Review and provide feedback on code changes',
        'category': 'Work',
        'priority': 'High',
        'estimated_duration': 60,
        'tags': ['development', 'review']
    },
    {
        'id': '3',
        'name': 'Exercise',
        'title': 'Daily Exercise',
        'description': 'Physical activity and workout',
        'category': 'Health',
        'priority': 'Medium',
        'estimated_duration': 45,
        'is_recurring': True,
        'recurrence_type': 'daily',
        'recurrence_interval': 1,
        'tags': ['health', 'fitness']
    }
]

@app.route('/api/templates', methods=['GET'])
def get_templates():
    """Get all task templates"""
    return jsonify(templates)

@app.route('/api/templates/<template_id>/create', methods=['POST'])
def create_task_from_template(template_id):
    """Create a new task from a template"""
    template = next((t for t in templates if t['id'] == template_id), None)
    if not template:
        return jsonify({'error': 'Template not found'}), 404
    
    # Create task from template
    task = {
        'id': str(uuid.uuid4()),
        'title': template['title'],
        'description': template['description'],
        'category': template['category'],
        'priority': template['priority'],
        'due_date': None,
        'is_recurring': template.get('is_recurring', False),
        'recurrence_type': template.get('recurrence_type', 'none'),
        'recurrence_interval': template.get('recurrence_interval', 1),
        'last_completed': None,
        'next_due': None,
        'completed': False,
        'estimated_duration': template['estimated_duration'],
        'actual_duration': 0,
        'time_entries': [],
        'tags': template.get('tags', []),
        'created_at': datetime.now().isoformat(),
        'updated_at': datetime.now().isoformat()
    }
    
    tasks.append(task)
    return jsonify(task), 201

@app.route('/api/tasks/export', methods=['GET'])
def export_tasks():
    """Export all tasks to CSV format"""
    import csv
    import io
    
    output = io.StringIO()
    writer = csv.writer(output)
    
    # Write header
    writer.writerow([
        'ID', 'Title', 'Description', 'Category', 'Priority', 'Due Date',
        'Completed', 'Estimated Duration (min)', 'Actual Duration (min)',
        'Recurring', 'Tags', 'Created At', 'Updated At'
    ])
    
    # Write task data
    for task in tasks:
        writer.writerow([
            task['id'],
            task['title'],
            task['description'],
            task['category'],
            task['priority'],
            task.get('due_date', ''),
            task['completed'],
            task.get('estimated_duration', 0),
            task.get('actual_duration', 0),
            task['is_recurring'],
            ','.join(task.get('tags', [])),
            task['created_at'],
            task['updated_at']
        ])
    
    output.seek(0)
    return output.getvalue(), 200, {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename=tasks_export.csv'
    }

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000) 