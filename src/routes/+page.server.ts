import type { PageServerLoad, Actions } from "./$types";
import { superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { cvsSchema } from "$lib/schema.js";
import { fail } from "@sveltejs/kit";
import { db } from "$lib/server/db";
 
export const load: PageServerLoad = async () => {
 return {
  form: await superValidate(zod(cvsSchema)),
 };
};

export const actions: Actions = {
    create: async (event) => {
        const form = await superValidate(event, zod(cvsSchema))
        if(!form.valid) {
            return fail(400, {
                form
            })
        }

        return {
            form
        }
    }
}