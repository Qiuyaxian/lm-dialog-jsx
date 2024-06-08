import { reactive } from "vue"

export default function useDialogStore(vm) {
  const storeState = reactive({
    vm: vm.ctx,
    visible: vm.props.modelValue,
    submit: false,
    cancel: false,
    dialogContent: null
  })
  return storeState
}
