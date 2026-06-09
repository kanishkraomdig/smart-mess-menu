
import { WeekMenu, MealType, Facility, Project } from './types';

/**
 * MENU UPDATED: March 2026
 * Source: Official Mess Schedule
 */

const v = (name: string) => ({ name, isVeg: true });
const nv = (name: string) => ({ name, isVeg: false });
const egg = (name: string) => ({ name, isVeg: false, containsEgg: true });

export const DEFAULT_MENU: WeekMenu = {
  days: [
    {
      day: 'Monday',
      meals: {
        [MealType.Breakfast]: { type: MealType.Breakfast, startTime: '08:00', endTime: '10:00', items: [v('Aloo Pyaaz Stuffed Paratha'), v('Curd'), v('Green Chutney'), egg('Boiled Eggs'), v('Fruits')] },
        [MealType.Lunch]: { type: MealType.Lunch, startTime: '13:00', endTime: '14:30', items: [v('Kadhi Pakoda'), v('Mix Veg'), v('Plain Rice'), v('Roti'), v('Lassi')] },
        [MealType.Snacks]: { type: MealType.Snacks, startTime: '17:00', endTime: '18:00', items: [v('Pyaaz Kachori'), v('Green Chutney'), v('Sweet Chutney')] },
        [MealType.Dinner]: { type: MealType.Dinner, startTime: '20:00', endTime: '21:30', items: [nv('Butter Chicken'), v('Kadhai Paneer'), v('Dal Fry'), v('Onion Rice'), v('Roti'), v('Ice Cream')] }
      }
    },
    {
      day: 'Tuesday',
      meals: {
        [MealType.Breakfast]: { type: MealType.Breakfast, startTime: '08:00', endTime: '10:00', items: [v('Vada'), v('Sambhar'), v('Coconut Chutney'), egg('French Toast')] },
        [MealType.Lunch]: { type: MealType.Lunch, startTime: '13:00', endTime: '14:30', items: [v('Matar Kulche'), v('Crispy Corn'), v('Plain Rice'), v('Pudina Chaach'), v('Fruits')] },
        [MealType.Snacks]: { type: MealType.Snacks, startTime: '17:00', endTime: '18:00', items: [v('Honey Chilli Potato')] },
        [MealType.Dinner]: { type: MealType.Dinner, startTime: '20:00', endTime: '21:30', items: [v('Fried Rice'), v('Veg Manchurian'), v('Tadke Wali Dal'), v('Roti'), v('Kheer')] }
      }
    },
    {
      day: 'Wednesday',
      meals: {
        [MealType.Breakfast]: { type: MealType.Breakfast, startTime: '08:00', endTime: '10:00', items: [v('Poha'), v('Sev/Aloo Sev'), egg('Bread Omellete'), v('Fruits')] },
        [MealType.Lunch]: { type: MealType.Lunch, startTime: '13:00', endTime: '14:30', items: [v('Rajma'), v('Aloo Jeera'), v('Jeera Rice'), v('Roti'), v('Curd')] },
        [MealType.Snacks]: { type: MealType.Snacks, startTime: '17:00', endTime: '18:00', items: [v('Veg Macaroni')] },
        [MealType.Dinner]: { type: MealType.Dinner, startTime: '20:00', endTime: '21:30', items: [nv('Chicken Biryani'), v('Veg Biryani'), v('Butter Paneer Masala'), v('Roti'), v('Pyaaz Raita'), v('Gulab Jamun')] }
      }
    },
    {
      day: 'Thursday',
      meals: {
        [MealType.Breakfast]: { type: MealType.Breakfast, startTime: '08:00', endTime: '10:00', items: [v('Paneer Mix Stuffed Paratha'), v('Green Chutney'), v('Curd'), egg('Scrambled Eggs')] },
        [MealType.Lunch]: { type: MealType.Lunch, startTime: '13:00', endTime: '14:30', items: [v('Black Chana Gravy'), v('Lauki Ki Sabzi'), v('Onion Rice'), v('Roti'), v('Boondi Raita'), v('Fruits')] },
        [MealType.Snacks]: { type: MealType.Snacks, startTime: '17:00', endTime: '18:00', items: [v('Bread Pakoda'), v('Green Chutney'), v('Sweet Chutney')] },
        [MealType.Dinner]: { type: MealType.Dinner, startTime: '20:00', endTime: '21:30', items: [v('Soya Chunks Masala'), v('Masoor Dal'), v('Jeera Rice'), v('Roti'), v('Ice Cream')] }
      }
    },
    {
      day: 'Friday',
      meals: {
        [MealType.Breakfast]: { type: MealType.Breakfast, startTime: '08:00', endTime: '10:00', items: [v('Masala Dosa'), v('Sambhar'), v('Coconut Chutney'), v('Fruits')] },
        [MealType.Lunch]: { type: MealType.Lunch, startTime: '13:00', endTime: '14:30', items: [v('Gobi Masala'), v('Dal Makhni'), v('Jeera Rice'), v('Roti'), v('Pineapple Lassi')] },
        [MealType.Snacks]: { type: MealType.Snacks, startTime: '17:00', endTime: '18:00', items: [v('Samosa'), v('Matar'), v('Green Chutney'), v('Sweet Chutney')] },
        [MealType.Dinner]: { type: MealType.Dinner, startTime: '20:00', endTime: '21:30', items: [v('Paneer Do Pyaaza'), nv('Mutton Roganjosh / Kadhai Chicken'), v('Arhar Dal'), v('Plain Rice'), v('Roti'), v('Cucumber Raita'), v('Moong Dal Halwa')] }
      }
    },
    {
      day: 'Saturday',
      meals: {
        [MealType.Breakfast]: { type: MealType.Breakfast, startTime: '08:00', endTime: '10:00', items: [v('Thepla'), v('Tomato Chutney'), egg('French Toast')] },
        [MealType.Lunch]: { type: MealType.Lunch, startTime: '13:00', endTime: '14:30', items: [v('Chole Bhature'), v('French Fries'), v('Boondi Raita'), v('Fruits')] },
        [MealType.Snacks]: { type: MealType.Snacks, startTime: '17:00', endTime: '18:00', items: [v('Masala Idli')] },
        [MealType.Dinner]: { type: MealType.Dinner, startTime: '20:00', endTime: '21:30', items: [v('Gatte Ki Sabzi'), v('Khichidi'), v('Roti'), v('Curd'), v('Jalebi')] }
      }
    },
    {
      day: 'Sunday',
      meals: {
        [MealType.Breakfast]: { type: MealType.Breakfast, startTime: '08:00', endTime: '10:00', items: [v('Namkeen Sevayi/Aloo Sandwich'), egg('Egg Bhurji')] },
        [MealType.Lunch]: { type: MealType.Lunch, startTime: '13:00', endTime: '14:30', items: [v('Aloo Bhaji'), v('Chana Dal'), v('Veg Pulao'), v('Poori'), v('Chaach'), v('Fruits')] },
        [MealType.Snacks]: { type: MealType.Snacks, startTime: '17:00', endTime: '18:00', items: [v('Pani Puri')] },
        [MealType.Dinner]: { type: MealType.Dinner, startTime: '20:00', endTime: '21:30', items: [egg('Egg Curry'), v('Malai Kofta'), v('Moong Dal'), v('Jeera Rice'), v('Roti'), v('Fruit Custard')] }
      }
    }
  ]
};

export const DEFAULT_FACILITIES: Facility[] = [
  {
    id: 'doctor',
    name: 'Medical Center',
    icon: '🩺',
    timings: 'Morning & Evening Slots',
    startTime: '08:00',
    endTime: '19:00',
    imageUrl: 'https://ik.imagekit.io/p73ztdiqr3/Menu/Doctor%20timing.jpg',
    color: 'bg-blue-600 text-white',
    shifts: [
      {
        name: 'Gynaecologist',
        startTime: '08:00',
        endTime: '10:00',
        activeDays: [1, 2, 3, 4, 5, 6],
        displayTime: '8 AM to 10 AM'
      },
      {
        name: 'General Physician',
        startTime: '17:00',
        endTime: '19:00',
        activeDays: [1, 2, 3, 4, 5, 6],
        displayTime: '5 PM to 7 PM'
      },
      {
        name: 'Psychologist & Psychotherapist',
        startTime: '17:00',
        endTime: '19:00',
        activeDays: [1, 2, 4, 5, 6],
        displayTime: '5 PM to 7 PM'
      }
    ]
  },
  {
    id: 'gym',
    name: 'Campus Gym',
    icon: '💪',
    timings: '05:00 - 14:00, 16:00 - 02:00',
    startTime: '05:00',
    endTime: '02:00',
    activeDays: [0, 1, 2, 3, 4, 5, 6],
    imageUrl: 'https://ik.imagekit.io/p73ztdiqr3/Menu/Gym%20timing.jpg',
    color: 'bg-slate-100 text-slate-700',
    shifts: [
        { name: 'Open for All', startTime: '05:00', endTime: '14:00', activeDays: [0,1,2,3,4,5,6], displayTime: '5 AM - 2 PM' },
        { name: 'Ladies Only', startTime: '16:00', endTime: '17:00', activeDays: [0,1,2,3,4,5,6], displayTime: '4 PM - 5 PM' },
        { name: 'Open for All', startTime: '17:00', endTime: '02:00', activeDays: [0,1,2,3,4,5,6], displayTime: '5 PM - 2 AM' },
        { name: 'Coach Available', startTime: '16:00', endTime: '17:00', activeDays: [1,2,3,4,5], displayTime: '4 PM - 5 PM' },
        { name: 'Coach Available', startTime: '18:00', endTime: '20:00', activeDays: [1,2,3,4,5], displayTime: '6 PM - 8 PM' }
    ]
  },
  {
    id: 'library',
    name: 'Main Library',
    icon: '📚',
    timings: 'Daily (See Slots)',
    startTime: '00:00',
    endTime: '23:59',
    activeDays: [0, 1, 2, 3, 4, 5, 6],
    imageUrl: 'https://ik.imagekit.io/p73ztdiqr3/Menu/library.png',
    color: 'bg-amber-50 text-amber-800',
    shifts: [
      { name: 'Newspaper Reading Room', startTime: '00:00', endTime: '23:59', activeDays: [0,1,2,3,4,5,6], displayTime: '24 x 7' },
      { name: 'Library', startTime: '09:00', endTime: '02:00', activeDays: [1,2,3,4,5], displayTime: '9 AM - 2 AM' },
      { name: 'Library', startTime: '09:00', endTime: '00:00', activeDays: [0,6], displayTime: '9 AM - 12 PM' }
    ]
  }
];

export const PROJECTS: Project[] = [
/*  {
    id: 'casepilot',
    name: 'CasePilot AI',
    description: "I'm building this AI tool for consulting/product case prep. This is an early beta for the batch - try it out and let me know what you think!",
    url: 'https://case-pilot-509739024573.us-west1.run.app',
    pin: 'CasePilot2024',
    icon: '✨',
    color: 'from-orange-500 to-indigo-800'
  }*/
];
