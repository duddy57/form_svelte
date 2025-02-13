import type { PageServerLoad, Actions } from "./$types";
import { superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { cvsSchema, listSchema } from "$lib/schema.js";
import { fail } from "@sveltejs/kit";
import { db } from "$lib/server/db";
import { cvs } from "$lib/server/db/schema";
import { eq } from "drizzle-orm";
import { ParseDataToCsv } from "$lib/utils";

export const load: PageServerLoad = async () => {
    return {
        form: await superValidate(zod(cvsSchema)),
        list: await superValidate(zod(listSchema))
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
    list: async (event) => {
        const form = await superValidate(event, zod(listSchema))
        if (!form.valid) {
            return fail(400, {
                form
            })
        }

        if (form.data.cvsresumido === true) {
            let result = []
            result = await db.select({
                data: cvs.form_date,
                tecnico: cvs.tecnico_os,
                cliente: cvs.cliente,
                solicitante: cvs.solicitante,
                defeito: cvs.defeito,
                solucao: cvs.solucao,
                procedimento: cvs.procedimento
            }).from(cvs).where(eq(cvs.cliente, form.data.cliente))

            if (result.length === 0) {
                console.log("Nenhum dado encontrado.");
                return;
            }

            await ParseDataToCsv(result, form.data.cliente)

        } else {
            console.log("teste")
            return {
                form
            }
        }
    }
}