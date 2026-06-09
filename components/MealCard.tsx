
import React from 'react';
import { Meal, FoodItem } from '../types';

interface MealCardProps {
  meal: Meal;
  title?: string;
  isHero?: boolean;
  isVegOnly: boolean;
}

const FoodItemRow: React.FC<{ item: FoodItem; isVegOnly: boolean }> = ({ item, isVegOnly }) => {
  // If Veg Only is on, hide anything that isn't explicitly veg (including eggs)
  if (isVegOnly && !item.isVeg) return null;

  const isVeg = item.isVeg;
  
  // Strict 2-color system: Green for Veg, Red for Non-Veg (including Eggs)
  let borderColor = isVeg ? 'border-green-600' : 'border-red-700';
  let dotColor = isVeg ? 'bg-green-600' : 'bg-red-700';

  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-dashed border-gray-100 last:border-0 group">
      <div className={`mt-1 relative flex-shrink-0 h-4 w-4 rounded-[2px] border-[1.5px] ${borderColor} flex items-center justify-center shadow-sm`}>
        <div className={`h-2 w-2 rounded-full ${dotColor}`}></div>
      </div>
      <span className="text-gray-700 group-hover:text-gray-900 transition-colors font-medium text-[15px] leading-snug">
        {item.name}
      </span>
    </div>
  );
};

export const MealCard: React.FC<MealCardProps> = ({ meal, title, isHero = false, isVegOnly }) => {
  const hasItems = meal.items.some(i => !isVegOnly || i.isVeg);

  return (
    <div className={`relative overflow-hidden transition-all duration-300 
      ${isHero 
        ? 'bg-white shadow-xl shadow-orange-500/10 rounded-3xl border border-orange-100 ring-1 ring-orange-50' 
        : 'bg-white shadow-sm hover:shadow-md rounded-2xl border border-gray-100'
      }`}
    >
      {isHero && (
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-orange-400 via-red-500 to-orange-400"></div>
      )}
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-5">
          <div>
            <h3 className={`${isHero ? 'text-2xl text-gray-900' : 'text-lg text-gray-800'} font-bold tracking-tight mb-1`}>
              {title || meal.type}
            </h3>
            <div className="flex items-center gap-1.5 text-gray-500 font-medium bg-gray-50 px-2 py-0.5 rounded-md w-fit">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 opacity-60">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z" clipRule="evenodd" />
              </svg>
              <span className="text-xs uppercase tracking-wide">{meal.startTime} - {meal.endTime}</span>
            </div>
          </div>
          <div className={`h-12 w-12 rounded-2xl flex items-center justify-center shadow-inner ${isHero ? 'bg-orange-50 text-2xl' : 'bg-gray-50 text-xl'}`}>
             {meal.type === 'Breakfast' && '🍳'}
             {meal.type === 'Lunch' && '🍛'}
             {meal.type === 'Snacks' && '☕'}
             {meal.type === 'Dinner' && '🥘'}
          </div>
        </div>

        <div className="space-y-0.5">
          {hasItems ? (
            meal.items.map((item, idx) => (
              <FoodItemRow key={idx} item={item} isVegOnly={isVegOnly} />
            ))
          ) : (
            <div className="py-8 text-center bg-stone-50/50 rounded-2xl border border-stone-100 border-dashed">
                <p className="text-gray-400 text-sm font-bold uppercase tracking-widest px-4">Veg-Only mode active: Items Hidden</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
