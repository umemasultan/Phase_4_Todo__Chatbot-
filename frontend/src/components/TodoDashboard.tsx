import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Chip,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as RadioButtonUncheckedIcon,
} from '@mui/icons-material';
import { Todo, UpdateTodoInput } from '../types';
import { apiClient } from '../services/ApiClient';

interface TodoDashboardProps {
  todos: Todo[];
  onTodosChange: () => void;
}

export function TodoDashboard({ todos, onTodosChange }: TodoDashboardProps) {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [editForm, setEditForm] = useState<UpdateTodoInput>({});

  const handleToggleStatus = async (todo: Todo) => {
    try {
      const newStatus = todo.status === 'PENDING' ? 'COMPLETED' : 'PENDING';
      await apiClient.updateTodo(todo.id, { status: newStatus });
      onTodosChange();
    } catch (error) {
      console.error('Failed to update todo:', error);
    }
  };

  const handleDelete = async (todoId: string) => {
    if (!confirm('Are you sure you want to delete this todo?')) return;

    try {
      await apiClient.deleteTodo(todoId);
      onTodosChange();
    } catch (error) {
      console.error('Failed to delete todo:', error);
    }
  };

  const handleEdit = (todo: Todo) => {
    setEditingTodo(todo);
    setEditForm({
      title: todo.title,
      description: todo.description,
      priority: todo.priority,
      dueDate: todo.dueDate,
    });
    setEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editingTodo) return;

    try {
      await apiClient.updateTodo(editingTodo.id, editForm);
      setEditDialogOpen(false);
      setEditingTodo(null);
      onTodosChange();
    } catch (error) {
      console.error('Failed to update todo:', error);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH':
        return 'error';
      case 'MEDIUM':
        return 'warning';
      case 'LOW':
        return 'info';
      default:
        return 'default';
    }
  };

  const pendingTodos = todos.filter((t) => t.status === 'PENDING');
  const completedTodos = todos.filter((t) => t.status === 'COMPLETED');

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Your Todos
      </Typography>

      {todos.length === 0 ? (
        <Typography color="text.secondary">
          No todos yet. Start chatting to create some!
        </Typography>
      ) : (
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Pending ({pendingTodos.length})
            </Typography>
            {pendingTodos.map((todo) => (
              <Card
                key={todo.id}
                sx={{
                  mb: 2,
                  backgroundColor: 'rgba(21, 23, 61, 0.6)',
                  border: '1px solid rgba(99, 102, 241, 0.3)',
                  '&:hover': {
                    border: '1px solid rgba(99, 102, 241, 0.6)',
                    boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)',
                  },
                }}
              >
                <CardContent>
                  <Box display="flex" alignItems="flex-start" justifyContent="space-between">
                    <Box flex={1}>
                      <Box display="flex" alignItems="center" gap={1} mb={1}>
                        <IconButton
                          size="small"
                          onClick={() => handleToggleStatus(todo)}
                          color="primary"
                        >
                          <RadioButtonUncheckedIcon />
                        </IconButton>
                        <Typography variant="h6">{todo.title}</Typography>
                      </Box>
                      {todo.description && (
                        <Typography variant="body2" color="text.secondary" mb={1}>
                          {todo.description}
                        </Typography>
                      )}
                      <Box display="flex" gap={1} flexWrap="wrap">
                        <Chip
                          label={todo.priority}
                          size="small"
                          color={getPriorityColor(todo.priority) as any}
                        />
                        {todo.dueDate && (
                          <Chip
                            label={`Due: ${new Date(todo.dueDate).toLocaleDateString()}`}
                            size="small"
                            variant="outlined"
                          />
                        )}
                      </Box>
                    </Box>
                    <Box>
                      <IconButton size="small" onClick={() => handleEdit(todo)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleDelete(todo.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Completed ({completedTodos.length})
            </Typography>
            {completedTodos.map((todo) => (
              <Card
                key={todo.id}
                sx={{
                  mb: 2,
                  opacity: 0.7,
                  backgroundColor: 'rgba(21, 23, 61, 0.4)',
                  border: '1px solid rgba(42, 45, 95, 0.5)',
                }}
              >
                <CardContent>
                  <Box display="flex" alignItems="flex-start" justifyContent="space-between">
                    <Box flex={1}>
                      <Box display="flex" alignItems="center" gap={1} mb={1}>
                        <IconButton
                          size="small"
                          onClick={() => handleToggleStatus(todo)}
                          color="success"
                        >
                          <CheckCircleIcon />
                        </IconButton>
                        <Typography
                          variant="h6"
                          sx={{ textDecoration: 'line-through' }}
                        >
                          {todo.title}
                        </Typography>
                      </Box>
                      {todo.description && (
                        <Typography variant="body2" color="text.secondary" mb={1}>
                          {todo.description}
                        </Typography>
                      )}
                    </Box>
                    <IconButton size="small" onClick={() => handleDelete(todo.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Grid>
        </Grid>
      )}

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Todo</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Title"
              fullWidth
              value={editForm.title || ''}
              onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
            />
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={3}
              value={editForm.description || ''}
              onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
            />
            <FormControl fullWidth>
              <InputLabel>Priority</InputLabel>
              <Select
                value={editForm.priority || 'MEDIUM'}
                label="Priority"
                onChange={(e) => setEditForm({ ...editForm, priority: e.target.value as any })}
              >
                <MenuItem value="LOW">Low</MenuItem>
                <MenuItem value="MEDIUM">Medium</MenuItem>
                <MenuItem value="HIGH">High</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Due Date"
              type="datetime-local"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={editForm.dueDate ? new Date(editForm.dueDate).toISOString().slice(0, 16) : ''}
              onChange={(e) => setEditForm({ ...editForm, dueDate: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveEdit} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
