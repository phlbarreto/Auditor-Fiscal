import writeXlsxFile from "write-excel-file";

export const writeExcel = async <T>(
  data: T[],
  header: any[],
  fileName: string,
  mapRow: (item: T) => any[],
) => {
  const rows = [header];

  data.forEach((item) => {
    rows.push(mapRow(item));
  });

  await writeXlsxFile(rows, { fileName: `${fileName}.xlsx` });
};
