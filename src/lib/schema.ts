import { z } from "zod";
import formdate from "./constants";

type Tec_email = (typeof formdate.tec_email)[number]["value"]
type Defeito = (typeof formdate.def)[number]["value"]
type Solucao = (typeof formdate.diags)[number]["value"]
type Role = (typeof formdate.role)[number]["value"]

export const cvsSchema = z.object({
    form_date: z.string().refine((v) => v, { message: "A data é obrigatoria" }),
    tecnico_os: z.enum(formdate.tec_email.map((f) => f.value) as [Tec_email, ...Tec_email[]], {
        errorMap: () => ({
            message: "Selecione um tecnico valido!"
        })
    }).array(),
    cliente: z.string().min(2, { message: "Um cliente é obrigado"  }).max(200, { message: "O cliente parece que esta invalido"}),
    solicitante: z.string().min(2, { message: "O solicitante é obrigado"  }).max(50),
    necessario_tecnico: z.boolean().default(false),
    dificuldade_os: z.number(),
    defeito: z.enum(formdate.def.map((d) => d.value) as [Defeito, ...Defeito[]], {
        errorMap: () => ({
            message: "Selecione o defeito"
        })
    }),
    solucao: z.enum(formdate.diags.map((d) => d.value) as [Solucao, ...Solucao[]], {
        errorMap: () => ({
            message: "Selecione a solução"
        })
    }),
    procedimento: z.string({
        required_error: "O procedimento é obrigatorio"
    }).min(2, { message: "O procedimento é obrigado"  }).max(1000),
});

export const loginSchema = z.object({
    email: z.string().email({
        message: "Digite um email valido"
    }),
    password: z.string()
})

export const clientSchema = z.object({
    full_name: z.string().min(2, { message: "Um nome completo é obrigado"  }).max(200, { message: "O nome precisa ter menos de 200 caracteres "}),
    short_name: z.string().min(2, { message: "Um nome curto é obrigado"  }).max(20,  {message: "O nome precisa ter menos de 20 caracteres "})
})

export const registeSchema = z.object({
    name: z.string().min(2, { message: "Um nome é obrigado"  }).max(20, { message: "O nome precisa ter menos de 20 caracteres "}),
    email: z.string().email({
        message: "Digite um email valido"
    }),
    role: z.enum(formdate.role.map((d) => d.value) as [Role, ...Role[]], {
        errorMap: () => ({
            message: "Selecione o cargo"
        })
    }),
    ramal: z.number(),
    password: z.string()
})

export type RegisteSchema = typeof registeSchema
export type ClientSchema = typeof clientSchema;
export type CvsSchema = typeof cvsSchema;
export type LoginSchema = typeof loginSchema
