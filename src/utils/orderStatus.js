const STATUS_COLOR = {
  PENDING:   'bg-yellow-100 text-yellow-800 border-yellow-200',
  CONFIRMED: 'bg-blue-100 text-blue-800 border-blue-200',
  SHIPPING:  'bg-purple-100 text-purple-800 border-purple-200',
  DELIVERED: 'bg-green-100 text-green-800 border-green-200',
  CANCELLED: 'bg-red-100 text-red-800 border-red-200',
}

const STATUS_LABEL = {
  PENDING:   'Chờ xác nhận',
  CONFIRMED: 'Đã xác nhận',
  SHIPPING:  'Đang giao',
  DELIVERED: 'Giao thành công',
  CANCELLED: 'Đã hủy',
}

const STATUS_STEP = {
  PENDING: 1, CONFIRMED: 2, SHIPPING: 3, DELIVERED: 4, CANCELLED: 0,
}

export const getStatusColor = (status) =>
  STATUS_COLOR[status] ?? 'bg-gray-100 text-gray-800 border-gray-200'

export const getStatusLabel = (status) =>
  STATUS_LABEL[status] ?? status

export const getStatusStep = (status) =>
  STATUS_STEP[status] ?? 1
