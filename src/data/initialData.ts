export const initialHabits = [
  {
    id: 1,
    name: "Morning Meditation",
    streak: 5,
    longestStreak: 15,
    lastCompleted: new Date().toISOString().split('T')[0],
    completed: true
  },
  {
    id: 2,
    name: "Read 30 Minutes",
    streak: 3,
    longestStreak: 10,
    lastCompleted: new Date().toISOString().split('T')[0],
    completed: true
  },
  {
    id: 3,
    name: "Exercise",
    streak: 2,
    longestStreak: 8,
    lastCompleted: null,
    completed: false
  },
  {
    id: 4,
    name: "Practice Coding",
    streak: 7,
    longestStreak: 20,
    lastCompleted: new Date().toISOString().split('T')[0],
    completed: true
  },
  {
    id: 5,
    name: "Drink Water",
    streak: 4,
    longestStreak: 12,
    lastCompleted: null,
    completed: false
  }
]; 