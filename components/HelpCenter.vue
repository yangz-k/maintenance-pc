<template>
	<!--<el-dialog
	  class="helpCenterCon"
      title=""
      :visible.sync="newUser"
      :show-close="false"
      :top="'0'"
      :close-on-click-modal="false"
    >-->
	<div class="box" :style="bg_img" v-if="newUser">
		<div class="guidebox guide-0" style="display: block;" @click="nextStep()">
			<img src="~/assets/img/SystemManagement/newGuide/1.1.jpg" />
			<div class="downward" :style="bg_imgs"></div>
		</div>
		<div class="guidebox guide-1" @click="nextStep()">
			<img src="~/assets/img/SystemManagement/newGuide/2.1.jpg" />
		</div>
		<div class="guidebox guide-2" @click="nextStep()">
			<img src="~/assets/img/SystemManagement/newGuide/3.1.jpg" />
		</div>
		<div class="guidebox guide-3" @click="nextStep()">
			<img src="~/assets/img/SystemManagement/newGuide/4.1.jpg" />
		</div>
		<div class="guidebox guide-4" @click="nextStep()">
			<img src="~/assets/img/SystemManagement/newGuide/5.1.jpg" />
		</div>
		<div class="guidebox guide-5" @click="nextStep()">
			<img src="~/assets/img/SystemManagement/newGuide/6.1.jpg" />
		</div>
		<div class="guidebox guide-6" @click="nextStep()">
			<img src="~/assets/img/SystemManagement/newGuide/7.1.jpg" />
			<button @click="nextStep()">知道了</button>
		</div>
		<div class="guidebox guide-7" @click="nextStep()">
			<img src="~/assets/img/SystemManagement/newGuide/8.1.jpg" />
		</div>
		<div class="guidebox guide-8" @click="nextStep()">
			<img src="~/assets/img/SystemManagement/newGuide/9.13.png" style="height:78%;top:7%;">
			<button @click=" goIndex()">我知道啦~</button>
			<button @click="goFirstStep()">还想再看一遍</button>
		</div>
	</div>
	<!--</el-dialog>-->
</template>
<script>
import Cookie from "js-cookie";
import api from "~/config/http";
import axios from "axios";
import { Message, MessageBox } from "element-ui";
	export default {
		data() {
			return {
				n: 0,
				bg_img: {
					backgroundImage: "url(" + require("@/assets/img/SystemManagement/newGuide/one.jpg") + ")"
				},
				bg_imgs: {
					backgroundImage: "url(" + require("@/assets/img/SystemManagement/newGuide/downward.jpg") + ")"
				},
				newUser: false

			}
		},
		methods: {
			userStatus(data){//判断用户是否首次登陆
		  	  let _this = this;
	  		  api.post(api.forent_url.maintenance_service_url +
		        "/login/postNewFunctionStatus", 
		        {
		        	userId: data.id,
					versionNo: api.versionNumber
		        }
		  		)
		  		.then(function(response) {
		        let code = response["code"];
		        if(code == "success") {
		          let status = response.data;
					if(status=="0"){
						_this.newUser = true
					}else{
//						alert(1)
					}
		        } else {
		          _this.$Message.error(response["message"]);
		        }
		      })
		      .catch(function(err) {
		        console.log(err);
		      });
		  	},
			nextStep(nn) {
				this.n++;
				if(this.n >= 9) this.n = 9;
				$(".guidebox").eq(this.n).show().siblings().hide();
			},
			onMouseScroll(e) {
				e.preventDefault();
				var wheel = e.originalEvent.wheelDelta || -e.originalEvent.detail;
				var delta = Math.max(-1, Math.min(1, wheel));
				if(delta < 0) { //向下滚动
					this.n++;
					if(this.n >= 9) this.n = 9;
				} else { //向上滚动
					this.n--;
					if(this.n <= 0) this.n = 0;
				}
				$(".guidebox").eq(this.n).show().siblings().hide();
			},
			goFirstStep(e) {
				event.stopPropagation();
				this.n = 0;
				$(".guidebox").eq(this.n).show().siblings().hide();
			},
			goIndex() {
				let userId = api.getGlobalVal("maintenance_userObj").id,_this=this;
				api.post(api.forent_url.maintenance_service_url +
						"/login/addNewFunctionClick", {
							versionNo: api.versionNumber,
							terminal: "web",
							userId: userId
						}
					)
					.then(function(response) {
						let code = response["code"];
						if(code == "success") {
							let data = api.getGlobalVal("maintenance_userObj");
								data.status = '0';
								api.setGlobalVal("maintenance_userObj", JSON.stringify(data));
								_this.newUser = false;
						} else {
							_this.$Message.error(response["message"]);
						}
					})
					.catch(function(err) {
						_this.$Message.error(err);
					});
			}
		},
		mounted() {
			$(document).on('mousewheel DOMMouseScroll', this.onMouseScroll);
			this.userStatus(api.getGlobalVal("maintenance_userObj"))
		}
	}
</script>
<style lang="scss" scoped>
	* {
		padding: 0;
		margin: 0
	}
	
	html,
	body {
		width: 100%;
		height: 100%;
	}
	
	.helpCenterCon {}
	
	.box {
		width: 100%;
		height: 100%;
		overflow: hidden;
		position: absolute;
		/*background-image:url(./resources/statics/maintenance/img/newGuide/one.jpg);*/
		background-size: 100% 100%;
		top: 0;
		z-index: 10001;
	}
	
	.guidebox {
		width: 100%;
		height: 100%;
		position: absolute;
		left: 0;
		top: 0;
		display: none;
	}
	
	.guidebox button {
		position: absolute;
		background: rgba(255, 0, 0, .5);
		cursor: pointer;
		width: 12%;
		height: 6%;
		opacity: 0;
	}
	
	.guidebox img {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		margin: auto;
		width: 78%;
		height: auto;
	}
	
	.guidebox .downward {
		position: absolute;
		left: 47.5%;
		/*bottom:16%;*/
		width: 3.5%;
		height: 6%;
		/*// background-image:url(./resources/statics/maintenance/img/newGuide/downward.jpg);*/
		background-size: 100% 100%;
		z-index: 10;
		animation: updown 3s ease infinite;
	}
	
	.guide-8 button:nth-of-type(1) {
		bottom: 8%;
		left: 37%;
	}
	
	.guide-8 button:nth-of-type(2) {
		bottom: 8%;
		left: 51.5%;
	}
	
	@keyframes updown {
		0% {
			bottom: 17%;
		}
		50% {
			bottom: 15%;
		}
		100% {
			bottom: 17%;
		}
	}
</style>