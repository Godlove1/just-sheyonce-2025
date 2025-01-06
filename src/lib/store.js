import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useStore = create(
  persist(
    (set, get) => ({
      adminUser: null,
      selectedCategoryImage: null,
      setSelectedCategoryImage: (image) => set({ selectedCategoryImage: image }),
      setAdminUser: (user) => set({ adminUser: user }),
      cart: [],
      selectedCategory: "1",
      isMenuOpen: false,
      isMiniCartOpen: false,
      searchQuery: "",
      error: null,
      addToCart: (product, quantity, selectedSize) => {
        const cart = get().cart;
        const existingItem = cart.find(
          (item) =>
            item.id === product.id && item.selectedSize === selectedSize
        );

        if (existingItem) {
          set({
            cart: cart.map((item) =>
              item.id === product.id && item.selectedSize === selectedSize
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
          });
        } else {
          set({
            cart: [...cart, { ...product, quantity, selectedSize }],
          });
        }
      },

      removeFromCart: (productId, selectedSize) => {
        set({
          cart: get().cart.filter(
            (item) =>
              !(item.id === productId && item.selectedSize === selectedSize)
          ),
        });
      },

      updateQuantity: (productId, selectedSize, quantity) => {
        set({
          cart: get().cart.map((item) =>
            item.id === productId && item.selectedSize === selectedSize
              ? { ...item, quantity }
              : item
          ),
        });
      },

      setSelectedCategory: (category) => set({ selectedCategory: category }),
      setMenuOpen: (isOpen) => set({ isMenuOpen: isOpen }),
      setMiniCartOpen: (isOpen) => set({ isMiniCartOpen: isOpen }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      clearCart: () => set({ cart: [] }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),
    }),
    {
      name: "shopping-cart",
    }
  )
);
