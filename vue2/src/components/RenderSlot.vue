<script>
export default {
  name: "RenderSlot",
  data() {
    return {
       num: 1
    }
  },
  methods: {
    total() {
      this.num = this.num + 1
    }
  },
  render() {
  	console.log(this.num, 'num')
  	return <div>
  	  <el-button on-click={() => this.total()}>点击</el-button>
  	  <div>{this.num}</div>
  	</div>
  }
}  
</script>