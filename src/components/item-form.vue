<script setup lang="ts">
import { DateTime } from 'luxon'
import { nextTick, onMounted, ref, Ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { ProjectItem } from '../lib/dto'
import ItemStatus from './item-status.vue'

const route = useRoute()
const props = withDefaults(defineProps<{ itemData?: ProjectItem; autoFocusName: boolean }>(), {
	itemData: undefined,
	autoFocusName: false,
})
const emit = defineEmits<{ (e: 'update:item-data', i: ProjectItem): void }>()
const thisItem = ref(new ProjectItem('', '')) as Ref<ProjectItem>
watch(
	route,
	() => {
		nextTick(() => {
			if (props.itemData) {
				thisItem.value = props.itemData
			}
		})
	},
	{ immediate: true },
)

const formatDueDate = (d: DateTime) => d.toISO({ suppressMilliseconds: true, includeOffset: false })
const onDateChange = (e: Event) =>
	(thisItem.value.dueDate = DateTime.fromISO((e.target as HTMLInputElement).value))
const removeDueDate = () => (thisItem.value.dueDate = null)

watch(thisItem.value, () => emit('update:item-data', thisItem))
const nameDomRef = ref<HTMLElement | null>(null)
if (props.autoFocusName) onMounted(() => nameDomRef.value?.focus())
</script>

<template>
	<div class="form-control">
		<label class="label">
			<span class="label-text">Name</span>
		</label>
		<input
			ref="nameDomRef"
			v-model="thisItem.name"
			type="text"
			placeholder="Name"
			class="input input-sm input-primary"
		/>
	</div>
	<div class="form-control">
		<label class="label">
			<span class="label-text">Description</span>
		</label>
		<textarea
			v-model="thisItem.description"
			class="textarea textarea-primary h-24"
			placeholder="Description"
		/>
	</div>
	<div class="form-control">
		<label class="label">
			<span class="label-text">Due date</span>
		</label>
		<div class="flex items-center">
			<input
				type="datetime-local"
				class="input input-primary input-sm"
				:value="thisItem.dueDate ? formatDueDate(thisItem.dueDate) : ''"
				@change="onDateChange"
			/>
			<button v-if="thisItem.dueDate" class="btn btn-error btn-sm ml-2" @click="removeDueDate">
				Delete
			</button>
		</div>
	</div>
	<ItemStatus v-model:status="thisItem.status" />
</template>

<style scoped>
input[type='datetime-local' i]::-webkit-calendar-picker-indicator {
	margin-inline-start: 5px !important;
}
input[type='datetime-local' i]::-webkit-datetime-edit {
	max-width: fit-content;
}
</style>
