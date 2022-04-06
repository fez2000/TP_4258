<template>
  <footer class="footer">
    <div class="container">
      <nav>
        <ul>
          <li>
            <a href="/">Creative Tim</a>
          </li>
          <li>
            <a href="#">
              Forum
            </a>
          </li>
          <li>
            <a href="/terms">
              Terms
            </a>
          </li>
        </ul>
      </nav>
      <div class="copyright text-center">
        &copy; 2019
        <a :href="autorRef" target="_blank"
          >{{autor}}</a
        >, made with <i class="fa fa-heart heart"></i> 
      </div>
    </div>
  </footer>
</template>
<script>
export default {
  data: {
    autor: process.env.AUTOR,
    autorRef: process.env.AUTORREF
  }
};
</script>
<style></style>
