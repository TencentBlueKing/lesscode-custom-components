import { defineComponent } from 'vue';
import CrontabPicker from '../src/vue3';

export default defineComponent({
  name: 'App',
  setup() {},
  render() {
    return (
      <div>
        <CrontabPicker></CrontabPicker>
      </div>
    );
  },
});
