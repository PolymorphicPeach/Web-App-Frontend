<script>
import GridWindow from "@/view/projects/domain/algorithms/grid/GridWindow.vue";
import DepthFirstSearchController from "@/view/projects/domain/algorithms/component/DepthFirstSearchController.vue";

export default{
  name: "AlgorithmsView",
  components: {
    DepthFirstSearchController: DepthFirstSearchController,
    GridWindow: GridWindow,
  },
  data(){
    return{
      mode: "ShortestPath",
      inserting: "Start",
      reset: false,
    }
  },
  methods: {
    setMode(mode){
      console.log("Algorithms View: mode = " + this.mode);
      console.log("Algorithms View: inserting = " + this.inserting);
      this.mode = mode;
    },
    setInserting(inserting){
      this.inserting = inserting;
    },
  }
}

</script>

<template>
  <div class="grid grid-cols-2 grid-rows-12 w-screen h-screen">
    <div class="col-span-2 row-span-10">
      <GridWindow v-bind:mode="mode" v-bind:inserting="inserting"/>
    </div>

    <div>
      <DepthFirstSearchController @mode="setMode" @inserting="setInserting"/>
    </div>
  </div>

<!--  <div class="relative flex z-0 justify-center h-screen w-screen">-->
<!--    <GridWindow/>-->
<!--    <DepthFirstSearchController/>-->
<!--  </div>-->
</template>

<style scoped>

</style>