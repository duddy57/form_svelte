import type { PageServerLoad, Actions } from "./$types";
import * as auth from '$lib/server/lucia';
import { superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { cvsSchema } from "$lib/schema";
import { db } from "$lib/server/db";
import { cvs, client } from "$lib/server/db/schema";
import { fail, redirect } from "@sveltejs/kit";

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		return redirect(302, '/auth');
	}

    return {
        client: await db.select().from(client),
        form: await superValidate(zod(cvsSchema)),
		user: event.locals.user
    };
};

export const actions: Actions = {
    create: async (event) => {
		if (!event.locals.user) {
			return redirect(302, '/auth');
		}

        const form = await superValidate(event, zod(cvsSchema))
        if (!form.valid) {
            return fail(400, {
                form
            })
        }

        function formatarData(data: boolean) {
            return data ? "Sim" : "Nao"
        }

        function formatarDificuldade(data: number) {
            if (data === 0) {
                return "Simples"
            } else if (data === 50) {
                return "Intermediaria"
            } else {
                return "Dificil"
            }
        }

        await db.insert(cvs).values({
            ...form.data,
			tecnico_forms: event.locals.user.email,
            necessario_tecnico: formatarData(form.data.necessario_tecnico),
            dificuldade_os: formatarDificuldade(form.data.dificuldade_os)
        })

        return {
            form
        }
    },

    logout: async (event) => {
		if (!event.locals.session) {
			return fail(401);
		}
		await auth.invalidateSession(event.locals.session.id);
		auth.deleteSessionTokenCookie(event);

		return redirect(302, '/auth');
	},
}