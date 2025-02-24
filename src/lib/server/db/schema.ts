import { pgTable, serial, text, integer,timestamp, date } from 'drizzle-orm/pg-core';
import { createId } from '@paralleldrive/cuid2'

export const cvs = pgTable('cvs', {
	id: serial('id').primaryKey(),
	create_date: date('create_date').defaultNow().notNull(),
	form_date: date('form_date').notNull(),
	tecnico_forms: text('tecnico_forms').notNull().references(() => user.email),
	tecnico_os: text('tecnico_os').notNull().array(1),
	cliente: text('cliente').notNull(),
	solicitante: text('solicitante').notNull(),
	necessario_tecnico: text('necessario_tecnico').notNull(),
	dificuldade_os: text("dificuldade_os").notNull(),
	defeito: text('defeito').notNull(),
	solucao: text('solucao').notNull(),
	procedimento: text('procedimento').notNull(),
});

export const user = pgTable('user', {
    id: text('id').primaryKey().$defaultFn(() => createId()),
    email: text('email').notNull().unique(),
	name: text('name'),
	ramal: integer('ramal').unique(),
    passwordHash: text('password_hash').notNull(),
	role: text("role").notNull()
});

export const session = pgTable("session", {
    id: text('id').primaryKey(),
    userId: text('user_id').notNull().references(() => user.id),
    expiresAt: timestamp('expires_at').notNull()
});

export const client = pgTable("client", {
	id: serial('id').primaryKey(),
	full_name: text('full_name').notNull().unique(),
	short_name: text('short_name').notNull().unique(),
})

export type Session = typeof session.$inferSelect;

export type User = typeof user.$inferSelect;
