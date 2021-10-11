import { reactive } from '@vue/reactivity'
import { computed } from 'vue'
import { RouteLocationNormalizedLoaded } from 'vue-router'
import { TasksData, ItemPath, InitialItemPath } from '../lib/dto'

const tasksData = new TasksData()
tasksData.import(JSON.parse(localStorage.getItem('tasksData') ?? '{}'))
export const store = reactive({ tasksData }) as { tasksData: TasksData }
export function saveTasksData(): void {
	localStorage.setItem('tasksData', JSON.stringify(tasksData.toObject()))
	console.log('Saved!')
}
export const getItemPath = (route: RouteLocationNormalizedLoaded) =>
	computed(() => {
		const path: InitialItemPath = []

		if (route.params.projectId) {
			const project = store.tasksData.getProject(route.params.projectId as string)!
			path.push(project)

			if (route.params.itemId) {
				path.push(project.getItem(route.params.itemId as string)!)

				if (route.params.itemPath) {
					// eslint-disable-next-line prettier/prettier
					(route.params.itemPath as string).split('/item/').forEach((id) => {
						if (path.length === 1) {
							path.push(project.getItem(id)!)
						} else {
							path.push(path[path.length - 1]!.getItem(id)!)
						}
					})
				}
			}
		}
		return path as ItemPath
	})
