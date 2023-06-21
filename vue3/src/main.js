import { createApp } from 'vue';
import App from './index.vue';

// 全量引入 bkui-vue
import bkui from 'bkui-vue';
// 全量引入 bkui-vue 样式
import 'bkui-vue/dist/style.css';

createApp(App)
  .use(bkui)
  .mount('#app');
