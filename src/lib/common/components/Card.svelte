<script lang="ts">
  import type { DETAILS } from "../types/Detail.js";
  import Title from "./Title.svelte";
  let { body = $bindable("Default body"), title } = $props();
</script>

<div class="card p-4 rounded shadow-md border my-2">
  <Title {title} />
  <textarea bind:value={body} rows="7" cols="100" class="text-black">
  </textarea>
</div>
