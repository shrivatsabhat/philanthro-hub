import { create } from 'zustand';

interface SearchState {
  searchQuery: string;
  selectedCategories: string[];
  setSearchQuery: (query: string) => void;
  setSelectedCategories: (categories: string[]) => void;
  toggleCategory: (category: string) => void;
}

export const useSearchStore = create<SearchState>((set) => ({
  searchQuery: '',
  selectedCategories: [],
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedCategories: (categories) => set({ selectedCategories: categories }),
  toggleCategory: (category) =>
    set((state) => {
      const isSelected = state.selectedCategories.includes(category);
      return {
        selectedCategories: isSelected
          ? state.selectedCategories.filter((c) => c !== category)
          : [...state.selectedCategories, category],
      };
    }),
}));
