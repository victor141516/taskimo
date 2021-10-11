<script setup lang="ts">
import { computed, onBeforeUnmount, watch } from 'vue'
import { useRoute } from 'vue-router'
import { getItemPath, saveTasksData } from '../store'
import { ProjectItem } from '../lib/dto'
import ItemForm from '../components/item-form.vue'
import { keyboardDriver } from '../lib/keyboard'
import { goToParentItem } from '../router'
import { activeElementIsInput } from '../lib/misc'
import ItemList from '../components/item-list.vue'

const route = useRoute()
const itemPath = getItemPath(route)
const item = computed(() => itemPath.value[itemPath.value.length - 1] as ProjectItem)
watch(item.value, saveTasksData)

keyboardDriver.on('Escape', () => goToParentItem())
keyboardDriver.on('ArrowLeft', () => {
	if (!activeElementIsInput()) goToParentItem()
})
keyboardDriver.on('Backspace', () => {
	if (!activeElementIsInput()) goToParentItem()
})
onBeforeUnmount(() => keyboardDriver.clearListeners())
</script>

<template>
	<div v-if="item" class="px-5">
		<ItemForm v-model:item-data="item" />
		<ItemList :item-path="itemPath" />
	</div>
</template>
