<script>
import QualManagementNavBar from "@/view/qual_management_demo/navigation/QualManagementNavBar.vue";
import WorkerSearchView from "@/view/qual_management_demo/qual_management_views/WorkerSearchView.vue";
import AboutView from "@/view/qual_management_demo/qual_management_views/AboutView.vue";

export default{
  name: "QualManagementView",
  components:{
    QualManagementNavBar: QualManagementNavBar,
    AboutView: AboutView,
    WorkerSearchView: WorkerSearchView,

  },
  data(){
    return{
      currentView: "about",
    }
  },
  beforeMount(){

  },
  mounted(){

  },
  methods:{
    changeView(view){
      this.currentView = view;
    }
  }
}
</script>


<template>
  <QualManagementNavBar @change-view="changeView"/>

  <h1>Qual management</h1>

  <div v-if="currentView === 'about'">
    <AboutView/>
  </div>

  <div v-if="currentView === 'worker-search'">
    <WorkerSearchView/>
  </div>

</template>


<style scoped>

</style>