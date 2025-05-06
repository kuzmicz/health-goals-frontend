import api from '../api/axios';

export const fetchGoals = async () => {
  const res = await api.get('/goals');
  return res.data;
};

export const createGoal = async (title: string, description: string) => {
  const res = await api.post('/goals', { title, description });
  return res.data;
};

export const updateGoalStatus = async (id: string, completed: boolean) => {
  const res = await api.put(`/goals/${id}`, { completed });
  return res.data;
};

export const deleteGoal = async (id: string) => {
  const res = await api.delete(`/goals/${id}`);
  return res.data;
};
