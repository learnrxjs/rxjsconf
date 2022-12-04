import { createRenderEffect, Signal } from "solid-js"

declare module "solid-js" {
  namespace JSX {
    interface Directives {
      model: any
    }
  }
}

function isInput(target: HTMLElement): target is HTMLInputElement {
  return target.tagName === "INPUT"
}

function isSelect(target: HTMLElement): target is HTMLSelectElement {
  return target.tagName === "SELECT"
}

export function model(targetElement: HTMLElement, payload: () => Signal<any>) {
  const [ field, setField ] = payload()

  if (isInput(targetElement)) {
    createRenderEffect(() => (targetElement.value = field()))
    targetElement.addEventListener("input", (event) => setField((event.target as HTMLInputElement).value))
    return
  }

  if (isSelect(targetElement)) {
    createRenderEffect(() => (targetElement.value = field()))
    targetElement.addEventListener("change", (event) => setField((event.target as HTMLSelectElement).value))
    return
  }
}
