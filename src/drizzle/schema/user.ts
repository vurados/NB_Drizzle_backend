import { sql, relations } from "drizzle-orm";
import { int, text, sqliteTable } from "drizzle-orm/sqlite-core";
import { collections } from "./collection";


export type User = {
    id: number;
    username?: string;
    email?: string;
    password?: string;
    salt?: string;
    createdAt?: string;
}

export const users = sqliteTable("user", {
    id: int("id").primaryKey({ autoIncrement: true }).unique().notNull(),
    username: text('username').notNull(),
    email: text('email').unique().notNull(),
    password: text('password').notNull(),
    salt: text('salt').notNull(),
    createdAt: text("createdAt").default(sql`CURRENT_TIMESTAMP`)
})

export const userCollectionRelation = relations(users, ({many}) => ({
    collection: many(collections)
}))