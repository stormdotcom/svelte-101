<script lang="ts">
  import UserCard from "$lib/common/components/UserCard.svelte";
  import type { User } from "$lib/common/interfaces/User.js";
  export let data: User;
</script>

<h1>User Information</h1>
<UserCard user={data} />
