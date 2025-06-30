const express = require('express');
const router = express.Router();
const pool = require('../db');



//GET /api/tasks/manager/:managerId - Fetch all tasks assigned by a manager - fir manager dashboard se ispe call lagega
router.get('/manager/:managerId', async (req, res) => {
  try {
    const { managerId } = req.params;
    
    const query = `
      SELECT 
        t.id,
        t.title,
        t.description,
        t.priority,
        t.status,
        t.due_date,
        t.reason_failed,
        t.created_at,
        t.updated_at,
        t.accepted_at,
        t.completed_at,
        t.failed_at,
        u.full_name as assigned_to_name,
        u.email as assigned_to_email
      FROM tasks t
      JOIN users u ON t.assigned_to = u.id
      WHERE t.assigned_by = $1
      ORDER BY t.created_at DESC
    `;
    
    const result = await pool.query(query, [managerId]);
    
    res.status(200).json({
      success: true,
      tasks: result.rows
    });
    
  } catch (error) {
    console.error('Error fetching manager tasks:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch tasks',
      error: error.message
    });
  }
});

//POST /api/tasks/assign - Create/Assign a new task - manager se call aayega ispe
router.post('/assign', async (req, res) => {
  try {
    const {
      title,
      description,
      priority,
      due_date,
      assigned_by,
      assigned_to,
      organization_id
    } = req.body;

    if (!title || !assigned_by || !assigned_to || !due_date || !organization_id) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: title, assigned_by, assigned_to, due_date, organization_id'
      });
    }

    const validPriorities = ['low', 'medium', 'high'];
    if (!validPriorities.includes(priority.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid priority. Must be low, medium, or high'
      });
    }

    // Insert new task
    const insertQuery = `
      INSERT INTO tasks (
        organization_id,
        title,
        description,
        priority,
        assigned_by,
        assigned_to,
        due_date
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, title, created_at
    `;

    const values = [
      organization_id,
      title,
      description || '',
      priority.toLowerCase(),
      assigned_by,
      assigned_to,
      due_date
    ];

    const result = await pool.query(insertQuery, values);
    const newTask = result.rows[0];

    // Log the task creation in task_logs
    const logQuery = `
      INSERT INTO task_logs (task_id, user_id, action, note)
      VALUES ($1, $2, 'created', $3)
    `;

    await pool.query(logQuery, [
      newTask.id,
      assigned_by,
      `Task "${title}" assigned to employee`
    ]);

    res.status(201).json({
      success: true,
      message: 'Task assigned successfully',
      task: newTask
    });

  } catch (error) {
    console.error('Error assigning task:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to assign task',
      error: error.message
    });
  }
});

//GET /api/tasks/logs/organization/:organizationId - Fetch task logs for organization
router.get('/logs/organization/:organizationId', async (req, res) => {
  try {
    const { organizationId } = req.params;
    
    const query = `
      SELECT 
        tl.id,
        tl.task_id,
        tl.user_id,
        tl.action,
        tl.timestamp,
        tl.note,
        t.title as task_title,
        t.priority as task_priority,
        t.status as task_status,
        u.full_name as user_name,
        u.email as user_email,
        u.role as user_role
      FROM task_logs tl
      JOIN tasks t ON tl.task_id = t.id
      JOIN users u ON tl.user_id = u.id
      WHERE t.organization_id = $1
      ORDER BY tl.timestamp DESC
    `;
    
    const result = await pool.query(query, [organizationId]);
    
    res.status(200).json({
      success: true,
      logs: result.rows
    });
    
  } catch (error) {
    console.error('Error fetching task logs:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch task logs',
      error: error.message
    });
  }
});

//GET /api/tasks/employee/:employeeId - Fetch tasks assigned to an employee
router.get('/employee/:employeeId', async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { status } = req.query; // Optional filter by status
    
    if (!employeeId) {
      return res.status(400).json({
        success: false,
        message: 'Employee ID is required'
      });
    }
    
    let query = `
      SELECT 
        t.id,
        t.title,
        t.description,
        t.priority,
        t.status,
        t.due_date,
        t.reason_failed,
        t.created_at,
        t.updated_at,
        t.accepted_at,
        t.completed_at,
        t.failed_at,
        u.full_name as assigned_by_name,
        u.email as assigned_by_email
      FROM tasks t
      JOIN users u ON t.assigned_by = u.id
      WHERE t.assigned_to = $1
    `;
    
    const params = [employeeId];
    
    if (status) {
      query += ` AND t.status = $2`;
      params.push(status);
    }
    
    // Better ordering: prioritize by status, then by date
    query += ` ORDER BY 
      CASE t.status
        WHEN 'new' THEN 1
        WHEN 'accepted' THEN 2
        WHEN 'completed' THEN 3
        WHEN 'failed' THEN 4
      END,
      t.created_at DESC`;
    
    const result = await pool.query(query, params);
    
    // Handle empty results gracefully
    if (result.rows.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No tasks found for this employee',
        tasks: []
      });
    }
    
    res.status(200).json({
      success: true,
      tasks: result.rows,
      count: result.rows.length
    });
    
  } catch (error) {
    console.error('Error fetching employee tasks:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch employee tasks',
      error: error.message
    });
  }
});

//PUT /api/tasks/:taskId/accept - Accept a task
router.put('/:taskId/accept', async (req, res) => {
  try {
    const { taskId } = req.params;
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(400).json({
        success: false,
        message: 'user_id is required'
      });
    }

    // Update task status and accepted_at timestamp in databasse
    const updateQuery = `
      UPDATE tasks 
      SET status = 'accepted', 
          accepted_at = CURRENT_TIMESTAMP,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $1 AND assigned_to = $2 AND status = 'new'
      RETURNING id, title, status
    `;

    const result = await pool.query(updateQuery, [taskId, user_id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Task not found or cannot be accepted'
      });
    }

    const task = result.rows[0];

    // Log the task acceptance - ye task_logs table me insert karega
    const logQuery = `
      INSERT INTO task_logs (task_id, user_id, action, note)
      VALUES ($1, $2, 'accepted', 'Task accepted by employee')
    `;

    await pool.query(logQuery, [taskId, user_id]);

    res.status(200).json({
      success: true,
      message: 'Task accepted successfully',
      task: task
    });

  } catch (error) {
    console.error('Error accepting task:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to accept task',
      error: error.message
    });
  }
});

//PUT /api/tasks/:taskId/complete - Mark task as completed
router.put('/:taskId/complete', async (req, res) => {
  try {
    const { taskId } = req.params;
    const { user_id, note } = req.body;

    if (!user_id) {
      return res.status(400).json({
        success: false,
        message: 'user_id is required'
      });
    }

    // Update task status and completed_at timestamp
    const updateQuery = `
      UPDATE tasks 
      SET status = 'completed', 
          completed_at = CURRENT_TIMESTAMP,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $1 AND assigned_to = $2 AND status = 'accepted'
      RETURNING id, title, status
    `;

    const result = await pool.query(updateQuery, [taskId, user_id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Task not found or cannot be completed'
      });
    }

    const task = result.rows[0];

    // Log the task completion
    const logQuery = `
      INSERT INTO task_logs (task_id, user_id, action, note)
      VALUES ($1, $2, 'completed', $3)
    `;

    await pool.query(logQuery, [taskId, user_id, note || 'Task completed successfully']);

    res.status(200).json({
      success: true,
      message: 'Task completed successfully',
      task: task
    });

  } catch (error) {
    console.error('Error completing task:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to complete task',
      error: error.message
    });
  }
});

//PUT /api/tasks/:taskId/fail - Mark task as failed
router.put('/:taskId/fail', async (req, res) => {
  try {
    const { taskId } = req.params;
    const { user_id, reason } = req.body;

    if (!user_id || !reason) {
      return res.status(400).json({
        success: false,
        message: 'user_id and reason are required'
      });
    }

    // Update task status, failed_at timestamp, and failure reason
    const updateQuery = `
      UPDATE tasks 
      SET status = 'failed', 
          failed_at = CURRENT_TIMESTAMP,
          reason_failed = $3,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $1 AND assigned_to = $2 AND status = 'accepted'
      RETURNING id, title, status, reason_failed
    `;

    const result = await pool.query(updateQuery, [taskId, user_id, reason]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Task not found or cannot be marked as failed'
      });
    }

    const task = result.rows[0];

    // Log the task failure
    const logQuery = `
      INSERT INTO task_logs (task_id, user_id, action, note)
      VALUES ($1, $2, 'failed', $3)
    `;

    await pool.query(logQuery, [taskId, user_id, `Task failed: ${reason}`]);

    res.status(200).json({
      success: true,
      message: 'Task marked as failed',
      task: task
    });

  } catch (error) {
    console.error('Error marking task as failed:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark task as failed',
      error: error.message
    });
  }
});




router.get('/stats/organization/:organizationId', async (req, res) => {
  try {
    const { organizationId } = req.params;
    
    const statsQuery = `
      SELECT 
        COUNT(*) as total_tasks,
        SUM(CASE WHEN status = 'new' THEN 1 ELSE 0 END) as new_tasks,
        SUM(CASE WHEN status = 'accepted' THEN 1 ELSE 0 END) as accepted_tasks,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_tasks,
        SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as failed_tasks,
        SUM(CASE WHEN priority = 'high' THEN 1 ELSE 0 END) as high_priority,
        SUM(CASE WHEN priority = 'medium' THEN 1 ELSE 0 END) as medium_priority,
        SUM(CASE WHEN priority = 'low' THEN 1 ELSE 0 END) as low_priority
      FROM tasks
      WHERE organization_id = $1
    `;
    
    const result = await pool.query(statsQuery, [organizationId]);
    
    res.json({ 
      success: true,
      stats: result.rows[0] 
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch task stats'
    });
  }
});




//GET /api/tasks/stats/employee/:employeeId - Get task statistics for employee
router.get('/stats/employee/:employeeId', async (req, res) => {
  try {
    const { employeeId } = req.params;
    
    const query = `
      SELECT 
        COUNT(*) as total_tasks,
        COUNT(CASE WHEN status = 'new' THEN 1 END) as new_tasks,
        COUNT(CASE WHEN status = 'accepted' THEN 1 END) as accepted_tasks,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_tasks,
        COUNT(CASE WHEN status = 'failed' THEN 1 END) as failed_tasks,
        COUNT(CASE WHEN priority = 'high' THEN 1 END) as high_priority,
        COUNT(CASE WHEN priority = 'medium' THEN 1 END) as medium_priority,
        COUNT(CASE WHEN priority = 'low' THEN 1 END) as low_priority
      FROM tasks 
      WHERE assigned_to = $1
    `;
    
    const result = await pool.query(query, [employeeId]);
    const stats = result.rows[0];
    
    // Convert string numbers to integers - reason upar ek jagah likha hai  iska maine
    Object.keys(stats).forEach(key => {
      stats[key] = parseInt(stats[key]) || 0;
    });
    
    res.status(200).json({
      success: true,
      stats: stats
    });
    
  } catch (error) {
    console.error('Error fetching employee task stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch employee task statistics',
      error: error.message
    });
  }
});

//DELETE /api/tasks/:taskId - Delete a task (Manager only)
router.delete('/:taskId', async (req, res) => {
  try {
    const { taskId } = req.params;
    const { manager_id } = req.body;

    if (!manager_id) {
      return res.status(400).json({
        success: false,
        message: 'manager_id is required in request body'
      });
    }

    // First, verify that the task exists and belongs to this manager
    const verifyQuery = `
      SELECT id, title, assigned_by, status
      FROM tasks 
      WHERE id = $1 AND assigned_by = $2
    `;

    const verifyResult = await pool.query(verifyQuery, [taskId, manager_id]);

    if (verifyResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Task not found or you do not have permission to delete this task'
      });
    }

    const task = verifyResult.rows[0];

    // Note: Logging skipped as 'deleted' is not in task_action enum. - task status sirf 4 hai usme deleted nhi hai isliye yha no logging wali cheez

    // Delete the task (this will cascade delete task_logs due to foreign key constraint)
    const deleteQuery = `
      DELETE FROM tasks 
      WHERE id = $1 AND assigned_by = $2
      RETURNING id, title
    `;

    const deleteResult = await pool.query(deleteQuery, [taskId, manager_id]);

    if (deleteResult.rows.length === 0) {
      return res.status(500).json({
        success: false,
        message: 'Failed to delete task'
      });
    }

    const deletedTask = deleteResult.rows[0];

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
      task: deletedTask
    });

  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete task',
      error: error.message
    });
  }
});



router.get('/organization/:organizationId', async (req, res) => {
  try {
    const { organizationId } = req.params;
    const result = await pool.query(`
      SELECT t.*, 
        a.full_name as assigned_to_name,
        b.full_name as assigned_by_name
      FROM tasks t
      JOIN users a ON t.assigned_to = a.id
      JOIN users b ON t.assigned_by = b.id
      WHERE t.organization_id = $1
      ORDER BY t.created_at DESC
    `, [organizationId]);
    
    res.json({ tasks: result.rows });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});




module.exports = router;