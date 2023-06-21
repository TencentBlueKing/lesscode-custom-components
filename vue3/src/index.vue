<!--
  Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
  Copyright (C) 2017-2019 THL A29 Limited, a Tencent company. All rights reserved.
  Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License.
  You may obtain a copy of the License at
  http://opensource.org/licenses/MIT
  Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on
  an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
  specific language governing permissions and limitations under the License.
-->

<template>
  <section class="x-table-wrapper">
    <div class="click-span">
      <span
        v-for="(val, index) in renderSlotTable"
        :key="index"
        :class="val.showLine ? 'click-show' : ''"
        @click="clickShowLine(index)"
      >{{val.label}}</span>
    </div>
    <bk-table
      empty-text="暂无数据"
      :data="dataTable"
      :pagination="pagination"
      @page-value-change="handlePageChange"
      @page-limit-change="handlelimitChange">
      <bk-table-column
        v-for="(val, index) in renderSlotTable.filter(table => table.showLine)"
        :key="index"
        :label="val.label"
        :sortable="val.sortable"
        align="center"
      >
        <template #default="props">
          <bk-popover
            v-if="val.builtIn === 'text' || val.builtIn === 'table' || val.builtIn === 'button'"
            trigger="click"
          >
            <ExclamationCircleShape></ExclamationCircleShape>
            <template #content>
              <bk-table
                v-if="val.builtIn === 'table'"
                style="margin-top: 15px;"
                :data="props?.row?.[val.prop]?.data"
                :outer-border="false"
                :header-border="false"
                :header-cell-style="{ background: '#fff' }"
                @page-value-change="handlePageChange"
              >
                <bk-table-column
                  v-for="(tps, ind) in props?.row?.[val.prop]?.sorts"
                  :key="ind"
                  :label="tps.label"
                  :prop="tps.prop"
                  width="150"
                ></bk-table-column>
              </bk-table>
              <div v-else-if="val.builtIn === 'text'">{{props?.row?.[val.prop]}}</div>
              <div v-else-if="val.builtIn === 'button'">
                <x-button :theme="buttonTheme" @click="handleClick(props.row)" style="margin-top: 20px">
                  {{buttonText || 123}}
                </x-button>
              </div>
            </template>
          </bk-popover>
          <span v-else>{{props?.row?.[val.prop]}}</span>
        </template>
      </bk-table-column>
    </bk-table>
  </section>
</template>

<script>
import XButton from './components/button/button';
import {
  ExclamationCircleShape
} from 'bkui-vue/lib/icon'

export default {
  name: 'PocTable',
  components: {
    XButton,
    ExclamationCircleShape,
  },
  emits: ['handle-click'],
  props: {
    slotTable: {
      type: Array,
      default() {
        return [
          { label: '第一列', prop: 'prop1', sortable: false, builtIn: false },
          { label: '第二列', prop: 'prop2', sortable: false, builtIn: 'table' },
          { label: '第三列', prop: 'prop3', sortable: false, builtIn: false },
        ];
      },
    },
    dataTable: {
      type: Array,
      default() {
        return [
          { prop1: '1-1', prop2: { sorts: [{ label: 'tp', prop: 'tp' }, { label: 'value', prop: 'value' }], data: [{ tp: '1-1-1', value: '1-1-1' }] }, prop3: '1-3' },
          { prop1: '2-1', prop2: { sorts: [{ label: 'tp', prop: 'tp' }, { label: 'value', prop: 'value' }], data: [{ tp: '2-1-1', value: '2-1-1' }] }, prop3: '2-3' },
          { prop1: '3-1', prop2: { sorts: [{ label: 'tp', prop: 'tp' }, { label: 'value', prop: 'value' }], data: [{ tp: '3-1-1', value: '3-1-1' }] }, prop3: '3-3' },
        ];
      },
    },
    buttonText: {
      type: String,
      default: '',
    },
    buttonTheme: {
      type: String,
      default: 'primary',
    },
  },
  data() {
    return {
      keyword: '',
      count: 0,
      pagination: {
        current: 1,
        count: 0,
        limit: 10,
      },
      reloadTable: false,
      renderSlotTable: []
    };
  },
  watch: {
    slotTable: {
      handler () {
        this.renderSlotTable = this.slotTable.map((res) => {
          return {
            ...res,
            showLine: true
          };
        });
      },
      immediate: true
    },
    dataTable: {
      handler (val) {
        this.pagination.count = val.length;
        this.pagination.current = 1;
      },
      immediate: true
    }
  },
  methods: {
    handlePageChange(page) {
      this.pagination.current = page;
      // this.getTableData()
    },
    handlelimitChange(page) {
      if (this.pagination.limit !== page) {
        this.pagination.limit = page;
        // this.getTableData()
      }
    },
    handleClick(val) {
      this.$emit('handle-click', val);
    },
    clickShowLine(val) {
      this.renderSlotTable[val].showLine = !this.renderSlotTable[val].showLine;
      this.$forceUpdate();
    },
  },
};
</script>

<style scoped>
     @import './index.css';
</style>
