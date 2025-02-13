import type { PageServerLoad, Actions } from "./$types";
import { superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { cvsSchema } from "$lib/schema.js";
import { db } from "$lib/server/db";
import { cvs } from "$lib/server/db/schema";
import { fail } from "@sveltejs/kit";




export const load: PageServerLoad = async () => {
    return {
        form: await superValidate(zod(cvsSchema)),
    };
};

export const actions: Actions = {
    create: async (event) => {
        const form = await superValidate(event, zod(cvsSchema))
        if (!form.valid) {
            return fail(400, {
                form
            })
        }

        console.log(form.data)
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

        const insertData = await db.insert(cvs).values({
            ...form.data,
            necessario_tecnico: formatarData(form.data.necessario_tecnico),
            dificuldade_os: formatarDificuldade(form.data.dificuldade_os)
        })

        console.log(insertData)


        return {
            form
        }
    },
}