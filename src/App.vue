<script setup lang="ts">
import Breadcrumbs from './components/breadcrumbs.vue'
import { Dexie } from 'dexie'

const db = new Dexie('FriendDatabase')
db.version(1).stores({
	friends: '++id,name,age',
})
</script>

<template>
	<div class="2xl:w-1/3 lg:w-1/2 mx-auto">
		<Breadcrumbs class="my-2 px-8" />
		<hr />
		<div class="pt-2">
			<router-view />
		</div>
	</div>
</template>
