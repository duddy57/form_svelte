ALTER TABLE "cvs" DROP CONSTRAINT "cvs_tecnico_forms_user_id_fk";
--> statement-breakpoint
ALTER TABLE "cvs" ADD CONSTRAINT "cvs_tecnico_forms_user_email_fk" FOREIGN KEY ("tecnico_forms") REFERENCES "public"."user"("email") ON DELETE no action ON UPDATE no action;