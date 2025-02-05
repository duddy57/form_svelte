import { pgTable, serial, text, integer, timestamp, date } from 'drizzle-orm/pg-core';

export const cvs = pgTable('cvs', {
	id: serial('id').primaryKey(),
	create_date: date('create_date').notNull().default(new Date().toISOString()),
	form_date: date('form_date').notNull(),
	tecnico_forms: text('tecnico_forms').notNull(),
	tecnico_os: text('tecnico_os').notNull(),
	cliente: text('cliente').notNull(),
	solicitante: text('solicitante').notNull(),
	necessario_tecnico: text('necessario_tecnico').notNull(),
	dificuldade_os: text("dificuldade_os").notNull(),
	defeito: text('defeito').notNull(),
	solucao: text('solucao').notNull(),
	procedimento: text('procedimento').notNull(),
});
