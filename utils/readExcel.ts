import readXlsxFile from "read-excel-file";

export const readAnexoSefaz = async (file: any, columns: Array<string>) => {
  const rows = await readXlsxFile(file);
  const ncmsTratados = new Set(
    rows.flatMap((row) => {
      const ncmRow = row[2];
      if (!ncmRow) return [];

      return ncmRow
        .toString()
        .replace(/\./g, "")
        .split(/,|\n|\s+e\s+/)
        .map((s) => s.trim())
        .filter((s) => s !== "" && !isNaN(Number(s)));
    }),
  );

  const totalNcms = ncmsTratados.size;
  const excelData = rows
    .filter((row) => row[2])
    .map((row) => {
      return columns.reduce((acc, colName, index) => {
        acc[colName] = row[index];
        return acc;
      }, {} as any);
    });
  return { excelData, ncmsTratados, totalNcms };
};

export const readExcel = async (file: any, columns: string[] = []) => {
  const rows = await readXlsxFile(file);

  if (columns.length === 0) {
    const colunas = rows[0].map((col) => {
      if (!isNaN(Number(col))) {
        throw new Error("Colunas obrigatórias");
      }
      return col.toString();
    });
    if (colunas.length > 1) {
      columns.push(...colunas);
    }
  }
  const excelData = rows.map((row) => {
    return columns.reduce((acc, colName, index) => {
      acc[colName] = row[index];
      return acc;
    }, {} as any);
  });

  return excelData;
};
