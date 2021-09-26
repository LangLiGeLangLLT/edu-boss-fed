<template>
  <div class="alloc-menu">
    <el-card>
      <div slot="header">
        <span>分配权限</span>
      </div>

      <el-tree
        ref="menuTree"
        v-loading="loading"
        :data="menu"
        :props="defaultProps"
        show-checkbox
        default-expand-all
        :default-checked-keys="checkedKeys"
        node-key="id"
      ></el-tree>

      <div style="display: flex; justify-content: center">
        <el-button @click="resetChecked">清空</el-button>

        <el-button
          type="primary"
          @click="onSave">保存</el-button>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts">
import { Tree } from 'element-ui';
import Vue from 'vue'
import { allocateRoleMenus, getMenuNodeList, getRoleMenus } from '@/services/menu';

export default Vue.extend({
  name: 'RoleAllocMenu',
  props: {
    roleId: {
      type: [String, Number],
      required: true
    }
  },
  data() {
    return {
      menu: [],
      defaultProps: {
        children: 'subMenuList',
        label: 'name'
      },
      loading: false,
      checkedKeys: []
    }
  },
  async created() {
    this.loading = true
    await this.loadMenus()
    await this.loadRoleMenus()
    this.loading = false
  },
  methods: {
    async loadMenus() {
      const { data } = await getMenuNodeList()
      this.menu = data.data
    },

    async loadRoleMenus() {
      const { data } = await getRoleMenus(this.roleId)
      this.getCheckedKeys(data.data)
    },

    getCheckedKeys(menus: any[]) {
      menus.forEach(menu => {
        if (menu.selected) {
          let checked = true
          if (menu.subMenuList && (menu.subMenuList as any[]).some(item => !item.selected)) {
            checked = false
          }
          if (checked) {
            this.checkedKeys = [...this.checkedKeys, menu.id] as any
          }
        }
        if (menu.subMenuList) {
          this.getCheckedKeys(menu.subMenuList)
        }
      })
    },

    resetChecked() {
      (this.$refs.menuTree as Tree).setCheckedKeys([])
    },

    async onSave() {
      const menuIdList = (this.$refs.menuTree as Tree).getCheckedKeys()
      await allocateRoleMenus({
        roleId: this.roleId,
        menuIdList
      })
      this.$message.success('操作成功')
      this.$router.back()
    }
  }
})
</script>

<style lang="scss" scoped>

</style>
