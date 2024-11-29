<script lang="ts">
  import Card from "$lib/common/components/Card.svelte";
  import type { DETAILS } from "$lib/common/types/Detail.js";
  import { apiRequest } from "$lib/utils/api.js";
  import { onMount } from "svelte";

  // State variables
  let count = 1; // Counter starts at 1
  let posts: DETAILS[] = []; // Array to hold posts fetched from API
  let error: string | null = null; // Variable for handling error state
  let loading = false;
  // Function to increment the count
  function increment() {
    count = count + 1;
  }

  // Function to decrement the count
  function decrement() {
    if (count > 1) {
      count = count - 1;
    }
  }

  // Fetch posts when the component mounts using the reusable API utility
  onMount(async () => {
    try {
      const response = await apiRequest<DETAILS[]>({
        endpoint: "/posts",
        method: "GET",
        setLoading: (state) => (loading = state),
      });

      if (response) {
        posts = response;
      } else {
        error = "Failed to load posts.";
      }
    } catch (e) {
      error = "Failed to fetch posts.";
      console.error(e);
    }
  });
</script>

<!-- Component template -->
<div class="p-3 m-4">
  <h1
    class="text-xl font-bold border border-grey-100 border-spacing-2 text-center"
  >
    Welcome to your library project
  </h1>
  <p>
    Create your package using @sveltejs/package and preview/showcase your work
    with SvelteKit.
  </p>

  <!-- Counter Increment/Decrement -->
  <div class="flex items-center justify-center">
    <button
      on:click={increment}
      class="bg-black hover:bg-gray-800 text-gray-300 font-semibold py-2 px-4 rounded mt-4 border border-gray-500"
    >
      Increment
    </button>

    <button
      on:click={decrement}
      class="bg-black hover:bg-gray-800 text-gray-300 font-semibold py-2 px-4 rounded mt-4 border border-gray-500"
    >
      Decrement
    </button>
  </div>

  <p class="text-2xl text-center p-2 font-extrabold">
    Count: <span class="text-3xl border-b-2 border-white border-solid"
      >{count}</span
    >
  </p>

  <!-- Posts List -->
  <h1>Posts</h1>

  <!-- Loading Indicator -->
  {#if loading}
    <div class="loading-indicator">Loading posts, please wait...</div>
  {/if}

  {#if error}
    <p class="text-red-500">{error}</p>
  {:else if posts.length === 0 && !loading}
    <p>No posts available.</p>
  {:else}
    <ul>
      {#each posts as post (post.id)}
        <li>
          <Card body={post.body} title={post.title} />
        </li>
      {/each}
    </ul>
  {/if}
</div>

<style>
  .loading-indicator {
    text-align: center;
    font-size: 1.5rem;
    color: #333;
    padding: 1rem;
  }
</style>
