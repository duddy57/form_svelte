import { z } from "zod";
import formdate from "./constants";

type Tec_email = (typeof formdate.tec_email)[number]["value"]
type Cliente = (typeof formdate.cliente)[number]["value"]
type Defeito = (typeof formdate.def)[number]["value"]
type Solucao = (typeof formdate.diags)[number]["value"]
 
export const cvsSchema = z.object({
    form_date: z.string().refine((v) => v,  { message:  "A data é obrigatoria"}),
    tecnico_forms: z.enum( formdate.tec_email.map((f) => f.value) as [Tec_email, ...Tec_email[]],{
        errorMap: () => ({
            message: "Selecione um tecnico valido!"
        })
    }),
    tecnico_os: z.enum( formdate.tec_email.map((f) => f.value) as [Tec_email, ...Tec_email[]],{
        errorMap: () => ({
            message: "Selecione um tecnico valido!"
        })
    }),
    cliente: z.enum ( formdate.cliente.map((f) => f.value) as [Cliente, ...Cliente[]], {
        errorMap: () => ({
            message: "Selecione um cliente valido!"
        })
    }),
    solicitante: z.string().min(2).max(50),
    necessario_tecnico: z.boolean().default(false).transform(
        (t) => (t ? 'Sim' : 'Não')
    ),
    dificuldade_os: z.number().transform((n) => {
        if (n === 50) {
          return "Intermediaria";
        } else if (n > 50) {
          return "Dificil";
        } else {
          return "Simples";
        }
      }),
    defeito: z.enum( formdate.def.map((d) => d.value) as [Defeito, ...Defeito[]], {
        errorMap: () => ({
            message: "Selecione o defeito"
        })
    }),
    solucao: z.enum( formdate.diags.map((d) => d.value) as [Solucao, ...Solucao[]], {
        errorMap: () => ({
            message: "Selecione a solução"
        })
    })
});
 
export type CvsSchema = typeof cvsSchema;