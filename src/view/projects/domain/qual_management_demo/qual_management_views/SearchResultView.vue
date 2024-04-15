<script>
export default{
  name: "SearchResultView",
  props:{
    searchResults: Array
  }
}

</script>

<template>
  <div>
    <div v-if="searchResults && searchResults.length">
      Rendering Results
    </div>
    <div v-else>
      No results found or search not yet performed.
    </div>
  </div>
</template>

<style scoped>

</style>