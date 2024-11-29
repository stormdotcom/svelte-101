/* eslint-env worker */
import * as XLSX from 'xlsx';

interface WorkerResponse {
  removedSheets: string[];
  consolidatedData: Record<string, any>[];
}

self.onmessage = async (event: MessageEvent) => {
  const { templateData, rawData } = event.data as { templateData: ArrayBuffer; rawData: ArrayBuffer };

  // Read the Template Excel file to understand the expected structure
  const templateWorkbook = XLSX.read(templateData, { type: 'array' });
  const templateSheetName = templateWorkbook.SheetNames[0];
  const templateSheet = templateWorkbook.Sheets[templateSheetName];
  const sheetJson = XLSX.utils.sheet_to_json<any[]>(templateSheet, { header: 1 });

  // Extract unique template fields, trim whitespace, and ensure they are case-insensitive
  let templateFields: string[] = [];
  if (sheetJson.length > 0) {
    const headerRow = sheetJson[0] as string[];
    templateFields = [...new Set(headerRow.map(field => field.trim().toLowerCase()))]; // Use Set to ensure unique, trimmed field names
  } else {
    console.error('Template sheet is empty or has no headers');
    self.postMessage({
      removedSheets: [],
      consolidatedData: [],
    });
    return; // Stop further processing if the template is invalid
  }

  // Read the Raw Excel file containing additional sheets
  const rawWorkbook = XLSX.read(rawData, { type: 'array' });
  const allSheetNames = rawWorkbook.SheetNames;
  const removedSheets: string[] = [];
  let consolidatedData: Record<string, any>[] = [];

  // Iterate through all sheets in the raw workbook to find and extract relevant data
  allSheetNames.forEach(sheetName => {
    const rawSheet = rawWorkbook.Sheets[sheetName];
    const rawSheetData = XLSX.utils.sheet_to_json<Record<string, any>>(rawSheet);

    // Extract data only for fields defined in the unique template fields
    rawSheetData.forEach((row: Record<string, any>) => {
      const filteredRow: Record<string, any> = {};

      // Iterate over template fields to find corresponding data in the raw row
      templateFields.forEach(templateField => {
        // Match raw data field ignoring case and trimming whitespaces
        const matchingKey = Object.keys(row).find(rawField =>
          rawField.trim().toLowerCase() === templateField
        );

        if (matchingKey && row[matchingKey] !== undefined && row[matchingKey] !== null && row[matchingKey] !== "") {
          filteredRow[templateField] = row[matchingKey];
        }
      });

      // Only add rows that have at least one non-null value
      if (Object.keys(filteredRow).length > 0) {
        consolidatedData.push(filteredRow);
      }
    });

    // If no relevant data was found in the current sheet, consider it "removed"
    if (consolidatedData.length === 0) {
      removedSheets.push(sheetName);
    }
  });

  // Send back results to the main thread
  const response: WorkerResponse = {
    removedSheets,
    consolidatedData,
  };

  console.log("Generated response: ", response);
  self.postMessage(response);
};
