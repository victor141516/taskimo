<script setup lang="ts">
import { computed } from '@vue/reactivity'
import { onBeforeUnmount, watch } from '@vue/runtime-core'
import { useRoute } from 'vue-router'
import { getItemPath, saveTasksData, store } from '../store'
import { keyboardDriver } from '../lib/keyboard'
import { goToParentItem } from '../router'
import { activeElementIsInput } from '../lib/misc'
import ItemList from '../components/item-list.vue'

const route = useRoute()
const itemPath = getItemPath(route)
const project = computed(() => store.tasksData.getProject(route.params.projectId as string)!)
watch(project.value, () => saveTasksData())

keyboardDriver.on('ArrowLeft', () => {
	if (!activeElementIsInput()) goToParentItem()
})
keyboardDriver.on('Backspace', () => {
	if (!activeElementIsInput()) goToParentItem()
})

onBeforeUnmount(() => keyboardDriver.clearListeners())
</script>

<template>
	<ul v-if="project" class="menu">
		<li class="menu-title py-1 px-5">
			<input
				v-model="project.name"
				type="text"
				class="h-min p-0 input input-transparent !text-xl font-bold"
				:class="project.name === '' ? 'text-error border-error' : 'border-0 !text-primary'"
			/>
		</li>
		<ItemList :item-path="itemPath" />
	</ul>
</template>
