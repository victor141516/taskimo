<script setup lang="ts">
import { onBeforeUnmount, Ref, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ItemForm from '../components/item-form.vue'
import { ProjectItem } from '../lib/dto'
import { keyboardDriver } from '../lib/keyboard'
import { saveTasksData, getItemPath } from '../store'

const route = useRoute()
const router = useRouter()

const itemPath = getItemPath(route)

const newItem = ref(new ProjectItem('', '')) as Ref<ProjectItem>
const onSave = () => {
	newItem.value = new ProjectItem(
		newItem.value.name,
		newItem.value.description,
		newItem.value.dueDate,
	)
	const currentItem = itemPath.value[itemPath.value.length - 1]!
	currentItem.addItem(newItem.value)
	saveTasksData()
	router.push(route.fullPath.split('/').slice(0, -1).join('/'))
}
keyboardDriver.on('Escape', () => router.push(route.fullPath.replace(/\/new-item$/, '')))
onBeforeUnmount(() => keyboardDriver.remove('Escape'))
</script>

<template>
	<form class="px-5" @submit="onSave">
		<ItemForm v-model:item-data="newItem" :auto-focus-name="true" />
		<div class="flex justify-center">
			<button class="btn btn-primary btn-sm mt-4" type="submit" :disabled="newItem.name === ''">
				Save
			</button>
		</div>
	</form>
</template>
