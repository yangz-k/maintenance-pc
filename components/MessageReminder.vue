<template>
  <!--<div>-->
    <el-popover
        class="news"
        width="390"
        placement="bottom"
        trigger="manual"
        v-model="visible">
        <el-button type="info" slot="reference" icon="maintenance-mail" circle @click="displayInformation()">
            <span class="number">{{newsListNum}}</span>
        </el-button>
        <el-row v-if="newsList.length > 0">
            <el-scrollbar>
                <el-row class="newsList" v-for="(item, index) in newsList" :key="index" @click.native="jump(item, index)">
                    <el-row style="padding-bottom: 8px;">
                        <el-col :span="14">
                            <i class="dot"></i>
                            <span class="fs16px">{{item.title}}</span>
                        </el-col>
                        <el-col :span="10">
                            <span class="fs14px">{{item.pushTime}}</span>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col>
                            <span class="fs14px" style="line-height: 22px;">{{item.content}}</span>
                        </el-col>
                    </el-row>
                </el-row>
            </el-scrollbar>
            <el-row>
                <el-button type="text" class="ignore"  @click="ignoreAllMessage" style="width:auto">忽略全部</el-button>
            </el-row>
        </el-row>
        <el-row v-else>
            <div class="noMessage">当前暂无消息~</div>
        </el-row>
    </el-popover>
  <!--</div>-->
</template>
<script>
import api from "~/config/http";
import { Message, MessageBox } from "element-ui";
export default {
    data () {
        return{
            visible: false,
            newsList: [],
            newsListNum: null,
        }
    },
    methods: {
        messageMonitoring () {
            let _this = this;
            let orgCode = api.getGlobalVal("maintenance_userObj").orgCode;
            if (this.stompClient && this.stompClient.connected && orgCode) {
                this.stompClient.subscribe(
                    '/topic/' + orgCode + '/system_notice',
                    function(greeting) {
                        let message = greeting.body;
                        if (typeof message == "string") {
                            message = JSON.parse(message);
                        }
                        let data = message.content;
                        switch (message.type) {
                            case "61":
                                _this.newsListNum += 1
                                if (_this.visible === true) {
                                    _this.getNewsList()
                                }
                                break;
                            case "62":
                                _this.newsListNum += 1
                                if (_this.visible === true) {
                                    _this.getNewsList()
                                }
                                break;
                            case "7":
                                _this.newsListNum += 1
                                if (_this.visible === true) {
                                    _this.getNewsList()
                                }
                                break;
                        }
                    }
                );
            } else {
                let _this = this;
                setTimeout(function() {
                    _this.messageMonitoring();
                }, 3000);
            }
        },
        // 显示消息列表
        displayInformation () {
            if (this.visible === false) {
                this.getNewsList()
                this.visible = true
            } else {
                this.visible = false
            }
        },
        // 获取消息列表
        getNewsList () {
            api.get(api.forent_url.maintenance_service_url + "/maintenance/message/unreadMsgList", {
                orgId: api.getGlobalVal("maintenance_userObj").orgCode
            }).then(res=>{
                if (res && res.code === 'success') {
                    this.newsList = res.data
                    this.newsListNum = this.newsList.length
                } else {
                    this.$message.error(res.message);
                }
            })
        },
        // 忽略全部按钮
        ignoreAllMessage () {
            api.post(api.forent_url.maintenance_service_url + "/maintenance/message/clearUnreadMsgs", {
                orgId: api.getGlobalVal("maintenance_userObj").orgCode
            }).then(res=>{
                if (res && res.code === 'success') {
                    this.visible = false;
                    this.newsList = [];
                    this.newsListNum = 0;
                }
            })
        },
        // 点击消息跳转页面
        jump (item, index) {
            api.post(api.forent_url.maintenance_service_url + "/maintenance/message/updateMsgState", {
                id: item.id,
                state: 2
            }).then(res=>{
                if (res && res.code === 'success') {
                    this.newsListNum -= 1
                    this.newsList.splice(index, 1)
                    if (item.type == '61' || item.type == '62') {
                        api.setGlobalVal(
                            "CmenuName",
                            JSON.stringify({
                                name: '业主信息',
                                parName: '项目信息',
                                lightMenu: '3-0'
                            })
                        );
                        this.$router.push({
                            name: "ProjectInformation-ProprietorInformation"
                        });
                    } else {
                        api.setGlobalVal(
                            "CmenuName",
                            JSON.stringify({
                                name: '合同管理',
                                parName: '项目信息',
                                lightMenu: '3-1'
                            })
                        );
                        this.$router.push({
                            name: "ProjectInformation-ContractManagement"
                        });
                    }
                    this.visible = false;
                }
            })
        },
    },
    mounted () {
        this.$emit('changeNewsList');
        this.getNewsList();
        this.messageMonitoring();
    }
}
</script>
<style lang='scss' scoped>
.news {
    right: 50px;
    position: relative;
    display: inline-block;
}
/deep/.el-button [class*=el-icon-]+span {
    margin-left: 0;
}
.number {
    position: absolute;
    background-color: #F56C6C;
    padding: 0 3px;
    line-height: 16px;
    font-size: 12px;
    border-radius: 10px;
    border: 1px solid #FFF;
    top: -8px;
    left: 22px;
}
.el-button{
    width: 36px;
    height: 36px;
}
/deep/.maintenance-mail {
    color: rgba(114,121,137,1);
    font-size: 0.22rem;
}
.el-button.is-circle {
    display: block;
    padding: 0;
    background: rgba(114,121,137,0.2);
    border: 1px solid rgba(114,121,137,1);
}
.dot {
    width: 6px;
    height: 6px;
    display: inline-block;
    background-color: #ff0000;
    border-radius: 50%;
}
.ignore {
    float: right;
    margin-right: 12px;
}
.newsList {
        border-bottom: 1px solid #dfdfdf;
        padding-bottom: 10px;
        margin-bottom: 10px;
        cursor: pointer;
}
/deep/.el-scrollbar__wrap {
    max-height: 5rem;
    padding-right: .12rem;
}
.noMessage {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 1rem;
}
</style>
