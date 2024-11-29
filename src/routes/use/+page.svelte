<script lang="ts">
	import type { Action } from 'svelte/action';

	const gestures: Action<
		HTMLDivElement,
		null,
		{
			onswiperight: (e: CustomEvent) => void;
			onswipeleft: (e: CustomEvent) => void;
		}
	> = (node) => {
		// Setup swipe event dispatch
		node.dispatchEvent(new CustomEvent('swipeleft'));
		node.dispatchEvent(new CustomEvent('swiperight'));

		// Teardown logic
		return () => {
			// Any teardown logic, e.g., remove event listeners
		};
	};
</script>

<div
	use:gestures
	onswipeleft={next}
	onswiperight={prev}
>...</div>
