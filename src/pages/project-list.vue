<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref } from 'vue'
import { Project } from '../lib/dto'
import { keyboardDriver } from '../lib/keyboard'
import { goToChildItem } from '../router'
import { saveTasksData, store } from '../store'

setTimeout(() => {
	console.log(store.tasksData.getAllItems())
}, 2000)

const newProjectName = ref('')
const showNewProjectMenu = ref(false)
const onNewProjectSave = () => {
	store.tasksData.addProject(new Project(newProjectName.value))
	saveTasksData()
	showNewProjectMenu.value = false
	newProjectName.value = ''
}
const deleteProject = (projectId: string) => {
	store.tasksData.deleteProject(projectId)
	saveTasksData()
}

const projectsWithDomRefs: { el: Element; project: Project }[] = []
let currentFocusedProject: { el: Element; project: Project } | null = null
const setItemDomRef = (e: Element | undefined, i: number, project: Project) => {
	if (e) {
		projectsWithDomRefs[i] = { el: e?.children[0], project }
	}
}

const arrowHandler = (offset: 1 | -1) => {
	if (!currentFocusedProject) {
		currentFocusedProject = projectsWithDomRefs[0]
	} else {
		const index = projectsWithDomRefs.findIndex(
			(e) => e.project.id === currentFocusedProject!.project.id,
		)
		const nextIndex = (index + projectsWithDomRefs.length + offset) % projectsWithDomRefs.length
		currentFocusedProject = projectsWithDomRefs[nextIndex]
	}
	// eslint-disable-next-line prettier/prettier
	(currentFocusedProject.el as HTMLElement).focus()
}
keyboardDriver.on('ArrowUp', () => arrowHandler(-1))
keyboardDriver.on('ArrowDown', () => arrowHandler(1))
keyboardDriver.on('ArrowRight', () => {
	if (currentFocusedProject) goToChildItem(currentFocusedProject.project)
})

const newProjectInputDomRef = ref<HTMLElement | null>(null)
keyboardDriver.on('n', (ev) => {
	if (!showNewProjectMenu.value) {
		ev.preventDefault()
		showNewProjectMenu.value = true
		nextTick(() => {
			newProjectInputDomRef.value?.focus()
		})
	}
})

keyboardDriver.on('d', () => {
	if (document.activeElement === currentFocusedProject?.el) {
		const projectIdToRemove = currentFocusedProject.project.id
		arrowHandler(1)
		projectsWithDomRefs.length = 0
		deleteProject(projectIdToRemove)
	}
})

onBeforeUnmount(() => keyboardDriver.clearListeners())
</script>

<template>
	<ul class="menu">
		<li class="menu-title">
			<span class="!text-xl !text-primary">Project List</span>
		</li>
		<li
			v-for="(project, k) in store.tasksData.projects"
			:ref="e => setItemDomRef(e as Element, k, project)"
			:key="project.id"
			class="flex flex-row w-full"
		>
			<router-link :to="`/projects/${project.id}`" class="w-full">
				<div class="w-full">
					<span>{{ project.name }}</span>
					<div class="badge ml-2 success">
						{{ project.items.length }}
					</div>
				</div>
				<button class="btn btn-error btn-sm" @click.prevent="deleteProject(project.id)">
					Delete
				</button>
			</router-link>
		</li>
	</ul>
	<div>
		<div class="flex justify-center mt-4">
			<button class="btn btn-primary btn-sm" @click="showNewProjectMenu = true">Add Project</button>
		</div>
		<form v-if="showNewProjectMenu" class="flex items-center px-5 mt-4" @submit="onNewProjectSave">
			<input
				ref="newProjectInputDomRef"
				v-model="newProjectName"
				placeholder="My Project"
				class="input input-sm input-primary"
			/>
			<button type="submit" class="ml-4 btn btn-primary btn-sm" :disabled="newProjectName === ''">
				Save
			</button>
		</form>
	</div>
</template>
