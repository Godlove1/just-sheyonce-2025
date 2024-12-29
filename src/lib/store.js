import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useStore = create(
  persist(
    (set, get) => ({
      adminUser : null,
      setAdminUser: (user) => set({ adminUser: user }),
      cart: [],
      selectedCategory: "all",
      isMenuOpen: false,
      isMiniCartOpen: false,
      searchQuery: "",
      error: null,
      products: [
        {
          id: 1,
          name: "Basic round tee",
          price: 40.0,
          image: "/1.jpg",
          category: "tees",
          isNew: true,
          description:
            "A comfortable and versatile basic round neck tee, perfect for everyday wear.",
        },
        {
          id: 2,
          name: "Half shirts",
          price: 56.0,
          image: "/2.jpg",
          category: "shirts",
          description:
            "Stylish half shirts that offer a perfect balance between casual and formal.",
        },
        {
          id: 3,
          name: "Face shirts",
          price: 60.0,
          image: "/3.jpg",
          category: "shirts",
          isNew: true,
          description:
            "Unique face-printed shirts that make a bold fashion statement.",
        },
        {
          id: 4,
          name: "Green shirts",
          price: 68.0,
          image: "/4.jpg",
          category: "shirts",
          description:
            "Vibrant green shirts that add a pop of color to your wardrobe.",
        },
        {
          id: 5,
          name: "Check shirts",
          price: 72.0,
          image: "/5.jpg",
          category: "shirts",
          description:
            "Classic check pattern shirts suitable for both casual and semi-formal occasions.",
        },
        {
          id: 6,
          name: "Skinny Jeans",
          price: 88.0,
          image: "/6.jpg",
          category: "jeans",
          description:
            "Form-fitting skinny jeans that accentuate your silhouette.",
        },
        {
          id: 7,
          name: "Straight jeans",
          price: 90.0,
          image: "/7.jpg",
          category: "jeans",
          description:
            "Timeless straight-cut jeans that offer comfort and style.",
        },
        {
          id: 8,
          name: "Damaged jeans",
          price: 75.0,
          image: "/8.jpg",
          category: "jeans",
          isNew: true,
          description:
            "Trendy damaged jeans with a distressed look for an edgy style.",
        },
      ],
      addToCart: (product, quantity, selectedColor) => {
        const cart = get().cart;
        const existingItem = cart.find(
          (item) =>
            item.id === product.id && item.selectedColor === selectedColor
        );

        if (existingItem) {
          set({
            cart: cart.map((item) =>
              item.id === product.id && item.selectedColor === selectedColor
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
          });
        } else {
          set({
            cart: [...cart, { ...product, quantity, selectedColor }],
          });
        }
      },

      removeFromCart: (productId, selectedColor) => {
        set({
          cart: get().cart.filter(
            (item) =>
              !(item.id === productId && item.selectedColor === selectedColor)
          ),
        });
      },

      updateQuantity: (productId, selectedColor, quantity) => {
        set({
          cart: get().cart.map((item) =>
            item.id === productId && item.selectedColor === selectedColor
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
