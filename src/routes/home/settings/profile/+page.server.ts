import type { PageServerLoad, Actions } from "./$types"
import { eq } from 'drizzle-orm';
import { hash } from '@node-rs/argon2';
import { superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { registeSchema } from "$lib/schema";
import { db } from "$lib/server/db";
import { user, client } from "$lib/server/db/schema";
import { fail, redirect } from "@sveltejs/kit";

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		return redirect(302, '/auth');
	}

    return {
        client: await db.select().from(client),
        form: await superValidate(zod(registeSchema)),
		user: event.locals.user
    };
};

export const actions: Actions = {
    add_user: async (event) => {
        const form = await superValidate(event, zod(registeSchema))
        console.log(form)
        if(!form.valid) {
            return fail(400, {
                form
            })
        }

        let {password, ramal, email} = form.data

        const ramalfind = await db.select().from(user).where(eq(user.ramal, form.data.ramal))
        if (ramalfind.length > 0) {
            return fail(400, {message: "Ramal ja existente"})
        } 

        const emailfind = await db.select().from(user).where(eq(user.email, form.data.email))
        if (emailfind.length > 0) {
            return fail(400, {message: "Email ja existente"})
        } 

        const passwordHash = await hash(password, {
			memoryCost: 19456,
			timeCost: 2,
			outputLen: 32,
			parallelism: 1,
		});

        try {
			await db.insert(user).values({ ...form.data, passwordHash});

            return {
                form
            }

		} catch (e) {
            console.error(e)
			return {
                form
            };
		}
    }
}