export default {
    urlList: [{
            menuName: "首页",
            name: "index"
        },
        {
            menuName: "运行监测",
            name: "RealTimeMonitoringDevice",
            children: [{
                menuName: "监测报表",
                name: "RealTimeMonitoringDevice"
            }]
        },

        {
            menuName: "巡查计划",
            name: "PatrolPlan",
            children: [{
                    menuName: "消控室值班",
                    name: "PatrolPlan-ControlRoomDuty"
                }, {
                    menuName: "巡查检查",
                    name: "PatrolPlan-PatrolInspection"
                },
                {
                    menuName: "设施巡查",
                    name: "PatrolPlan-FacilitiesInspection"
                }
            ]
        },
        {
            menuName: "安全监管",
            name: "SafetySupervision",
            children: [{
                    menuName: "报警复核",
                    name: "SafetySupervision-AlarmCheck"
                },
                {
                    menuName: "电气火灾预警",
                    name: "SafetySupervision-ElectricalFireWarning"
                },
                {
                    menuName: "隐患整改",
                    name: "SafetySupervision-HiddenDangerRectification"
                },
                {
                    menuName: "消控室值班",
                    name: "SafetySupervision-ControlRoomDuty"
                },
                {
                    menuName: "防火巡查",
                    name: "SafetySupervision-FirePreventionPatrol"
                },
                {
                    menuName: "防火检查",
                    name: "SafetySupervision-FirePreventionInspection"
                },
                {
                    menuName: "设施巡查",
                    name: "SafetySupervision-FacilitiesInspection"
                }
            ]
        },
        {
            menuName: "信息管理",
            name: "MessManage",
            children: [{
                    menuName: "安全管理",
                    name: "MessManage-SafetyManage"
                },
                {
                    menuName: "年度计划",
                    name: "MessManage-YearPlan"
                },
                {
                    menuName: "维保合同",
                    name: "MessManage-MaintContract"
                },
                {
                    menuName: "检测报告",
                    name: "MessManage-MonitReports"
                },
                {
                    menuName: "培训演练",
                    name: "MessManage-Training"
                },
                {
                    menuName: "预案管理",
                    name: "MessManage-PlanManage"
                },
                {
                    menuName: "评估报告",
                    name: "MessManage-RiskReports"
                },
                {
                    menuName: "企业信息",
                    name: "MessManage-PriseInfo"
                }
            ]
        },
        {
            menuName: "统计查询",
            name: "StatisticalQuery",
            children: [{
                    menuName: "预警统计",
                    name: "StatisticalQuery-PreWarningStatistics"
                },
                {
                    menuName: "报警统计",
                    name: "StatisticalQuery-PoliceStatistics"
                },
                {
                    menuName: "隐患统计",
                    name: "StatisticalQuery-HiddenStatistics"
                },
                {
                    menuName: "安全报告",
                    name: "StatisticalQuery-SafetyStatistics"
                },
            ]
        },
        {
            menuName: "设备信息",
            name: "index",
            children: [{
                menuName: "设备档案",
                name: "EquipmentInfo"
            }]
        },
        {
            menuName: "维保服务",
            name: "index",
            children: [{
                    menuName: "应急维保",
                    name: "MaintenanceService-EmergencyService"
                }, {
                    menuName: "例行维保",
                    name: "MaintenanceService-RoutineService"
                },
                {
                    menuName: "维保关系",
                    name: "MaintenanceService-MaintenanceRelation"
                }
            ]
        },
        {
            menuName: "系统管理",
            name: "SystemManagement",
            children: [{
                menuName: "用户管理",
                name: "SystemManagement-UserManagement"
            },
            {
              menuName: "组织机构",
              name: "SystemManagement-OrgMgr",
            }
          ]
        },
        {
            menuName: "插件实例管理",
            name: "Building",
            icon: "el-icon-menu",
            path: "/uthManagement/user/list",
            children: [{
                    menuName: "用户管理",
                    name: "authManagement-user-list"
                },
                {
                    menuName: "ztree管理",
                    name: "authManagement-organization-list"
                },
                {
                    menuName: "loadsh处理",
                    name: "authManagement-chart-list"
                },
                {
                    menuName: "组件管理",
                    name: "operationMonitor-monitorReport"
                },
                {
                    menuName: "组件管理2",
                    name: "operationMonitor-monitorReport2"
                },
                {
                    menuName: "quill富编辑器",
                    name: "examples-vue-quill-editor"
                },
                {
                    menuName: "MarkDownEditor实例",
                    name: "examples-use-markdown-editor"
                },
                {
                    menuName: "echarts实例",
                    name: "examples-vue-echarts"
                },
                {
                    menuName: "vue-Font-Awesome图标基础样式",
                    name: "examples-vue-Font-Awesome"
                },
                {
                    menuName: "use-b-map百度地图",
                    name: "examples-use-b-map"
                },
                {
                    menuName: "vue-photo-preview实例",
                    name: "examples-vue-photo-preview"
                },
                {
                    menuName: "TestG2Map实例",
                    leaf: true,
                    path: "/examples/TestG2Map",
                    name: "examples-TestG2Map"
                },
                {
                    menuName: "vue-swiper实例",
                    name: "examples-vue-swiper"
                }
            ]
        },
        {
            menuName: "授权管理",
            name: "AuthManage",
            children: [{
                    menuName: "用户管理",
                    name: "AuthManage-UserManage"
                },
                {
                    menuName: "角色管理",
                    name: "AuthManage-RoleManage"
                }, {
                    menuName: "权限管理",
                    name: "AuthManage-AuthManage"
                }, {
                    menuName: "菜单管理",
                    name: "AuthManage-MenuManage"
                }, {
                    menuName: "系统信息",
                    name: "AuthManage-SystemInfo"
                }, {
                    menuName: "密码规则",
                    name: "AuthManage-PasswordRegular"
                }, {
                    menuName: "密级管理",
                    name: "AuthManage-PasswordLevel"
                }, {
                    menuName: "专家DEMO",
                    name: "AuthManage-ExpertManage"
                }
            ]
        },
        {
            menuName: "配置管理",
            name: "ConfigManage"
        },
        {
            menuName: "日志管理",
            name: "LogMgr",
            children: [{
                    menuName: "日志管理",
                    name: "LogManage-LogManage"
                },
                {
                    menuName: "审计配置",
                    name: "LogManage-AuditConfig"
                }
            ]
        },
        {
            menuName: "缓存管理",
            name: "CacheMgr",
            children: [{
                    menuName: "缓存信息",
                    name: "CacheManagement-CacheInfo"
                },
                {
                    menuName: "缓存初始化",
                    name: "CacheManagement-CacheInit"
                }
            ]
        },
        {
            menuName: "用户审计管理",
            name: "UserAuditMgr"
        },
        {
            menuName: "基础数据管理",
            name: "Basedate",
            children: [{
                menuName: "组织机构管理",
                name: "Basedate-OrgMgr"
            }, {
                menuName: "行政区划管理",
                name: "Basedate-DistrictMgr"
            }]
        }
    ]
}