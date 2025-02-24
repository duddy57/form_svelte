CREATE TABLE "client" (
	"id" serial PRIMARY KEY NOT NULL,
	"full_name" text NOT NULL,
	"short_name" text NOT NULL,
	CONSTRAINT "client_full_name_unique" UNIQUE("full_name"),
	CONSTRAINT "client_short_name_unique" UNIQUE("short_name")
);
--> statement-breakpoint
CREATE TABLE "cvs" (
	"id" serial PRIMARY KEY NOT NULL,
	"create_date" date DEFAULT now() NOT NULL,
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
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"expires_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"name" text,
	"ramal" integer,
	"password_hash" text NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email"),
	CONSTRAINT "user_ramal_unique" UNIQUE("ramal")
);
--> statement-breakpoint
ALTER TABLE "cvs" ADD CONSTRAINT "cvs_tecnico_forms_user_id_fk" FOREIGN KEY ("tecnico_forms") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;