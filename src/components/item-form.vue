<script setup lang="ts">
import { DateTime } from 'luxon';
import { nextTick, onMounted, PropType, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { ProjectItem } from '../lib/dto';
import ItemStatus from './item-status.vue';

const route = useRoute()
const props = defineProps({
  itemData: { type: Object as PropType<ProjectItem>, default: null },
  autoFocusName: { type: Boolean, default: false },
})
const emit = defineEmits(['update:item-data'])
const thisItem = ref(new ProjectItem('', ''))
watch(route, () => {
  nextTick(() => {
    if (props.itemData) {
      thisItem.value = props.itemData
    }
  })
}, { immediate: true })

const formatDueDate = (d: DateTime) => d.toISO({ suppressMilliseconds: true, includeOffset: false })
const onDateChange = (e: Event) => thisItem.value.dueDate = DateTime.fromISO((e.target as HTMLInputElement).value)
const removeDueDate = () => thisItem.value.dueDate = null

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
      type="text"
      placeholder="Name"
      class="input input-sm input-primary"
      v-model="thisItem.name"
    />
  </div>
  <div class="form-control">
    <label class="label">
      <span class="label-text">Description</span>
    </label>
    <textarea
      class="textarea textarea-primary h-24"
      placeholder="Description"
      v-model="thisItem.description"
    ></textarea>
  </div>
  <div class="form-control">
    <label class="label">
      <span class="label-text">Due date</span>
    </label>
    <div class="flex items-center">
      <input
        type="datetime-local"
        class="input input-primary input-sm"
        @change="onDateChange"
        :value="thisItem.dueDate ? formatDueDate(thisItem.dueDate) : ''"
      />
      <button
        class="btn btn-error btn-sm ml-2"
        v-if="thisItem.dueDate"
        @click="removeDueDate"
      >Delete</button>
    </div>
  </div>
  <ItemStatus v-model:status="thisItem.status"></ItemStatus>
</template>

<style scoped>
input[type="datetime-local" i]::-webkit-calendar-picker-indicator {
  margin-inline-start: 5px !important;
}
input[type="datetime-local" i]::-webkit-datetime-edit {
  max-width: fit-content;
}
</style>