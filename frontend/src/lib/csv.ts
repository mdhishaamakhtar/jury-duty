const cell = (value: unknown) => {
	const text = value === null || value === undefined ? '' : String(value);
	// A leading =, +, - or @ would run as a formula when a spreadsheet opens the file.
	const safe = /^[=+\-@\t\r]/.test(text) ? `'${text}` : text;
	return /[",\n\r]/.test(safe) ? `"${safe.replaceAll('"', '""')}"` : safe;
};

export const toCsvRow = (values: unknown[]) => `${values.map(cell).join(',')}\r\n`;

export const parseCsv = (text: string): string[][] => {
	const rows: string[][] = [];
	let row: string[] = [];
	let field = '';
	let quoted = false;
	for (let index = 0; index < text.length; index += 1) {
		const char = text[index];
		if (quoted) {
			if (char === '"' && text[index + 1] === '"') {
				field += '"';
				index += 1;
			} else if (char === '"') quoted = false;
			else field += char;
		} else if (char === '"') quoted = true;
		else if (char === ',') {
			row.push(field);
			field = '';
		} else if (char === '\n' || char === '\r') {
			if (char === '\r' && text[index + 1] === '\n') index += 1;
			row.push(field);
			rows.push(row);
			row = [];
			field = '';
		} else field += char;
	}
	if (field || row.length) rows.push([...row, field]);
	return rows.filter((cells) => cells.some((value) => value.trim()));
};
