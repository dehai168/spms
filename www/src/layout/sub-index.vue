<template>
	<router-view :key="key" />
</template>

<script>


export default {
	computed: {
		key() {
			return this.$route.path
		}
	}
}
</script>

<style lang="scss" scoped>
</style>
