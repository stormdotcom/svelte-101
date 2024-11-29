<script context="module" lang="ts">
  import type { Load } from "@sveltejs/kit";

  export const load: Load = ({ status, error }) => {
    console.error("Error in +error.svelte:", error);
    return {
      status,
      message: error?.message || "An unexpected error occurred.",
    };
  };
</script>

<script lang="ts">
  export let status: number = 500;
  export let message: string = "Something went wrong";
</script>

<main class=" justify-center items-center min-h-screen">
  <div class="error-page justify-center text-center mb-8 flex">
    <h1 class="text-6xl text-red-500">{status}</h1>
    <div class="p-2 text-4xl">|</div>
    <p class="text-lg text-white-700">{message}</p>
  </div>
  <div class="flex justify-center">
    <a href="/" class=" hover:underline mt-4 block">Go back to Home</a>
  </div>
  <footer class="text-center w-full mt-4">
    <p class="text-sm text-gray-200">
      © 2024 Your Company. All rights reserved.
    </p>
  </footer>
</main>

<style>
  .error-page {
    text-align: center;
    margin-top: 40vh;
  }
</style>
