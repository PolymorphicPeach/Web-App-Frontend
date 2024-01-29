<script>
import StatueScene from "@/component/StatueScene.vue"
import EldritchScene from "@/component/EldritchScene.vue"
export default {
  name: "HomeView",
  components: {
    StatueScene,
    EldritchScene
  },
  mounted(){
    // Intentionally blank
  },
  methods: {
    // Intentionally blank
  }
}
</script>

<template>
  <div>
    <EldritchScene/>
<!--    <StatueScene/>-->
  </div>
</template>