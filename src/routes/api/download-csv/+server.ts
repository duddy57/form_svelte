import { db } from "$lib/server/db";
import { cvs } from "$lib/server/db/schema";
import { and, gte, lte, eq } from 'drizzle-orm';
import { json } from '@sveltejs/kit';
import XLSX from "xlsx"

export async function GET({ url }) {
    try {
        const cliente = url.searchParams.get('cliente');
        const date_start = url.searchParams.get('data_inicio');
        const date_end = url.searchParams.get('data_fim')
        const type = url.searchParams.get("tipo")

        console.log(cliente, date_start, date_end)

        if (!cliente) {
            return json({ error: "Cliente não especificado" }, { status: 400 });
        }
        if (!date_start) {
            return json({ error: "Data de inicio não especificada"}, { status: 400 })
        }
        if (!date_end) {
            return json({ error: "Data de inicio não especificada"}, { status: 400 })
        }
        if (!type) {
            return json({ error: "Tipo não especificada"}, { status: 400 })
        };

        let result = [];
        let data = [];
        let headers: string | any[] = [];

        if(type === "completo") {
            result = await db.select().from(cvs).where(
                and(
                    eq(cvs.cliente, cliente),
                    gte(cvs.create_date, date_start),
                    lte(cvs.create_date, date_end)
                ));

            data = result.map(row => [
                row.create_date,
                row.form_date,
                row.tecnico_forms,
                row.tecnico_os,
                row.cliente,
                row.solicitante,
                row.necessario_tecnico,
                row.dificuldade_os,
                row.defeito,
                row.solucao,
                row.procedimento
            ]);

            headers = [
                "DATA","TECNICO FORMULARIO", "TECNICO", "CLIENTE", "SOLICITANTE","TECNICO PRESENCIAL","DIFICULDADE", "DEFEITO", "SOLUÇÃO", "DIAGNOSTICO"
            ];
        } else {
            result = await db.select({
                create_date: cvs.create_date,
                data: cvs.form_date,
                tecnico: cvs.tecnico_os,
                cliente: cvs.cliente,
                solicitante: cvs.solicitante,
                defeito: cvs.defeito,
                solucao: cvs.solucao,
                procedimento: cvs.procedimento
            }).from(cvs).where(
                and(
                    eq(cvs.cliente, cliente),
                    gte(cvs.create_date, date_start),
                    lte(cvs.create_date, date_end)
                ));
            
                headers = [
                    "DATA", "TECNICO", "CLIENTE", "SOLICITANTE", "DEFEITO", "SOLUÇÃO", "DIAGNOSTICO"
                ];
        
                data = result.map(row => [
                    row.create_date,
                    row.tecnico,
                    row.cliente,
                    row.solicitante,
                    row.defeito,
                    row.solucao,
                    row.procedimento
                ]);

        }

        if (result.length === 0) {
            return json({ error: "Nenhum dado encontrado." }, { status: 404 });
        }

        // Preparar os dados
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.aoa_to_sheet([headers, ...data]);

        // Definir largura das colunas
        ws['!cols'] = [
            { width: 15},
            { width: 20},
            { width: 25},
            { width: 20},
            { width: 40},
            { width: 40},
            { width: 40}
        ];

        ws["!rows"] = [
            { hpt: 20 },
        ]

        ws

        // Estilizar o cabeçalho
        for (let i = 0; i < headers.length; i++) {
            const cellRef = XLSX.utils.encode_cell({ r: 0, c: i });
            ws[cellRef].s = {
                fill: {
                    patternType: 'solid',
                    fgColor: { rgb: '000000' }
                },
                font: {
                    name: 'Arial',
                    sz: 14,
                    bold: true,
                    color: { rgb: 'FFFFFF' }
                },
                alignment: {
                    horizontal: 'center',
                    vertical: 'center'
                },

            };
        }

        XLSX.utils.book_append_sheet(wb, ws, "Relatório");

        // Converter para buffer
        const buf = XLSX.write(wb, {
            type: 'buffer',
            bookType: 'xlsx',
            bookSST: false,
            cellStyles: true
        });

        return new Response(buf, {
            headers: {
                "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                "Content-Disposition": `attachment; filename=${cliente}_${new Date().toLocaleDateString()}.xlsx`
            }
        });

    } catch (error) {
        console.error("Erro ao gerar Excel:", error);
        return json({ error: "Erro interno no servidor" }, { status: 500 });
    }
}