<script>
export default{
  name: "QualManagementNavBar",
  data(){
    return {
      currentView: "about" // default view
    }
  },
  methods: {
    changeView(view) {
      this.currentView = view;
    }
  }
}
</script>

<template>


  <nav class="bg-peach-peach border-gray-200">
    <h1 class="ml-10 text-2xl">Qualification Management Demo</h1>
    <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
      <!-- Mobile Menu Button and others unchanged -->
      <div class="hidden w-full md:block md:w-auto" id="navbar-default">
        <ul class="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0">
          <li>
            <button @click="$emit('change-view', 'about')"
                    class="block py-2 px-3 text-white bg-peach-black rounded">
              About</button>
          </li>
          <li>
            <button @click="$emit('change-view', 'add-worker')"
                    class="block py-2 px-3 text-white bg-peach-black rounded">
              Add Workers
            </button>
          </li>
          <li>
            <button @click="$emit('change-view', 'worker-search')"
                    class="block py-2 px-3 text-white bg-peach-black rounded">
              Worker Management
            </button>
          </li>
        </ul>
      </div>
    </div>
  </nav>



</template>

<style scoped>

</style>