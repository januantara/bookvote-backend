import z from "zod";

export const BookCategory = z.enum([
    "Novel",
    "Technology",
    "Management",
    "Accounting",
    "Communication",
    "Design",
    "Psychology"
], "Kategori buku tidak valid");

export const AddBookSchema = z.object({
    title: z.string().min(1, "Mohon isikan title terlebih dahulu"),
    author: z.string().min(1, "Mohon isikan author terlebih dahulu"),
    category: BookCategory,
    color: z.string().min(1, "Mohon isikan color terlebih dahulu"),
    imageUrl: z.string().min(1, "Mohon isikan url gambar cover buku terlebih dahulu"),
    requestedBy: z.string().min(1, "User ID dibutuhkan untuk request buku"),
    description: z.string().min(1, "Mohon isikan deskripsi buku terlebih dahulu")
})

export type AddBookDataProps = z.infer<typeof AddBookSchema>;