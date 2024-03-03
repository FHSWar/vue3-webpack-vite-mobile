<template>
	<!-- 路由入口 -->
	<router-view v-slot="{ Component }">
		<keep-alive :exclude="excludeList">
			<component :is="Component" />
		</keep-alive>
	</router-view>
</template>

<script lang="ts" setup>
const excludeList: string[] = []
</script>
