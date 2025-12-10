import z from "zod";

export const BookCategory = z.enum([
    "Novel",
    "Technology",
    "Management",
    "Accounting",
    "Communication",
    "Design",
    "Psychology"
], "Invalid book category");

export const AddBookSchema = z.object({
    title: z.string().min(1, "Book title is required"),
    author: z.string().min(1, "Author name is required"),
    category: BookCategory,
    color: z.string().min(1, "Color is required"),
    imageUrl: z.string().min(1, "Book cover image URL is required"),
    requestedBy: z.string().min(1, "User ID is required"),
    description: z.string().min(1, "Book description is required")
})

export type AddBookDataProps = z.infer<typeof AddBookSchema>;
export type BookCategoryProps = z.infer<typeof BookCategory>;