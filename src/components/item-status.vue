<script setup lang="ts">
import { ref } from 'vue'
import { ProjectItemStatus } from '../lib/dto'

const props = defineProps<{ status: ProjectItemStatus }>()
const emit = defineEmits<(e: 'update:status', k: ProjectItemStatus) => void>()

const container = ref<HTMLDivElement | null>(null)

const statuses = new Map<ProjectItemStatus, string>([
	[ProjectItemStatus.Done, 'Done'],
	[ProjectItemStatus.Pending, 'Pending'],
])

const onStatusChange = (k: ProjectItemStatus) => {
	emit('update:status', k)
	container.value?.blur()
}
</script>

<template>
	<div class="form-control">
		<label class="label">
			<span class="label-text">Status</span>
		</label>
		<div class="btn-group">
			<button
				v-for="[k, s] in statuses"
				:key="s"
				class="btn btn-sm"
				:class="{ 'btn-active': k === props.status }"
				type="button"
				@click="onStatusChange(k)"
			>
				{{ s }}
			</button>
		</div>
	</div>
</template>
