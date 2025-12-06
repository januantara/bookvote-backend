CREATE TYPE "public"."book_category" AS ENUM('Novel', 'Technology', 'Management', 'Accounting', 'Communication', 'Design', 'Psychology');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('staff', 'voter');--> statement-breakpoint
CREATE TABLE "refresh_tokens" (
	"id" serial PRIMARY KEY NOT NULL,
	"token" text NOT NULL,
	"user_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"expires_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "books" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"image_url" text NOT NULL,
	"author" text NOT NULL,
	"description" text NOT NULL,
	"category" "book_category" NOT NULL,
	"is_purchased" boolean DEFAULT false NOT NULL,
	"purchased_at" timestamp,
	"vote_count" integer DEFAULT 0,
	"color" text NOT NULL,
	"shelf_position" text,
	"requested_by" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"fullname" text NOT NULL,
	"email" varchar NOT NULL,
	"password_hash" text NOT NULL,
	"nim" varchar NOT NULL,
	"role" "user_role" DEFAULT 'voter' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_nim_unique" UNIQUE("nim")
);
--> statement-breakpoint
CREATE TABLE "vote_history" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"book_id" integer NOT NULL,
	"voted_at" timestamp DEFAULT now(),
	CONSTRAINT "vote_history_user_id_book_id_unique" UNIQUE("user_id","book_id")
);
--> statement-breakpoint
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "books" ADD CONSTRAINT "books_requested_by_users_id_fk" FOREIGN KEY ("requested_by") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vote_history" ADD CONSTRAINT "vote_history_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vote_history" ADD CONSTRAINT "vote_history_book_id_books_id_fk" FOREIGN KEY ("book_id") REFERENCES "public"."books"("id") ON DELETE cascade ON UPDATE no action;