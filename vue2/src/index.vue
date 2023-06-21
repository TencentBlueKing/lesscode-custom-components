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
      :size="size"
      v-bkloading="{ isLoading: reloadTable }"
      :pagination="pagination"
      @page-change="handlePageChange"
      @page-limit-change="handlelimitChange">
      <bk-table-column
        v-for="(val, index) in renderSlotTable.filter(slotTable => slotTable.showLine)"
        :key="index"
        :label="val.label"
        :sortable="val.sortable"
        align="center"
      >
        <template slot-scope="props">
          <bk-popconfirm
            v-if="val.builtIn === 'text' || val.builtIn === 'table' || val.builtIn === 'button'"
            trigger="click"
            title="slot"
            ext-cls="asadsadsads"
            confirm-text=""
            cancel-text=""
          >
            <i class="bk-icon icon-exclamation-triangle icon-sty"></i>
            <div slot="content">
              <bk-table
                v-if="val.builtIn === 'table'"
                style="margin-top: 15px;"
                :data="props.row[val.prop].data"
                :size="size"
                :outer-border="false"
                :header-border="false"
                :header-cell-style="{ background: '#fff' }"
                @page-change="handlePageChange">
                <bk-table-column
                  v-for="(tps, ind) in props.row[val.prop].sorts"
                  :key="ind"
                  :label="tps.label"
                  :prop="tps.prop"
                  width="150"
                ></bk-table-column>
              </bk-table>
              <div v-else-if="val.builtIn === 'text'">{{props.row[val.prop]}}</div>
              <div v-else-if="val.builtIn === 'button'">
                <x-button :theme="buttonTheme" @click="handleClick(props.row)" style="margin-top: 20px">
                  {{buttonText || 123}}
                </x-button>
              </div>
            </div>
          </bk-popconfirm>
          <span v-else>{{props.row[val.prop]}}</span>
        </template>
      </bk-table-column>
    </bk-table>
  </section>
</template>

<script>
import XButton from './components/button/button';
export default {
  name: 'PocTable',
  components: {
    XButton,
  },
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
          { prop1: '1-1', prop2: [{ tp: '123', value: '12314234' }], prop3: '1-3' },
          { prop1: '2-1', prop2: [{ sorts: [{ label: 'tp', prop: 'tp' }, { label: 'value', prop: 'value' }], data: [{ tp: '123', value: '1234' }] }], prop3: '2-3' },
          { prop1: '3-1', prop2: [{ tp: '123', value: '12314234' }], prop3: '3-3' },
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
      size: 'small',
      pagination: {
        current: 1,
        count: 0,
        limit: 10,
      },
      reloadTable: false,
      renderSlotTable: [],
    };
  },
  computed: {
  },
  watch: {
    dataTable: {
      handler(val) {
        this.pagination.count = val.length;
        this.pagination.current = 1;
      },
      immediate: true,
    },
    slotTable: {
      handler() {
        this.renderSlotTable = this.slotTable.map(res => ({
          ...res,
          showLine: true,
        }));
      },
      immediate: true,
    },
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
