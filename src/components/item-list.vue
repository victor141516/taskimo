<script setup lang="ts">
import { computed, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ProjectItem, ProjectItemStatus, ItemPath } from '../lib/dto'
import { keyboardDriver } from '../lib/keyboard'
import { activeElementIsInput } from '../lib/misc'
import { goToChildItem } from '../router'
import { saveTasksData } from '../store'

const router = useRouter()

const props = defineProps<{ itemPath: ItemPath }>()

const route = useRoute()
const pageItem = computed(() => props.itemPath[props.itemPath.length - 1]!)
const deleteItem = (itemId: string) => {
	pageItem.value.removeItem(itemId)
	saveTasksData()
}

const onCheckboxChange = (item: ProjectItem) => {
	if (item.status === ProjectItemStatus.Done) {
		item.status = ProjectItemStatus.Pending
	} else {
		item.status = ProjectItemStatus.Done
	}
}

const itemsWithDomRefs: { el: Element; item: ProjectItem }[] = []
let currentFocusedItem: { el: Element; item: ProjectItem } | null = null
const setItemDomRef = (e: Element | undefined, i: number, item: ProjectItem) => {
	if (e) {
		itemsWithDomRefs[i] = { el: e?.children[0], item }
	}
}

const arrowHandler = (offset: 1 | -1) => {
	if (!currentFocusedItem) {
		currentFocusedItem = itemsWithDomRefs[0]
	} else {
		const index = itemsWithDomRefs.findIndex((e) => e.item.id === currentFocusedItem!.item.id)
		const nextIndex = (index + itemsWithDomRefs.length + offset) % itemsWithDomRefs.length
		currentFocusedItem = itemsWithDomRefs[nextIndex]
	}
	;(currentFocusedItem?.el as HTMLElement)?.focus()
}
keyboardDriver.on('ArrowUp', () => {
	if (!activeElementIsInput()) arrowHandler(-1)
})
keyboardDriver.on('ArrowDown', () => {
	if (!activeElementIsInput()) arrowHandler(1)
})
keyboardDriver.on('ArrowRight', () => {
	if (currentFocusedItem) {
		const goToItem = currentFocusedItem.item
		currentFocusedItem = null
		itemsWithDomRefs.length = 0
		goToChildItem(goToItem)
	}
})
keyboardDriver.on('d', () => {
	if (document.activeElement === currentFocusedItem?.el) {
		const itemIdToRemove = currentFocusedItem.item.id
		arrowHandler(1)
		itemsWithDomRefs.length = 0
		deleteItem(itemIdToRemove)
	}
})

keyboardDriver.on('n', (ev) => {
	if (!activeElementIsInput()) {
		ev.preventDefault()
		router.push(`${route.fullPath}/new-item`)
	}
})

keyboardDriver.on('x', () => {
	if (document.activeElement === currentFocusedItem?.el) {
		onCheckboxChange(currentFocusedItem.item)
	}
})

onBeforeUnmount(() => keyboardDriver.clearListeners())
</script>

<template>
	<ul class="menu">
		<li class="menu-title">
			<label class="label">
				<span class="label-text">Items</span>
			</label>
		</li>
		<li
			v-for="(item, k) in pageItem.items"
			:key="item.id"
			:ref="e => setItemDomRef(e as Element, k, item)"
			class="flex flex-row w-full"
		>
			<router-link :to="`${route.fullPath}/item/${item.id}`" class="w-full">
				<div class="w-full">
					<input
						type="checkbox"
						class="checkbox"
						:checked="item.status === ProjectItemStatus.Done"
						@click.stop
						@change="onCheckboxChange(item)"
					/>
					<span class="ml-2">{{ item.name }}</span>
					<div v-if="item.items.length > 0" class="badge ml-2 success">
						{{ item.items.length }}
					</div>
					<div v-if="item.dueDate" class="badge ml-2 success">
						{{ item.dueDate.toRelative() }}
					</div>
				</div>
				<button class="btn btn-error btn-sm" @click.prevent="deleteItem(item.id)">Delete</button>
			</router-link>
		</li>
		<div class="flex justify-center mt-2">
			<a class="btn btn-primary btn-sm" :href="`${route.fullPath}/new-item`">New</a>
		</div>
	</ul>
</template>
