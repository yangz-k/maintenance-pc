<template>
	<el-row class="content-main">
		<el-row class="l-head headTitle" type="flex" justify="space-between" align="middle">
			<el-col :span="6">
				<!-- 面包屑 -->
				<Title />
			</el-col>

				<el-button @click="goBack()" class="goBack" type="text" icon="maintenance-back1">返回</el-button>

		</el-row>
		<el-row v-loading="loading" class="addUserCon bg-white">
			<el-row class="addUserConM">
				<el-form class="addUser" :model="saveData" :rules="rules" ref="ruleForm" >
					<el-row type="flex" justify="space-between" align="middle" class="detailTitle">
						<el-col :span="2" class='div-flex align_center fs20px pdl-15px'>添加账号</el-col>
						<el-col :span="2" class='div-flex all_center'>
							<el-button class="wb-edit fs18px" @click="saveUserMessage()" type="text" icon="maintenance-save">&nbsp;保存</el-button>
						</el-col>
					</el-row>
					<el-form-item prop="userTelphone" class='div-flex'>
						<el-row class="fs16px" type="flex" justify="center" align="middle">
							<el-col :span="11" class='div-flex align_center'>
								<label class=""><span><span class="must">*</span>手</span><span>机</span><span>号 :</span></label>
								<el-col :span="16">
									<el-input :disabled="userEdit==='edit'" class="userTelphone" v-model="saveData.userTelphone" placeholder="请输入手机号"></el-input>
								</el-col>
								<span class="newPhoneStatus" :class="phoneClass"></span>
								<span v-if="userEdit==='edit'" class="changePhone"  @click="dialogVisible = true">修改手机号</span>
							</el-col>
						</el-row>
					</el-form-item>
					<el-form-item prop="loginName" class='div-flex'>
						<el-row class="fs16px" type="flex" justify="center" align="middle">
							<el-col :span="11" class='div-flex align_center'>
								<label class=""><span><span class="must">*</span>用</span><span>户</span><span>名 :</span></label>
								<el-col :span="16">
									<el-input :disabled="userEdit==='edit'" class="loginName" minlength="1" maxlength="14"  v-model="saveData.loginName" placeholder="以字母开头，字母或字母数字组合形式，1~14位字符"></el-input>
								</el-col>
							</el-col>
						</el-row>
					</el-form-item>
					<el-form-item prop="password" class='div-flex'>
						<el-row class="fs16px" type="flex" justify="center" align="middle">
							<el-col :span="11" class='div-flex align_center'>
								<label class=""><span><span class="must">*</span>密</span><span>码 :</span></label>
								<el-col :span="16">
									<el-input ref="_password" type="password" :readonly="noWrite" :disabled="userEdit==='edit'" v-model="saveData.password" placeholder="密码为6~14位，英文字母+数字组合"></el-input>
								</el-col>
							</el-col>
						</el-row>
					</el-form-item>
					<el-form-item prop="repeatPassword" class='div-flex' v-if="userEdit=='edit'? false : true">
						<el-row class="fs16px" type="flex" justify="center" align="middle">
							<el-col :span="11" class='div-flex align_center'>
								<label class=""><span><span class="must">*</span>确</span><span>认</span><span>密</span><span>码 :</span></label>
								<el-col :span="16">
									<el-input  ref="repeatPassword" :readonly="noWrite" type="password" v-model="saveData.repeatPassword" placeholder="请确认密码"></el-input>
								</el-col>
							</el-col>
						</el-row>
					</el-form-item>
					<el-form-item prop="userName" class='div-flex'>
						<el-row class="fs16px" type="flex" justify="center" align="middle">
							<el-col :span="11" class='div-flex align_center'>
								<label class=""><span><span class="must">*</span>姓</span><span>名 :</span></label>
								<el-col :span="16">
									<el-input v-model="saveData.userName" placeholder="1~10个字符"></el-input>
								</el-col>
							</el-col>
						</el-row>
					</el-form-item>
					<el-form-item class='div-flex'>
						<el-row class="fs16px" type="flex" justify="center" align="middle">
							<el-col :span="11" class='div-flex align_center'>
								<label class=""><span><span class="must">*</span>性</span><span>别 :</span></label>
								<el-col :span="16" class="wb-checked">
									<el-radio v-model="saveData.userSex" label="0">男</el-radio>
  									<el-radio v-model="saveData.userSex" label="1">女</el-radio>
								</el-col>
							</el-col>
						</el-row>
					</el-form-item>
					<el-form-item prop="userCardNo" class='div-flex'>
						<el-row class="fs16px" type="flex" justify="center" align="middle">
							<el-col :span="11" class='div-flex align_center'>
								<label class=""><span>身</span><span>份</span><span>证</span><span>号 :</span></label>
								<el-col :span="16">
									<el-input v-model="saveData.userCardNo" placeholder="请输入身份证号码"></el-input>
								</el-col>
							</el-col>
						</el-row>
					</el-form-item>
					<el-form-item prop="" class='div-flex'>
						<el-row class="fs16px" type="flex" justify="center" align="middle">
							<el-col :span="11" class='div-flex align_center'>
								<label class=""><span>年</span><span>龄 :</span></label>
								<el-col :span="16">
									<el-input v-model="saveData.age" placeholder="请输入年龄"></el-input>
								</el-col>
							</el-col>
						</el-row>
					</el-form-item>
					<el-form-item prop="roleArray" class='div-flex'>
						<el-row class="fs16px" type="flex" justify="center" align="middle">
							<el-col :span="11" class='div-flex'>
								<label class=""><span>选</span><span>择</span><span>角</span><span>色 :</span></label>
								<el-col :span="16">
									<!--<el-input v-model="userInfo.userName" placeholder="请确认密码"></el-input>-->
									<el-tree
									  ref='Ztree'
									  :data="roleArray"
									  show-checkbox
									  node-key="id"
									  @check-change.self="handleChckClik"
									  :default-expanded-keys="[]"
									  :default-checked-keys='checkedRole'
									  :props="defaultProps">
									</el-tree>
								</el-col>
							</el-col>
						</el-row>
					</el-form-item>
					<el-form-item class='div-flex'>
						<el-row class="fs16px" type="flex" justify="center" align="middle">
							<el-col :span="11" class='div-flex align_center'>
								<label class=""><span>岗</span><span>位 :</span></label>
								<el-col :span="16">
									<el-select v-model="saveData.postCodes" placeholder="请选择" style="width:100%;">
									    <el-option
									      v-for="item in positionList"
									      :key="item.positionId"
									      :label="item.positionName"
									      :value="item.positionId">
									    </el-option>
									  </el-select>
								</el-col>
							</el-col>
						</el-row>
					</el-form-item>
				</el-form>
			</el-row>
		</el-row>
		 <el-dialog class="changeTel" title="修改手机号" :top="'0'" :visible.sync="dialogVisible" width="28%" :before-close="closeChangeTel">
	      <el-form :model="saveData" label-width="100px" :rules="rules" ref="changeTelForm">
	      	<el-form-item label="已绑定手机号">
	      		<el-row>
	      			<el-col :span="18">
	      				{{saveData.userTelphone}}
	      			</el-col>
	      		</el-row>

	        </el-form-item>
	        <el-form-item label="新手机号" prop="changeUserTelphone">
	          <el-row>
	      			<el-col :span="17">
	      				<el-input v-model="saveData.changeUserTelphone"></el-input>
	      			</el-col>
	      		</el-row>
	        </el-form-item>
	        <el-form-item label="验证码" prop='captcha'>
	          <el-row type="flex"  align="middle">
	      			<el-col :span="17">
	      				<el-input v-model="saveData.captcha"></el-input>
	      			</el-col>
	      			<el-col :span="6">
	      				<el-button class="getVerificationCode" type="primary" @click="getVerificationCode()">获取验证码</el-button>
	      			</el-col>

      		  </el-row>

	        </el-form-item>
	      </el-form>
	      <el-row type="flex" justify="center" align="middle" slot="footer" class="dialog-footer">
	        <el-button class="wb-clear" style="margin-right: .15rem;" @click="closeChangeTel()" round>取 消</el-button>
	        <el-button class="wb-sure" round @click="submitNewTel()">确 定</el-button>
	      </el-row>
	    </el-dialog>
	</el-row>
</template>
<script>
	import api from "~/config/http";
	import Title from "~/components/Title";
	import Table from "~/components/Table";
	import { Message, MessageBox } from "element-ui";
	import validate from "~/plugins/validate";
	export default {
		components: {
			Title,
			Table
		},
		data() {
			let userPhone = (rule, value, callback) =>{
				const reg = /^1[3456789]\d{9}$/;
				this.canSave = false;
				if(!value){
					callback(new Error('手机号不能为空'));
				}else{
					if((!reg.test(value)) && value != ''){
						 callback(new Error('请输入正确的电话号码'));
						 this.phoneClass = "maintenance-desRemove wb-desRemove";
					}else{
						this.canSave = true;
						callback(this.verifyPhone(value));
					}
				}
			};
			let loginName = (rule, value, callback) =>{
				const reg = /^[A-Za-z][A-Za-z0-9]{0,13}$/;
				if(!value){
					callback(new Error('用户名不能为空'));
				}else{
					if((!reg.test(value)) && value != ''){
						 callback(new Error('请按规则填写用户名(以字母开头，字母或字母数字组合形式)，1~14位字符'));
					}else{
						callback();
					}
				}
			}
			let password = (rule, value, callback) =>{
				const reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/;
				if(!value){
					callback(new Error('密码不能为空'));
				}else{
					if((!reg.test(value)) && value != ''){
						 callback(new Error('请按规则填写密码(密码为6~14位，英文字母+数字组合)'));
						 this.$refs.ruleForm.validateField('repeatPassword');
					}else{
						callback();
					}
				}
			}
			let repeatPassword = (rule, value, callback) =>{
				const reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/;
				if(!value){
					callback(new Error('请再次输入密码'));
				}else{
					if(value !==this.saveData.password){
						 callback(new Error('两次输入密码不一致!'));
					}else{
						callback();
					}
				}
			}
			let userName = (rule, value, callback) =>{
				const reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/;
				if(!value){
					callback(new Error('姓名不能为空'));
				}else{
					if(value.trim().length < 1 || value.trim().length > 10){
						 callback(new Error('请按规则填写姓名(1~10个字符)'));
					}else{
						callback();
					}
				}
			}
			let userCardNo = (rule, value, callback) =>{
				const reg = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/;
					if(value){
						if((!reg.test(value))){
							 callback(new Error('请输入有效的身份证号'));
						}else{
							callback(this.getAge(value));
						}
					}
			};
			return {
				IDinfo: api.getGlobalVal("maintenance_userObj"), //用户信息
				phoneClass:'',//class类名
				dialogVisible:false,
				saveOrEcho:"",//新建还是回显
				canSave:false,//是否可以保存
				saveData: {//新建用户参数
					userTelphone: "",
					userName: "",
					password: "",
					repeatPassword:"",
					loginName: "",
					userCardNo: "",
					roleIds: "",
					roleArray: [],
					postCodes: "",
					userSex: "0",
					sysCode: "",
					dataRes: "",
					age: "",
					orgCode: "",
					createUserId: "",
					updateUserId: "",
					positionId: "",
					sysStatus: "",
					changeUserTelphone:"",
					captcha:"",//验证码
				},
				userEdit:"",//新增还是编辑
				checkedRole:[],//选中的角色
				roleArray:[],//角色列表
				positionList: [],//岗位列表
				verificationCodeTimer:null,//计时器
				canClick:true,
        noWrite:false,
        loading:false,
				defaultProps: {//tree
		          children: 'children',
		          label: 'label'
		       },
				rules:{
					loginName:[//验证登录名
						{ validator: loginName, trigger: 'blur'}
					],
					userTelphone:[//验证用户手机
						{ validator: userPhone, trigger: 'blur' }
					],
					changeUserTelphone:[//验证新手机号
						{ validator: userPhone, trigger: 'blur' }
					],
					password:[//验证密码
						{ validator: password, trigger: 'blur'}
					],
					repeatPassword:[//
						{ validator: repeatPassword, trigger: 'blur'}
					],
					userName:[//验证用户名
						{ validator: userName, trigger: 'blur'}
					],
					userCardNo:[//验证身份证
						{ validator: userCardNo, trigger: 'blur'}
					],
					roleArray:[//验证角色
						{ required: true, message: '请选择角色', trigger: 'change' }
					],
					captcha:[//
						{ required: true, message: '请输入验证码', trigger: 'change' }
					],
				}
			}
		},
		methods: {
			goBack(){
				let that = this;
				if(that.userEdit ==="edit"){
					this.$router.push({
						name: 'SystemManagement-UserManagement-userInformation',
						params: {
							userId: that.saveData.userId
						}
					})
				}else{
					this.$router.back(-1)
				}
			},
			initData(){//初始化数据
				let userId = this.$route.params.userId,that = this;
				let userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
				sessionStorage.removeItem("userInfo");
				if(userInfo){
					that.userEdit = "edit";
					$.extend(true, that.saveData, userInfo);
					that.saveData.userSex = that.saveData.userSex == "男" ? "0" : that.saveData.userSex == "女" ? "1" : "2";
					that.saveData.password = "a123456"
				}

				api.get(//获取岗位
					api.forent_url.maintenance_service_url + "/userAuth/getStationListByOrgAndSys", {

					}
				).then(function(res) {
					let code = res["code"];
					if(code == "success") {
						let data = res["data"];
						that.positionList = data;
						if(userInfo){
							that.saveData.postCodes = userInfo.positionId
						}
					} else {
						Message.error(res.message);
					}
				})
				.catch(function(err) {
					Message.error(err);
				});
				api.get(//获取角色
					api.forent_url.maintenance_service_url + "/userAuth/getRoleListByOrgAndSys", {
						sysCodes: that.IDinfo.sysCode_web + "," + that.IDinfo.sysCode_app,
						orgCode: that.IDinfo.orgCode
					}
				).then(function(res) {
					let code = res["code"];
					if(code == "success") {
						let data = res["data"];
//						that.saveData.roleArray = data;
						data.forEach(item=>{
							if(item.pId ==="0"){
								that.roleArray.push(
									{
										id:item.id,
										label:item.name,
										children:[]
									}
								)
							}
						})
						that.roleArray.forEach(item=>{
							for(let i in data){
								if(data[i].pId === item.id){
									item.children.push({
										id:data[i].id,
										label:data[i].name,
										pId:item.id
									})
								}
							}
						})
						if(userInfo){
							that.$nextTick(function() {
								that.checkedRole =userInfo.roleids.split(",")// 绑定要勾选的角色
							})
						}
					} else {
						Message.error(res.message);
					}
				})
				.catch(function(err) {
					Message.error(err);
				});
			},
			verifyPhone(num){
				let that = this;
				api.get(
					api.forent_url.maintenance_service_url + "/userAuth/getUserInfoByPhone", {
						phoneNum: num,
						orgCode: that.IDinfo.orgCode
					}
				).then(function(res) {
					let code = res["code"];
					if(code == "success") {
						let data = res["data"];
						if(!data.userExist) {
							that.phoneClass = "maintenance-sure wb-addSure";
							that.saveOrEcho = "save";
							return;
						}
						if(data.userExist && data.userOrgExist) {
							that.phoneClass = "maintenance-aroundNotice wb-aroundNotice";
							that.$confirm('手机已在本单位注册,是否为您跳转到列表页查看', "提示", {
								confirmButtonText: "确定",
								cancelButtonText: "取消",
								type: "info"
							})
							.then(()=>{
								that.$router.push({
									name: 'SystemManagement-UserManagement',
									params: {

									}
								})
							})
							.catch(()=>{

							})
							return;
						}
						if(data.userExist && !data.userOrgExist) {
							that.phoneClass = "maintenance-aroundNotice wb-aroundNotice";
//										that.saveOrEcho = "echo";
							that.impower(data.user);
							return;
						}
					} else {
						Message.error(res.message);
					}
				})
				.catch(function(err) {
					Message.error(err);
				});
			},
			impower(res){//是否对用户授权
				let that = this;
				that.$confirm('已有其他系统账号确定对该用户授权吗', "提示", {
					confirmButtonText: "确定",
					cancelButtonText: "取消",
					type: "info"
				})
				.then(()=>{
//					that.isEcho = true;
//					that.isEchoOrEdit = true;
					that.saveOrEcho = "echo";
					$.extend(true, that.saveData, res);
					that.saveData.password="a123456";
					that.saveData.repeatPassword = "a123456";
					that.noWrite = true
				})
				.catch(()=>{
					Message.warning('请更换手机号重新注册');
//					that.saveData.userTelphone = "";
					$(".userTelphone .el-input__inner").focus();
				})
			},
			getAge(identityCard) {//根据身份证获取年龄
				let len = (identityCard + "").length,that=this;
				if(len == 0) {
					return 0;
				} else {
					if((len != 15) && (len != 18)) //身份证号码只能为15位或18位其它不合法
					{
						return 0;
					}
				}
				let strBirthday = "";
				if(len == 18) //处理18位的身份证号码从号码中得到生日和性别代码
				{
					strBirthday = identityCard.substr(6, 4) + "/" + identityCard.substr(10, 2) + "/" + identityCard.substr(12, 2);
				}
				if(len == 15) {
					strBirthday = "19" + identityCard.substr(6, 2) + "/" + identityCard.substr(8, 2) + "/" + identityCard.substr(10, 2);
				}
				//时间字符串里，必须是“/”
				let birthDate = new Date(strBirthday);
				let nowDateTime = new Date();
				let age = nowDateTime.getFullYear() - birthDate.getFullYear();
				//再考虑月、天的因素;.getMonth()获取的是从0开始的，这里进行比较，不需要加1
				if(nowDateTime.getMonth() < birthDate.getMonth() || (nowDateTime.getMonth() == birthDate.getMonth() && nowDateTime.getDate() < birthDate.getDate())) {
					age--;
				}
				that.saveData.age = age;
			},
			handleChckClik(){//tree节点选项发生改变时回调
				let that = this,data,roleWebIds="",roleAppIds="",roleArray=[];
				that.saveData.roleArray = [];
				data = that.$refs.Ztree.getCheckedNodes(true);
				data.forEach(item=>{
					if(item.pId === "sys_maintenance_web"){
						if(!roleWebIds) {
							roleWebIds = item.id;
						} else {
							roleWebIds = roleWebIds + "," + item.id;
						}
					}
					if(item.pId === "sys_maintenance_app"){
						if(!roleAppIds) {
							roleAppIds = item.id;
						} else {
							roleAppIds = roleAppIds + "," + item.id;
						}
					}
				})
				if(roleWebIds){
					that.saveData.roleArray.push({
						sysCode: "sys_maintenance_web",
						roleIds: roleWebIds
					})
				}
				if(roleAppIds){
					that.saveData.roleArray.push({
						sysCode: "sys_maintenance_app",
						roleIds: roleAppIds
					})
				}
				roleArray = that.saveData.roleArray;
				return roleArray;
			},
			getVerificationCode() {//获取验证码
				let that = this;
				if(that.canClick){
					that.canClick = false;
					api.post(
						api.forent_url.maintenance_service_url + "/userAuth/sendCaptcha",{
							telephone:that.saveData.userTelphone
						}
					).then(function(res) {
						let code = res["code"];
						if(code == "success") {
							let data = res["data"]
							if(data.status == '1') {
								Message.success("验证码已发送到手机，请查收！");
								let t = 60;
								that.verificationCodeTimer = setInterval(function() {
									$(".getVerificationCode").html(t + "s后重发");
									t--;
									if(t === 0) {
										$(".getVerificationCode").html("获取验证码");
										clearInterval(that.verificationCodeTimer);
										that.verificationCodeTimer = null;
										that.canClick = true;
									}
								}, 1000)
							} else {
								Message.error("验证码获取失败，请重新获取");
							}

						} else {
							Message.error(res.message);
						}
					})
					.catch(function(err) {
						Message.error(err);
					});
				}
			},
			closeChangeTel(){
			    let that = this;
				$(".getVerificationCode").html("获取验证码");
				clearInterval(that.verificationCodeTimer);
				that.verificationCodeTimer = null;
				this.$refs.changeTelForm.resetFields();
				that.canClick = true;
				that.dialogVisible = false;
			},
			submitNewTel(){//提交新手机号
				let that = this;
				this.$refs.changeTelForm.validate((valid)=>{
					if(valid){
						api.post(
							api.forent_url.maintenance_service_url + "/userAuth/checkCaptcha",{
								telephone: that.saveData.userTelphone,
								userId: that.saveData.userId,
								updateUserId: that.IDinfo.userId,
								captcha: that.saveData.captcha,
								newTelephone: that.saveData.changeUserTelphone
							}
						).then(function(res) {
							let code = res["code"];
							if(code == "success") {
								let data = res["data"]
								if(data.status == "0") {
									Message.error("请输入正确验证码");
									return false;
								}else{
									that.saveData.userTelphone = that.saveData.changeUserTelphone;
								}
								that.dialogVisible = false;
								that.closeChangeTel();
							} else {
								Message.error(res.message);
							}
						})
						.catch(function(err) {
							Message.error(err);
						});
					}else{
//						Message.warning("请输正确的手机号或验证码");
					}
				})

			},
			saveUserMessage(){//保存用户信息
				let that = this,url;
				that.canSave = true;
				this.$refs.ruleForm.validateField("loginName",(valid)=>{
					if(valid){
						that.canSave = false;
					}
				})
				this.$refs.ruleForm.validateField("password",(valid)=>{
					if(valid){
						that.canSave = false;
					}
				})
				this.$refs.ruleForm.validateField("repeatPassword",(valid)=>{
					if(valid){
						that.canSave = false;
					}
				})
				this.$refs.ruleForm.validateField("userName",(valid)=>{
					if(valid){
						that.canSave = false;
					}
				})
				this.$refs.ruleForm.validateField("roleArray",(valid)=>{
					if(valid){
						that.canSave = false;
					}
				})
				this.$refs.ruleForm.validateField("userCardNo",(valid)=>{
					if(valid){
						that.canSave = false;
					}
				})
//				this.$refs.ruleForm.validate((valid) => {

		          if (!that.canSave) {
		          	Message.error("请按要求完善用户信息")
		            return false;
		          } else {
                	that.loading = true;
		          	that.saveData.roleArray = JSON.stringify(that.saveData.roleArray);
		          	that.saveData.orgCode = that.IDinfo.orgCode;
		          	that.saveData.updateUserId = that.IDinfo.userId;
		          	if(that.userEdit == "edit"){
		          		let roleArray = that.handleChckClik();
		          		that.saveData.positionId=that.saveData.postCodes
		          		roleArray.forEach(function(item, index) {
							item.orgCode = that.IDinfo.orgCode;
							item.dataRes = that.IDinfo.sysCode_web; //+ "," + that.userObj.sysCode_app;
							item.userId = that.saveData.userId;
							item.createUserId = that.saveData.userId;
							item.sysStatus = that.IDinfo.userId;
						})
		          		api.post(//提交用户信息
							api.forent_url.maintenance_service_url + "/userAuth/updateUser",that.saveData
						).then(function(res) {
              let code = res["code"];
							if(code == "success") {
								roleArray.forEach((item,index)=>{
									api.post(//提交角色
										api.forent_url.maintenance_service_url + "/userAuth/giveUserRoles",item
									).then(function(res) {
										let code = res["code"];
										if(code == "success") {
											if(index === roleArray.length-1){
												Message.success("修改用户信息成功,将为您跳转到列表页!");
												setTimeout(function() {
                          that.loading = false;
													that.$router.push({
														name: 'SystemManagement-UserManagement',
														params: {

														}
													})
												}, 1500)
											}else{
                        that.loading = false;
                      }
										} else {
                      that.loading = false;
											Message.error(res.message);
										}
									}).catch(function(err) {
                    that.loading = false;
										Message.error(err);
									});
								})
							} else {
                that.loading = false;
								Message.error(res.message);
							}
						}).catch(function(err) {
              that.loading = false;
							Message.error(err);
						});

		          	}else{
			            if(that.saveOrEcho == "save") {
							that.saveData.createUserId = that.IDinfo.userId;
							url = "/userAuth/saveUserAuth";
						}
						if(that.saveOrEcho == "echo") {
							that.saveData.dataRes = that.IDinfo.sysCode_web
							that.saveData.updateUserId = that.IDinfo.userId;
							url = "/userAuth/saveUserAbout";
						}
			            api.post(//提交用户信息
							api.forent_url.maintenance_service_url + url,that.saveData
						).then(function(res) {
							let code = res["code"];
							if(code == "success") {
								Message.success("用户创建成功,将为您跳转到列表页!");
								setTimeout(function() {
                  that.loading = false;
									that.$router.push({
										name: 'SystemManagement-UserManagement',
										params: {

										}
									})
								}, 1500)

							} else {
                Message.error(res.message);
                that.loading = false;
                that.saveData.roleArray = JSON.parse(that.saveData.roleArray)
							}
						})
						.catch(function(err) {
              Message.error(err);
              that.loading = false;
						});
				     }
		          }
//		        });
			}

		},
		mounted() {
			console.log(this.IDinfo)
			this.initData();
		},
		created(){

		}
	}
</script>
<style lang="scss" scoped>
	.addUserCon{
		.pdl-15px{
			padding-left: .15rem;
		}
		.must{
			color:#ff4040;
		}
		height:calc(100% - .7rem);
		overflow-y:auto;
		padding:15px;
		.addUserConM{
			box-shadow:0px 1px 1px 0px rgba(0, 0, 0, 0.05);
			min-height:100%;
			width:100%;
			.changePhone{
				/*position:absolute;
				right:4.1rem;*/
				margin-left: .06rem;
				color: #ff4040;
				cursor:pointer;
			}
		}
		.detailTitle{
			height:.5rem;
			background-color:rgba(150,150,150,.08);
			color:#677089;
			margin-bottom: 15px;
			.wb-edit{
				color:#5F687F;
				&:hover{
					color:#409EFF;
				}
			}
		}
		.addUser{
			height:calc(100% - .5rem);
			/*padding:15px;*/
			label{
				width:.85rem;
				display: flex;
				justify-content: space-between;
				margin-right: .1rem;
			}
			.wb-checked{
				label{
					width:.5rem;
					display: initial;
				}
			}
			/deep/.el-form-item{
				width:100%;
			}
			/deep/.el-input__inner{
				position:relative;
			}
			/deep/.el-form-item__content{
				width:100%;
			}
			/deep/.el-form-item__error{
				left:33%;
			}
			/deep/.el-form-item {
			    margin-bottom: .22rem;
			}

			.maintenance-desRemove{
				color: #ff4040;
			}
			.maintenance-aroundNotice{
				color:#f4ea2a;;
			}
			.maintenance-sure{
				color: #1afa29;
			}
			.newPhoneStatus{
				margin-left: .1rem;
			}
		}

	}
	.changeTel{
		/deep/.el-form-item {
		    margin-bottom: .16rem;
		}
	}
	/deep/.el-button{
		width:1rem;
		margin-left: .2rem;
	}
	.verifyMobile{
			margin-bottom: 5px;
			display: flex;
			justify-content: flex-start;
			span{
	 			margin-right:5px;
				display: inline-block;
				width:26%;
				text-align: right;
				padding-right:3px;
			}
			.captcha{
				width:38%;
				padding-left:5px;
				margin-right:10px;
				border:1px solid #8391a5;
				border-radius: 2px;
			}
		}
		.getCodes{
			background-color:#ffb156;
			color:#fff;
			padding:0 2px;
			border-radius: 2px;
			display: inline-block;
			width:78px;
			text-align: center;
			cursor: pointer;
			border: none;
		}
</style>
