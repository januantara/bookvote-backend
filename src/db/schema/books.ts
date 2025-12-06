import {
    boolean,
    integer,
    pgEnum,
    pgTable,
    serial,
    text,
    timestamp,
    uuid
} from "drizzle-orm/pg-core";
import { users } from "./users";

// Book Genre Enum
export const bookCategoryEnum = pgEnum("book_category", [
    "Novel",
    "Technology",
    "Management",
    "Accounting",
    "Communication",
    "Design",
    "Psychology",
]);

// Books Table
export const books = pgTable("books", {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    imageUrl: text("image_url").notNull(),
    author: text("author").notNull(),
    description: text("description").notNull(),
    category: bookCategoryEnum("category").notNull(),
    isPurchased: boolean("is_purchased").default(false).notNull(),
    purchasedAt: timestamp("purchased_at"),
    voteCount: integer("vote_count").default(0),
    color: text("color").notNull(),
    shelfPosition: text("shelf_position"),
    requestedBy: uuid("requested_by")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
})
