// utils/slugify.js
export const slugify = (text) => {
  return text
    .toString() // Convert to string
    .toLowerCase() // Convert to lowercase
    .trim() // Remove whitespace from both ends
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/[^\w\-]+/g, "") // Remove all non-word characters (except hyphens)
    .replace(/\-\-+/g, "-"); // Replace multiple hyphens with a single hyphen
};
