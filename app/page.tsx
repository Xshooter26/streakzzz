"use client";

import { useEffect, useState } from "react";
import { 
  getHabits, 
  saveHabits, 
  getLongestStreak, 
  updateLongestStreak,
  resetHabitStreak,
  getCategories,
  saveCategories,
  Habit,
  StreakHistory
} from "./utils/storage";
import { ThemeToggle } from "./ThemeToggle";
import { FiAward, FiPlus, FiTrash2, FiRefreshCw, FiBarChart2, FiTag } from "react-icons/fi";
import { FireIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export default function Home() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [newHabit, setNewHabit] = useState("");
  const [newCategory, setNewCategory] = useState("General");
  const [longestStreak, setLongestStreak] = useState(0);
  const [categories, setCategories] = useState<string[]>(["General"]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState<string | null>(null);
  const [showCategoryDialog, setShowCategoryDialog] = useState(false);
  const [newCategoryInput, setNewCategoryInput] = useState("");

  useEffect(() => {
    setHabits(getHabits());
    setLongestStreak(getLongestStreak());
    // Get categories from storage and ensure "General" is included without duplicates
    const storedCategories = getCategories();
    setCategories(["General", ...storedCategories.filter(cat => cat !== "General")]);
  }, []);
  
  // Filter habits by selected category
  const filteredHabits = selectedCategory 
    ? habits.filter(habit => habit.category === selectedCategory)
    : habits;

  const addHabit = () => {
    if (!newHabit.trim()) return;
    const newHabitObj: Habit = {
      id: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
      name: newHabit,
      streak: 0,
      category: newCategory,
      history: [],
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    };
    const updatedHabits = [...habits, newHabitObj];
    setHabits(updatedHabits);
    saveHabits(updatedHabits);
    setNewHabit("");
  };

  // Add a new category
  const addCategory = (category: string) => {
    if (!category.trim() || categories.includes(category)) return;
    
    try {
      const updatedCategories = [...categories, category];
      setCategories(updatedCategories);
      saveCategories(updatedCategories);
      setNewCategory(category);
      
      // Reset states in correct order
      setNewCategoryInput("");
      setShowCategoryDialog(false);
      
      // Show success message after state updates
      setTimeout(() => {
        toast.success(`Added new category: ${category}`);
      }, 100);
    } catch (error) {
      console.error('Error adding category:', error);
      toast.error('Failed to add category');
    }
  };

  const incrementStreak = (index: number) => {
    const updatedHabits = [...habits];
    updatedHabits[index].streak += 1;
    
    // Update history
    if (!updatedHabits[index].history) {
      updatedHabits[index].history = [];
    }
    
    // Only add to history if it's a new day or first entry
    const today = new Date().toISOString().split('T')[0];
    const lastEntryDate = updatedHabits[index].history?.length > 0
      ? updatedHabits[index].history[updatedHabits[index].history.length - 1].date.split('T')[0]
      : null;
      
    if (lastEntryDate !== today) {
      updatedHabits[index].history?.push({
        date: new Date().toISOString(),
        value: updatedHabits[index].streak
      });
    } else {
      // Update the last entry with the new streak value
      if (updatedHabits[index].history?.length) {
        updatedHabits[index].history[updatedHabits[index].history.length - 1].value = updatedHabits[index].streak;
      }
    }
    
    updatedHabits[index].lastUpdated = new Date().toISOString();
    
    setHabits(updatedHabits);
    saveHabits(updatedHabits);

    updateLongestStreak(updatedHabits[index].streak);
    setLongestStreak(getLongestStreak());
  };
  
  // Reset a habit's streak to zero
  const resetStreak = (id: string) => {
    const habit = habits.find(h => h.id === id);
    if (habit) {
      const updatedHabits = resetHabitStreak(id);
      setHabits(updatedHabits);
      toast.success(`Reset streak for ${habit.name}`);
    }
  };

  const deleteHabit = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const habitToDelete = habits[index];
    if (habitToDelete) {
      const updatedHabits = habits.filter((_, i) => i !== index);
      setHabits(updatedHabits);
      saveHabits(updatedHabits);
      toast.success(`Deleted habit: ${habitToDelete.name}`);
    }
  };
  
  // Show confirmation toast before deleting
  const confirmDelete = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const habitToDelete = habits[index];
    if (habitToDelete) {
      toast((t) => (
        <div className="flex flex-col gap-2">
          <p>Delete habit <strong>{habitToDelete.name}</strong>?</p>
          <div className="flex gap-2 justify-end">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => toast.dismiss(t.id)}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={() => {
                deleteHabit(index, e);
                toast.dismiss(t.id);
              }}
            >
              Delete
            </Button>
          </div>
        </div>
      ), { duration: 5000 });
    }
  };

  // Get the selected habit for history display
  const selectedHabit = showHistory ? habits.find(h => h.id === showHistory) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
    <div className="container mx-auto max-w-4xl px-4 py-8">
      {/* History Modal - Rendered outside the main component tree */}
      {showHistory && selectedHabit && selectedHabit.history && selectedHabit.history.length > 0 && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowHistory(null)}>
          <div 
            className="bg-white dark:bg-gray-800 p-6 rounded-xl max-w-md w-full max-h-[80vh] overflow-auto" 
            onClick={e => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold mb-4">{selectedHabit.name} - Streak History</h3>
            <div className="space-y-2">
              {selectedHabit.history.map((entry, i) => (
                <div key={i} className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-900 rounded">
                  <span>{new Date(entry.date).toLocaleDateString()}</span>
                  <span className="font-bold">{entry.value} days</span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-end">
              <Button variant="outline" onClick={() => setShowHistory(null)}>Close</Button>
            </div>
          </div>
        </div>
      )}
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8"
      >
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
            Habit Streak
          </h1>
          <ThemeToggle />
        </div>

        <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6 mb-8">
          <div className="flex items-center justify-center gap-4">
            <FiAward className="w-8 h-8 text-green-500" />
            <span className="text-2xl font-bold text-green-600 dark:text-green-400">
              {longestStreak} Days
            </span>
          </div>
          <p className="text-center text-green-600/80 dark:text-green-400/80 mt-2">
            Longest Streak
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Button 
            variant={selectedCategory === null ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(null)}
            className="flex items-center gap-1"
          >
            <span>All</span>
          </Button>
          
          {categories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="flex items-center gap-1"
            >
              <FiTag className="w-3 h-3" />
              <span>{category}</span>
            </Button>
          ))}
        </div>

        <div className="space-y-4 mb-8">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                className="flex-1 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 
                         bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-purple-500 
                         focus:border-transparent outline-none transition-all"
                placeholder="Add a new habit..."
                value={newHabit}
                onChange={(e) => setNewHabit(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addHabit()}
              />
              
              <div className="flex gap-2 sm:gap-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex-1 sm:min-w-24">
                      <FiTag className="mr-2 h-4 w-4" />
                      <span className="truncate">{newCategory}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {categories.map(category => (
                      <DropdownMenuItem 
                        key={category}
                        onClick={() => setNewCategory(category)}
                      >
                        {category}
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuItem onClick={() => setShowCategoryDialog(true)}>
                      + Add New Category
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                
                <button
                  onClick={addHabit}
                  className="flex-1 sm:flex-none px-4 sm:px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 
                           hover:to-blue-600 text-white rounded-xl transition-all duration-200 
                           flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20"
                >
                  <FiPlus className="w-5 h-5" />
                  <span className="sm:hidden">Add</span>
                  <span className="hidden sm:inline">Add Habit</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {filteredHabits.map((habit, index) => (
            <motion.div
              key={habit.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.02 }}
              className="group relative bg-gray-50 dark:bg-gray-900 rounded-xl 
                       hover:shadow-lg transition-all duration-200 border border-gray-100 
                       dark:border-gray-700 p-4 sm:p-6"
            >
              <div
                onClick={() => incrementStreak(habits.findIndex(h => h.id === habit.id))}
                className="p-6 cursor-pointer"
              >
                
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold">{habit.name}</h3>
                    <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                      <FiTag className="w-3 h-3" /> {habit.category}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowHistory(habit.id);
                      }}
                      className="sm:opacity-0 sm:group-hover:opacity-100 p-2 hover:bg-blue-100 
                               dark:hover:bg-blue-900/30 rounded-lg transition-all duration-200"
                      title="View History"
                    >
                      <FiBarChart2 className="w-5 h-5 text-blue-500" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toast((t) => (
                          <div className="flex flex-col gap-2">
                            <p>Reset streak for <strong>{habit.name}</strong> to zero?</p>
                            <div className="flex gap-2 justify-end">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => toast.dismiss(t.id)}
                              >
                                Cancel
                              </Button>
                              <Button 
                                variant="destructive" 
                                size="sm" 
                                onClick={() => {
                                  resetStreak(habit.id);
                                  toast.dismiss(t.id);
                                }}
                              >
                                Reset
                              </Button>
                            </div>
                          </div>
                        ), { duration: 5000 });
                      }}
                      className="sm:opacity-0 sm:group-hover:opacity-100 p-2 hover:bg-yellow-100 
                               dark:hover:bg-yellow-900/30 rounded-lg transition-all duration-200"
                      title="Reset Streak"
                    >
                      <FiRefreshCw className="w-5 h-5 text-yellow-500" />
                    </button>
                    <button
                      onClick={(e) => confirmDelete(habits.findIndex(h => h.id === habit.id), e)}
                      className="sm:opacity-0 sm:group-hover:opacity-100 p-2 hover:bg-red-100 
                               dark:hover:bg-red-900/30 rounded-lg transition-all duration-200"
                      title="Delete Habit"
                    >
                      <FiTrash2 className="w-5 h-5 text-red-500" />
                    </button>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <FireIcon className={`w-5 h-5 ${habit.streak > 0 ? 'text-orange-500' : 'text-gray-400'}`} />
                  <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                    {habit.streak}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400">days</span>
                  {habit.lastUpdated && (
                    <span className="text-xs text-gray-400 ml-auto">
                      Updated: {new Date(habit.lastUpdated).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
      {/* Add Category Dialog */}
      {showCategoryDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowCategoryDialog(false)}>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-lg shadow-xl" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-semibold mb-4">Add New Category</h2>
            <input
              type="text"
              className="flex-1 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all w-full mb-4"
              placeholder="Enter category name..."
              value={newCategoryInput}
              onChange={(e) => setNewCategoryInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && newCategoryInput.trim()) {
                  addCategory(newCategoryInput.trim());
                }
              }}
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setNewCategoryInput("");
                  setShowCategoryDialog(false);
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  if (newCategoryInput.trim()) {
                    addCategory(newCategoryInput.trim());
                  }
                }}
                disabled={!newCategoryInput.trim()}
              >
                Add Category
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
  );
}
