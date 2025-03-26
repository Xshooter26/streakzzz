"use client";

import { useEffect, useState } from "react";
import { getHabits, saveHabits, getLongestStreak, updateLongestStreak } from "./utils/storage";
import { ThemeToggle } from "./ThemeToggle";
import { FiAward, FiPlus, FiTrash2 } from "react-icons/fi";
import { FireIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

export default function Home() {
  const [habits, setHabits] = useState<{ name: string; streak: number }[]>([]);
  const [newHabit, setNewHabit] = useState("");
  const [longestStreak, setLongestStreak] = useState(0);

  useEffect(() => {
    setHabits(getHabits());
    setLongestStreak(getLongestStreak());
  }, []);

  const addHabit = () => {
    if (!newHabit.trim()) return;
    const updatedHabits = [...habits, { name: newHabit, streak: 0 }];
    setHabits(updatedHabits);
    saveHabits(updatedHabits);
    setNewHabit("");
  };

  const incrementStreak = (index: number) => {
    const updatedHabits = [...habits];
    updatedHabits[index].streak += 1;
    setHabits(updatedHabits);
    saveHabits(updatedHabits);

    updateLongestStreak(updatedHabits[index].streak);
    setLongestStreak(getLongestStreak());
  };

  const deleteHabit = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const updatedHabits = habits.filter((_, i) => i !== index);
    setHabits(updatedHabits);
    saveHabits(updatedHabits);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
    <div className="container mx-auto max-w-4xl px-4 py-8">
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

        <div className="space-y-4 mb-8">
          <div className="flex gap-4">
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
            <button
              onClick={addHabit}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 
                       hover:to-blue-600 text-white rounded-xl transition-all duration-200 
                       flex items-center gap-2 shadow-lg shadow-purple-500/20"
            >
              <FiPlus className="w-5 h-5" />
              <span className="hidden md:inline">Add Habit</span>
            </button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {habits.map((habit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.02 }}
              className="group relative bg-gray-50 dark:bg-gray-900 rounded-xl 
                       hover:shadow-lg transition-all duration-200 border border-gray-100 
                       dark:border-gray-700"
            >
              <div
                onClick={() => incrementStreak(index)}
                className="p-6 cursor-pointer"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">{habit.name}</h3>
                  <button
                    onClick={(e) => deleteHabit(index, e)}
                    className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-100 
                             dark:hover:bg-red-900/30 rounded-lg transition-all duration-200"
                  >
                    <FiTrash2 className="w-5 h-5 text-red-500" />
                  </button>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <FireIcon className={`w-5 h-5 ${habit.streak > 0 ? 'text-orange-500' : 'text-gray-400'}`} />
                  <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                    {habit.streak}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400">days</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  </div>
  );
}
