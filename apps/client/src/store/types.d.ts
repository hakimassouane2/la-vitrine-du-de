type NotificationType = "success" | "warning" | "error" | "info"

type ShopNotification = {
	notificationType: NotificationType
	message: string
	timeout?: number
}
