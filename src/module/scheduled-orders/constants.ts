export const SCHEDULED_ORDERS_EXECUTER_ADDRESS =
  '0x506a89d85a9733225fdb54d9e7e76d017c21e1c1'

export const scheduledOrdersAbi = [
  'function addOrder(ExecutionConfig calldata executionConfig) external',
  'struct ExecutionConfig {uint48 executeInterval;uint16 numberOfExecutions;uint16 numberOfExecutionsCompleted;uint48 startDate;bool isEnabled;uint48 lastExecutionTime;bytes executionData;}',
]
