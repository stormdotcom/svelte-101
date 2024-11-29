<script lang="ts">
  import type { User } from "../interfaces/User.js";

  export let user: User;
</script>

<div
  class="max-w-sm mx-auto bg-silver shadow-lg rounded-lg overflow-hidden border border-silver-200"
>
  <div class="bg-black-500 h-24"></div>
  <div class="p-6">
    <h2 class="text-2xl font-semibold text-silver-800">{user.name}</h2>
    <p class="text-silver-600 text-sm mb-2">
      <strong class="font-medium">Username:</strong>
      {user.username}
    </p>
    <p class="text-silver-600 text-sm mb-2">
      <strong class="font-medium">Email:</strong>
      {user.email}
    </p>
    <p class="text-silver-600 text-sm mb-2">
      <strong class="font-medium">Address:</strong>
      {user.address.street}, {user.address.city}
    </p>
    <p class="text-silver-600 text-sm mb-2">
      <strong class="font-medium">Phone:</strong>
      {user.phone}
    </p>
    <p class="text-silver-600 text-sm">
      <strong class="font-medium">Company:</strong>
      {user.company.name}
    </p>
  </div>
  <div class="bg-grey-50 px-6 py-3 text-right border-t">
    <button
      class="text-silver-800 bg-grey-500 hover:bg-grey-600 transition px-4 py-2 rounded-lg text-sm font-medium"
    >
      View Profile
    </button>
  </div>
</div>
