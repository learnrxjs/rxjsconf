import type { AlertMessage } from "../models"

type Props = {
  alert: AlertMessage
}

export function Alert({ alert }: Props) {
  return <div class="alert" attr:data-alert-type={ alert.type }>{ alert.message }</div>
}
