import { DateTime } from 'luxon'
import { getRandomText, slugify } from './text'
export enum ProjectItemStatus {
	Pending,
	Done,
}

export type InitialItemPath = [Project?, ...ProjectItem[]]
export type ItemPath = [Project, ...ProjectItem[]]

interface ProjectItemObject {
	id: string
	name: string
	path: string[]
	description: string
	status: ProjectItemStatus
	items: ProjectItemObject[]
	dueDate: number | undefined | null
}

interface ProjectObject {
	id: string
	name: string
	items: ProjectItemObject[]
}

export interface TasksDataObject {
	projects: ProjectObject[]
}

export class ProjectItem {
	id: string
	name: string
	private _pathIds: string[]
	private _path: ItemPath | InitialItemPath
	private _tasksData: TasksData | null = null
	description: string
	status: ProjectItemStatus
	items: Array<ProjectItem>
	dueDate: DateTime | null | undefined

	constructor(
		name: string,
		description: string,
		dueDate: DateTime | null | undefined = null,
		status: ProjectItemStatus = ProjectItemStatus.Pending,
		items: Array<ProjectItem> = [],
	) {
		this.id = slugify(name)
		this._pathIds = []
		this._path = []
		this.name = name
		this.description = description
		this.dueDate = dueDate
		this.status = status
		this.items = items
	}

	addItem(item: ProjectItem) {
		if (this.items.find((i) => i.id === item.id)) {
			item.id = `${slugify(item.name)}-${getRandomText(5)}`
			this.addItem(item)
		} else {
			item._path = [...this.path, this]
			this.items.push(item)
		}
	}

	getItem(id: string) {
		return this.items.find((i) => i.id === id)
	}

	removeItem(id: string) {
		this.items.splice(
			this.items.findIndex((i) => i.id === id),
			1,
		)
	}

	get path(): ItemPath {
		if (this._path.length === 0) {
			this._path = this._pathIds.reduce((acc, id) => {
				if (acc.length === 0) {
					return [this._tasksData!.getProject(id)!] as ItemPath
				} else {
					return [...acc, acc[acc.length - 1]!.getItem(id)!] as ItemPath
				}
			}, [] as InitialItemPath)
		}

		return this._path as ItemPath
	}

	set path(newPath: ItemPath) {
		this._path = newPath
	}

	get parentItem() {
		return this.path[this.path.length - 1]
	}

	toObject(): ProjectItemObject {
		return {
			id: this.id,
			name: this.name,
			path: this.path.map((i) => i!.id),
			description: this.description,
			dueDate: this.dueDate?.toMillis(),
			status: this.status,
			items: this.items.map((s) => s.toObject()),
		}
	}

	import(obj: ProjectItemObject, tasksData: TasksData) {
		this.id = obj.id
		this._tasksData = tasksData
		this._pathIds = obj.path
		this.name = obj.name
		this.description = obj.description
		this.dueDate = obj.dueDate ? DateTime.fromMillis(obj.dueDate) : null
		this.status = obj.status
		this.items = (obj.items ?? []).map((o) => {
			const pi = new ProjectItem('', '')
			pi.import(o, tasksData)
			return pi
		})
	}
}

export class Project {
	id: string
	name: string
	items: Array<ProjectItem>

	constructor(name: string, items: Array<ProjectItem> = []) {
		this.id = slugify(name)
		this.name = name
		this.items = items
	}

	addItem(item: ProjectItem) {
		if (this.items.find((i) => i.id === item.id)) {
			item.id = `${slugify(item.name)}-${getRandomText(5)}`
			this.addItem(item)
		} else {
			item.path = [this]
			this.items.push(item)
		}
	}

	getItem(id: string) {
		return this.items.find((i) => i.id === id)
	}

	removeItem(id: string) {
		this.items.splice(
			this.items.findIndex((i) => i.id === id),
			1,
		)
	}

	toObject() {
		return {
			id: this.id,
			name: this.name,
			items: this.items.map((i) => i.toObject()),
		}
	}

	import(obj: ProjectObject, tasksData: TasksData) {
		this.id = obj.id
		this.name = obj.name
		this.items = (obj.items ?? []).map((i) => {
			const pi = new ProjectItem('', '')
			pi.import(i, tasksData)
			return pi
		})
	}
}

export class TasksData {
	projects: Array<Project> = []

	addProject(project: Project) {
		if (this.projects.find((p) => p.id === project.id)) {
			project.id = `${slugify(project.name)}-${getRandomText(5)}`
			this.addProject(project)
		} else {
			this.projects.push(project)
		}
	}

	getProject(id: string) {
		return this.projects.find((p) => p.id === id)
	}

	deleteProject(id: string) {
		this.projects.splice(
			this.projects.findIndex((p) => p.id === id),
			1,
		)
	}

	getAllItems(): ProjectItem[] {
		const allItems: ProjectItem[] = []
		const innerGetAllItems = (item: Project | ProjectItem) => {
			const innerItems: ProjectItem[] = []
			for (const i of item.items) {
				innerItems.push(i)
				if (i.items && i.items.length > 0) {
					innerItems.push(...innerGetAllItems(i))
				}
			}
			return innerItems
		}

		for (const project of this.projects) {
			allItems.push(...innerGetAllItems(project))
		}

		return allItems
	}

	toObject(): TasksDataObject {
		return {
			projects: this.projects.map((p) => p.toObject()),
		}
	}

	import(obj: TasksDataObject) {
		this.projects = (obj.projects ?? []).map((o) => {
			const p = new Project('')
			p.import(o, this)
			return p
		})
	}
}
