import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import Papa from "papaparse";
import saveAs from "file-saver";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export type Cliente = {
	value: string;
	label: string;
};

export async function ParseDataToCsv(form: object[], cliente: string) {
	const csv = Papa.unparse(form)

	const date = new Date().toISOString().replace(/[:T]/g, "-").split(".")[0];

	const fileName = `${date}_${cliente}.csv`;

	const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });

	saveAs(blob, fileName)



}