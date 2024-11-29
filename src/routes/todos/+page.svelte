<script lang="ts">
  let count: number = $state(1);
  let double: number = $derived(count * 2);
</script>

<h1>Todos</h1>

<button onclick={() => count++}> add </button>

<p>{count} is doubled is {double}</p>
