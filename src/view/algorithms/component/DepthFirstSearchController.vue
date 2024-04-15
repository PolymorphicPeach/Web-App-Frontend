<script>
export default{
  name: "DepthFirstSearchController",
  emits: ["mode", "inserting", "reset"],
  data(){
    return{
      mode: "ShortestPath",
      inserting: "Start",
      reset: false,
    }
  },
  methods: {
    emitMode(){
      this.$emit("mode", this.mode);
    },
    emitInserting(){
      this.$emit("inserting", this.inserting);
    },
  }
}
</script>

<template>
  <div class="grid grid-cols-2 grid-rows-3 bg-peach-black p-3">
    <div>
      <label for="mode" class="text-white p-2">Mode:</label>
      <select id="mode" class="rounded-md p-1" v-model="mode" @change="emitMode">
        <option value="ShortestPath">Shortest Path</option>
        <option values="NumberOfPaths">Number of Paths</option>
      </select>
    </div>

    <div class="p-3 text-white">
      hlikajsdlfk
    </div>

    <div>
      <label for="inserting" class="text-white p-2">Insert:</label>
      <select id="inserting" class="rounded-md p-1" v-model="inserting" @change="emitInserting">
        <option value="Start">Starting Position</option>
        <option value="Obstacle">Obstacle</option>
        <option value="Goal">Goal</option>
      </select>
    </div>

    <div class="p-3 text-white">
      ;aslkdfj;laskf
    </div>


  </div>

</template>

<style scoped>

</style>