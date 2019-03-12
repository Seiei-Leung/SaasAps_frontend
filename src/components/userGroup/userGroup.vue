<template>
  <div id="userGroup-component">
    <div class="userGroupWrapper rightBlockTabpaneWrapper" ref="rightBlockTabpaneWrapper">
      <div class="tableTitle">
      	<div class="leftTableTitle">组别编码</div>
      	<div class="rightTableTitle">组别名称</div>
      </div>
      <Tree :data="treeData" :render="renderContent"></Tree>
    </div>
    <div>
      <!-- 新增组别 -->
      <Modal v-model="isShowAddUserGroup" v-bind:title="addUserGroupTitle" @on-ok="addUserGroupOk" @on-cancel="addUserGroupCancel" ok-text="确认" cancel-text="取消">
        <div style="margin-top:20px;">组别名称：<Input v-model="groupName" placeholder="输入组别名称" style="margin-left: 10px;width:100px" /></div>
      </Modal>
      <!-- 删除组别 -->
      <Modal v-model="isShowDeleteUserGroup" v-bind:title="deleteUserGroupTitle" @on-ok="deleteUserGroupOk" @on-cancel="deleteUserGroupCancel" ok-text="确认" cancel-text="取消">
        <div>确认删除该节点？？</div>
      </Modal>
    </div>
  </div>
</template>
<script>
export default {
  data: function() {
    return {
      treeData: [],
      buttonProps: {
        type: 'default',
        size: 'small',
      },
      isShowAddUserGroup: false,
      addUserGroupTitle: "添加新用户组",
      groupCode: "",
      groupName: "",
      parentData: {},
      isShowDeleteUserGroup: false,
      deleteUserGroupTitle: "删除节点",
      deleteNode: {},
      deleteNodeData: {},
      root: []
    }
  },
  methods: {
    reloadMainTable: function() {
      var that = this;
      this.axios.get(this.seieiURL + "/usergroup/getall").then((response) => {
        that.treeData = response.data.data;
      }).catch((error) => {
        that.$Message.error({
          content: "服务器异常,请刷新！！",
          duration: 0,
          closable: true
        });
        console.log(error)
      });
    },
    renderContent(h, { root, node, data }) {
      return h('span', {
        style: {
          display: 'inline-block',
          width: '100%'
        }
      }, [
        h('span', [
          h('Icon', {
            props: {
              type: 'ios-contacts'
            },
            style: {
              marginRight: '8px',
              fontSize: '18px'
            }
          }),
          h('span', data.title)
        ]),
        h('span', {
          style: {
            display: 'inline-block',
            float: 'right',
            width: '400px',
            paddingLeft: '24px',
            borderLeft: '1px solid #aaa'
          }
        }, [
          h('span', {
            style: {
              display: 'inline-block',
              marginRight: '80px',
              width: '100px'
            }
          }, data.resource.name),
          h('Button', {
            props: Object.assign({}, this.buttonProps, {
              icon: 'ios-add'
            }),
            style: {
              marginRight: '8px',
              marginBottom: "2px",
              border: '1px solid #aaa'
            },
            on: {
              click: () => { this.append(data) }
            }
          }),
          h('Button', {
            props: Object.assign({}, this.buttonProps, {
              icon: 'ios-remove'
            }),
            style: {
              marginBottom: "2px",
              border: '1px solid #aaa'
            },
            on: {
              click: () => { this.remove(root, node, data) }
            }
          })
        ])
      ]);
    },
    append(data) {
      this.parentData = data;
      this.isShowAddUserGroup = true;
    },
    remove(root, node, data) {
      if (node.parent == null) {
        this.$Message.error("根目录不能删除！！");
      } else {
        this.root = root;
        this.deleteNode = node;
        this.deleteNodeData = data;
        this.isShowDeleteUserGroup = true;
      }
    },
    addUserGroupOk() {
      if (this.groupName.trim()) {
        var that = this;
        this.axios.get(this.seieiURL + '/usergroup/insert', {
          params: {
            parentId: this.parentData.resource.id,
            name: this.groupName
          }
        }).then((response) => {
          console.log(response.data.status);
          if (response.data.status == 0) {
            that.$Message.success(response.data.msg);
            // 视图修改，依靠的是对象，数组都指向同一个内存地址的特性
            const children = that.parentData.children || [];
            children.push({
              title: that.groupName,
              expand: true,
              resource: {
                id: response.data.data,
                name: that.groupName,
                parentId: that.parentData.resource.id
              }
            });
            that.$set(that.parentData, 'children', children);
            that.groupName = "";
          } else {
            that.$Message.error(response.data.msg);
          }
        }).catch((error) => {
          that.$Message.error({
            content: "服务器异常,请刷新！！",
            duration: 0,
            closable: true
          });
          console.log(error)
        });

      } else {
        this.$Message.error("请输入组别编号及名称");
      }
    },
    addUserGroupCancel() {
      this.isShowAddUserGroup = false;
      this.groupName = "";
    },
    deleteUserGroupOk() {
      const that = this;
      this.axios.get(this.seieiURL + "/usergroup/delete", {
        params: {
          id: this.deleteNodeData.resource.id
        }
      }).then((response) => {
        if (response.data.status == 0) {
          that.$Message.success(response.data.msg);
          // 视图修改，依靠的是对象，数组都指向同一个内存地址的特性
          const parentKey = that.deleteNode.parent;
          const parent = that.root.find(el => el.nodeKey === parentKey).node;
          const index = parent.children.indexOf(that.deleteNodeData);
          parent.children.splice(index, 1);
        } else {
          that.$Message.error(response.data.msg);
        }
      }).catch((error) => {
        that.$Message.error({
          content: "服务器异常,请刷新！！",
          duration: 0,
          closable: true
        });
        console.log(error)
      });
    },
    deleteUserGroupCancel() {
      this.isShowDeleteUserGroup = false;
    }
  },
  created: function() {
    // 页面初始化设置高度
    this.$nextTick(() => {
      this.$refs["rightBlockTabpaneWrapper"].style.height = this.windowHeight - 40 - 49 + "px"
    });
    this.reloadMainTable();
  }
}
</script>

<style>
.userGroupWrapper .tableTitle {
	overflow: hidden;
	width: 100%;
	line-height: 27px;
	border: 1px solid #999;
	border-bottom: none
}

.userGroupWrapper .leftTableTitle {
	box-sizing: border-box;
	display: inline-block;
	padding-left: 2em;
}

.userGroupWrapper .rightTableTitle {
	box-sizing: border-box;
	display: inline-block;
	float: right;
	width: 385px;
	padding-left: 24px;
	border-left: 1px solid #999
}

#userGroup-component .ivu-tree ul li {
  margin: 0;
  border: 1px solid #aaa;
  line-height: 25px;
}

#userGroup-component .ivu-tree {
  border-bottom: 1px solid #999;
  border-right: 1px solid #999;
}

#userGroup-component .ivu-tree-children li {
  border-bottom: none !important;
  border-right: none !important;
}

</style>
