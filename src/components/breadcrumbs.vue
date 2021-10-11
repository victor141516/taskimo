<script setup lang="ts">
import { useRoute } from 'vue-router'
import { Project, ProjectItem } from '../lib/dto'
import { getItemPath } from '../store'

const route = useRoute()
const itemPath = getItemPath(route)

const getUrl = (item: Project | ProjectItem) => {
	let url = ''
	for (const e of itemPath.value) {
		const type = e instanceof Project ? 'projects' : 'item'
		url += `/${type}/${e.id}`
		if (e === item) {
			break
		}
	}
	return url
}
</script>

<template>
	<div class="text-sm breadcrumbs">
		<ul>
			<li>
				<a href="/projects">Projects</a>
			</li>
			<li v-for="item in itemPath" :key="item!.id">
				<a :href="getUrl(item!)">{{ item!.name }}</a>
			</li>
		</ul>
	</div>
</template>
