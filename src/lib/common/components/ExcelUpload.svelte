<script lang="ts">
  import { Icon } from "svelte-icons-pack";
  import { AiOutlineNodeExpand } from "svelte-icons-pack/ai";
  import * as XLSX from "xlsx";

  let templateFile: File | null = null;
  let rawFile: File | null = null;
  let removedSheets: string[] = [];
  let expectedSheet: Record<string, any> | null = null;
  let processedData: Record<string, any>[] | null = null;
  let errorMessage: string = "";
  let isProcessing: boolean = false;

  // Function to handle template file selection
  const handleTemplateChange = (event: Event) => {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (validateFile(file)) {
        errorMessage = ""; // Reset previous errors
        templateFile = file;
      } else {
        errorMessage = "Please upload a valid Excel file (.xls or .xlsx)";
      }
    }
  };

  // Function to handle raw file selection
  const handleRawChange = (event: Event) => {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (validateFile(file)) {
        if (!templateFile) {
          errorMessage = "Please upload the template Excel file first.";
          return;
        }
        errorMessage = ""; // Reset previous errors
        rawFile = file;
        processFiles(templateFile, rawFile);
      } else {
        errorMessage = "Please upload a valid Excel file (.xls or .xlsx)";
      }
    }
  };

  // Function to validate the uploaded file
  const validateFile = (file: File): boolean => {
    const validExtensions = ["xlsx", "xls"];
    const fileExtension = file.name.split(".").pop()?.toLowerCase() || "";
    return validExtensions.includes(fileExtension);
  };

  // Function to send both files to worker for processing
  const processFiles = (templateFile: File, rawFile: File) => {
    isProcessing = true; // Start processing

    const templateReader = new FileReader();
    const rawReader = new FileReader();

    templateReader.onload = (templateEvent) => {
      if (templateEvent.target?.result) {
        const templateData = templateEvent.target.result as ArrayBuffer;

        rawReader.onload = (rawEvent) => {
          if (rawEvent.target?.result) {
            const rawData = rawEvent.target.result as ArrayBuffer;
            const worker = new Worker(
              new URL("./excelWorker.ts", import.meta.url),
              { type: "module" }
            );
            worker.postMessage({ templateData, rawData });

            worker.onmessage = (event) => {
              // Update reactive variables
              removedSheets = event.data.removedSheets;
              expectedSheet = event.data.consolidatedData;
              processedData = event.data.processedData;
              isProcessing = false; // End processing
            };

            worker.onerror = (e) => {
              console.error(e.message);
              errorMessage = "Error occurred during file processing.";
              isProcessing = false;
            };
          }
        };
        rawReader.readAsArrayBuffer(rawFile);
      }
    };
    templateReader.readAsArrayBuffer(templateFile);
  };
</script>

<div
  class="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-4 text-black"
>
  {#if isProcessing}
    <div class="loading-indicato">Processing</div>
  {/if}
  <div class="flex items-center space-x-2">
    <Icon src={AiOutlineNodeExpand} />
    <!-- svelte-ignore a11y_label_has_associated_control -->
    <label class="block text-sm font-medium text-gray-700">
      Upload Template Excel File
    </label>
  </div>
  <input
    type="file"
    accept=".xls, .xlsx"
    class="mt-2 border p-2 w-full rounded"
    on:change={handleTemplateChange}
  />

  <div class="flex items-center space-x-2 mt-4">
    <Icon src={AiOutlineNodeExpand} />
    <!-- svelte-ignore a11y_label_has_associated_control -->
    <label class="block text-sm font-medium text-gray-700">
      Upload Raw Excel File
    </label>
  </div>
  <input
    type="file"
    accept=".xls, .xlsx"
    class="mt-2 border p-2 w-full rounded"
    on:change={handleRawChange}
  />

  {#if errorMessage}
    <p class="text-red-500 text-sm mt-2">{errorMessage}</p>
  {/if}

  {#if isProcessing}
    <p class="text-blue-500 text-sm mt-4">Processing... Please wait.</p>
  {/if}

  {#if removedSheets.length > 0}
    <div class="mt-4 overflow-x-auto">
      <h4 class="font-semibold text-sm">Removed Sheets:</h4>
      <div class="list-disc list-inside text-red-500 flex flex-row flex-nowrap">
        {#each removedSheets as sheet}
          <div class="mx-2 bg-red-200 rounded-md">
            <p class="px-2">{" " + sheet}</p>
          </div>
        {/each}
      </div>
    </div>
  {/if}

  {#if expectedSheet}
    <div class="mt-4">
      <h4 class="font-semibold text-sm">Expected Sheet:</h4>
      <pre class="bg-gray-100 p-2 rounded overflow-auto">{JSON.stringify(
          expectedSheet,
          null,
          2
        )}</pre>
    </div>
  {/if}

  {#if processedData}
    <div class="mt-4">
      <h4 class="font-semibold text-sm">Processed Data:</h4>
      <pre class="bg-gray-100 p-2 rounded overflow-auto">{JSON.stringify(
          processedData,
          null,
          2
        )}</pre>
    </div>
  {/if}
</div>

<style>
  @import "tailwindcss/tailwind.css";
  .loading-indicator {
    text-align: center;
    font-size: 1.5rem;
    color: #333;
    padding: 1rem;
  }
</style>
