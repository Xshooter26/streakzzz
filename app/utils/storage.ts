export function getHabits() {
    if (typeof window === "undefined") return [];
    return JSON.parse(localStorage.getItem("habits") || "[]");
  }
  
  export function saveHabits(habits: any[]) {
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
  