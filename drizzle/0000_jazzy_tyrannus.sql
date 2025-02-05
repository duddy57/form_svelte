CREATE TABLE "cvs" (
	"id" serial PRIMARY KEY NOT NULL,
	"create_date" date DEFAULT '2025-02-04T23:14:49.775Z' NOT NULL,
	"form_date" date NOT NULL,
	"tecnico_forms" text NOT NULL,
	"tecnico_os" text NOT NULL,
	"cliente" text NOT NULL,
	"solicitante" text NOT NULL,
	"necessario_tecnico" text NOT NULL,
	"dificuldade_os" text NOT NULL,
	"defeito" text NOT NULL,
	"solucao" text NOT NULL,
	"procedimento" text NOT NULL
);
