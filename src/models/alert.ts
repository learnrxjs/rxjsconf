export type AlertMessage = {
  type: "warn" | "error" | "success"
  message: string
  options?: {
    aliveSeconds?: number
  }
}
