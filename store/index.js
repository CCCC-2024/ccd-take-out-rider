import Vue from "vue";
import Vuex from "vuex"
Vue.use(Vuex);
let index = 0;
const store = new Vuex.Store({
	state: {
		getData: "",
    gethallData: "",
	},
	mutations: {
		changeValue(state, provider) {
			let a = index++;
			this.state.getData = provider + a
		},
    changehallValue(state, provider) {
    	let a = index++;
    	this.state.gethallData = provider + a
    },
	},
	// 从基本数据(state)派生的数据，相当于state的计算属性
	getters: {

	},
	// 和mutation的功能大致相同，不同之处在于 ==》1. Action 提交的是 mutation，而不是直接变更状态。 2. Action 可以包含任意异步操作。
	actions: {},
});
export default store;
