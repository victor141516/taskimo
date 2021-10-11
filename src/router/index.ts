import { createRouter, createWebHistory } from 'vue-router'

import ProjectList from '../pages/project-list.vue'
import ProjectItemList from '../pages/project-item-list.vue'
import ProjectItemComponent from '../pages/project-item.vue'
import NewProjectItem from '../pages/new-project-item.vue'
import { getItemPath } from '../store'
import { Project, ProjectItem } from '../lib/dto'

export const router = createRouter({
	history: createWebHistory(),
	routes: [
		{ path: '/', redirect: '/projects' },
		{ path: '/projects', component: ProjectList },
		{ path: '/projects/:projectId', component: ProjectItemList },
		{ path: '/projects/:projectId/new-item', component: NewProjectItem },
		{
			path: '/projects/:projectId/item/:itemId',
			component: ProjectItemComponent,
		},
		{
			path: '/projects/:projectId/item/:itemId/new-item',
			component: NewProjectItem,
		},
		{
			path: '/projects/:projectId/item/:itemId/item/:itemPath(.+)',
			component: ProjectItemComponent,
		},
		{
			path: '/projects/:projectId/item/:itemId/item/:itemPath(.+)/new-item',
			component: NewProjectItem,
		},
	],
})

export function goToParentItem() {
	const itemPath = getItemPath(router.currentRoute.value)
	const parentItemPath = itemPath.value.slice(0, itemPath.value.length - 1)
	const newPath = parentItemPath.reduce((acc, item, index) => {
		if (index === 0) {
			return `${acc}/${item!.id}`
		} else {
			return `${acc}/item/${item!.id}`
		}
	}, '/projects')
	console.log(newPath)
	router.push(newPath)
}

export function goToChildItem(childItem: Project | ProjectItem) {
	const itemPath = getItemPath(router.currentRoute.value)
	const childItemPath = itemPath.value.concat(childItem)
	const newPath = childItemPath.reduce((acc, item, index) => {
		if (index === 0) {
			return `${acc}/${item!.id}`
		} else {
			return `${acc}/item/${item!.id}`
		}
	}, '/projects')
	console.log(newPath)
	router.push(newPath)
}
