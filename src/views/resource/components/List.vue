<template>
    <div class="resource-list">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <el-form
            ref="form"
            label-position="right"
            label-width="80px"
            :model="form"
          >
            <el-form-item prop="name" label="资源名称">
              <el-input v-model="form.name"></el-input>
            </el-form-item>

            <el-form-item prop="url" label="资源路径">
              <el-input v-model="form.url"></el-input>
            </el-form-item>

            <el-form-item prop="categoryId" label="资源分类">
              <el-select
                clearable
                v-model="form.categoryId"
              >
                <el-option
                  v-for="item in resourceCategories"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item>
              <el-button
                :disabled="isLoading"
                type="primary"
                @click="onSubmit"
              >
                查询
              </el-button>

              <el-button
                :disabled="isLoading"
                @click="onReset"
              >
                重置
              </el-button>
            </el-form-item>
          </el-form>
        </div>

        <el-table
          :data="resources"
          style="width: 100%; margin-bottom: 16px"
          v-loading="isLoading"
        >
          <el-table-column
            type="index"
            label="编号"
          ></el-table-column>

          <el-table-column
            prop="name"
            label="资源名称"
            min-width="150"
          ></el-table-column>

          <el-table-column
            prop="url"
            label="资源路径"
            min-width="150"
          ></el-table-column>

          <el-table-column
            prop="description"
            label="描述"
          ></el-table-column>

          <el-table-column
            prop="createdTime"
            label="添加时间"
          ></el-table-column>

          <el-table-column
            label="操作"
            min-width="150"
          >
            <template slot-scope="scope">
              <el-button
                size="mini"
                @click="handleEdit(scope.$index, scope.row)"
              >
                编辑
              </el-button>

              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <!--
          total 总记录数
          page-size 每页大小
          分页组件会自动根据 total 和 page-size 计算出一共分多少页
        -->
        <el-pagination
          :disabled="isLoading"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="form.current"
          :page-sizes="[5, 10, 20]"
          :page-size="form.size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalCount"
        ></el-pagination>
      </el-card>
    </div>
</template>

<script lang="ts">
import { Form } from 'element-ui';
import Vue from 'vue'
import { getResourcePages } from '@/services/resource';
import { getResourceCategories } from '@/services/resource-category';

export default Vue.extend({
  name: 'ResourceList',
  data() {
    return {
      resources: [],
      form: {
        name: '',
        url: '',
        categoryId: undefined,
        current: 1, // 默认查询第 1 页数据
        size: 5 // 每页大小
      },
      totalCount: 0,
      resourceCategories: [],
      isLoading: true
    }
  },
  created() {
    this.loadResources()
    this.loadResourceCategories()
  },
  methods: {
    async loadResources() {
      this.isLoading = true
      const { data } = await getResourcePages(this.form)
      this.resources = data.data.records
      this.totalCount = data.data.total
      this.isLoading = false
    },
    async loadResourceCategories() {
      this.isLoading = true
      const { data } = await getResourceCategories()
      this.resourceCategories = data.data
      this.isLoading = false
    },
    handleEdit() {
      console.log('handleEdit');
    },
    handleDelete() {
      console.log('handleDelete');
    },
    handleSizeChange(val: number) {
      this.form.size = val
      this.form.current = 1
      this.loadResources()
    },
    handleCurrentChange(val: number) {
      this.form.current = val
      this.loadResources()
    },
    onSubmit() {
      this.form.current = 1
      this.loadResources()
    },
    onReset() {
      (this.$refs.form as Form).resetFields()
      this.form.current = 1
      this.loadResources()
    }
  }
})
</script>

<style lang="scss" scoped>

</style>
