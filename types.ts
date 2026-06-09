
export enum MealType {
  Breakfast = 'Breakfast',
  Lunch = 'Lunch',
  Snacks = 'Snacks',
  Dinner = 'Dinner'
}

export interface FoodItem {
  name: string;
  isVeg: boolean;
  containsEgg?: boolean;
}

export interface Meal {
  type: MealType;
  items: FoodItem[];
  startTime: string; // HH:MM 24h format
  endTime: string;   // HH:MM 24h format
}

export interface DayMenu {
  day: string; // Monday, Tuesday, etc.
  meals: {
    [key in MealType]: Meal;
  };
}

export interface WeekMenu {
  days: DayMenu[];
}

export interface FacilityShift {
  name: string;
  startTime: string; // HH:MM
  endTime: string;   // HH:MM
  activeDays: number[]; // 0=Sun, 1=Mon, ..., 6=Sat
  displayTime: string; // e.g. "8 AM to 10 AM"
}

export interface Facility {
  id: string;
  name: string;
  icon: string;
  timings: string;
  imageUrl: string;
  color: string;
  startTime: string; // Default/Primary start
  endTime: string;   // Default/Primary end
  activeDays?: number[];
  shifts?: FacilityShift[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  url: string;
  pin: string;
  icon: string;
  color: string;
}
