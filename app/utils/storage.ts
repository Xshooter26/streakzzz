// Define the Habit interface for better type safety
export interface Habit {
  id: string;
  name: string;
  streak: number;
  category?: string;
  history?: StreakHistory[];
  lastUpdated?: string;
  createdAt: string;
}

// Define the StreakHistory interface for tracking streak changes
export interface StreakHistory {
  date: string;
  value: number;
}

export function getHabits(): Habit[] {
  if (typeof window === "undefined") return [];
  const habits = JSON.parse(localStorage.getItem("habits") || "[]");
  
  // Ensure all habits have the required properties
  return habits.map((habit: any) => ({
    id: habit.id || generateId(),
    name: habit.name,
    streak: habit.streak || 0,
    category: habit.category || "General",
    history: habit.history || [],
    lastUpdated: habit.lastUpdated || new Date().toISOString(),
    createdAt: habit.createdAt || new Date().toISOString()
  }));
}

export function saveHabits(habits: Habit[]) {
  localStorage.setItem("habits", JSON.stringify(habits));
}

export function getLongestStreak() {
  if (typeof window === "undefined") return 0;
  return JSON.parse(localStorage.getItem("longestStreak") || "0");
}

export function updateLongestStreak(streak: number) {
  const longestStreak = getLongestStreak();
  if (streak > longestStreak) {
    localStorage.setItem("longestStreak", JSON.stringify(streak));
  }
}

// Generate a unique ID for new habits
function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// Reset a habit's streak to zero
export function resetHabitStreak(habitId: string) {
  const habits = getHabits();
  const updatedHabits = habits.map(habit => {
    if (habit.id === habitId) {
      // Add current streak to history before resetting
      const history = habit.history || [];
      history.push({
        date: new Date().toISOString(),
        value: habit.streak
      });
      
      return {
        ...habit,
        streak: 0,
        history,
        lastUpdated: new Date().toISOString()
      };
    }
    return habit;
  });
  
  saveHabits(updatedHabits);
  return updatedHabits;
}

// Save categories to localStorage
export function saveCategories(categories: string[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem("categories", JSON.stringify(categories));
}

// Get all available categories
export function getCategories(): string[] {
  if (typeof window === "undefined") return ["General"];
  const storedCategories = JSON.parse(localStorage.getItem("categories") || "[]");
  return storedCategories.length > 0 ? storedCategories : ["General"];
}

// Get habits by category
export function getHabitsByCategory(category: string): Habit[] {
  const habits = getHabits();
  return habits.filter(habit => habit.category === category);
}

// Get streak history for a specific habit
export function getHabitHistory(habitId: string): StreakHistory[] {
  const habits = getHabits();
  const habit = habits.find(h => h.id === habitId);
  return habit?.history || [];
}
  