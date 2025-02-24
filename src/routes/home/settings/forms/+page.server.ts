import type { PageServerLoad, Actions } from "./$types";
import { superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { clientSchema } from "$lib/schema";
import { eq } from 'drizzle-orm';
import { db } from "$lib/server/db";
import { client } from "$lib/server/db/schema";
import { fail, redirect } from "@sveltejs/kit";

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		return redirect(302, '/auth');
	}

    return {
        form: await superValidate(zod(clientSchema)),
		user: event.locals.user
    }
};

export const actions: Actions = {
    add_client: async (event) => {
        if (!event.locals.user) {
			return redirect(302, '/auth');
		}

        const form = await superValidate(event, zod(clientSchema))
        if (!form.valid) {
            return fail(400, {
                form
            })
        }

        const result = await db.select().from(client).where(eq(client.full_name, form.data.full_name))
        if(result.length > 0 ) {
            return fail(400, {form})
        }
            
        try {
            await db.insert(client).values({
                ...form.data
            })
            
            return {
                form
            }
        } catch (err) {
            console.error(err)
            return {
                form
            }
        }


    }
}