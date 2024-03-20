export const SCHEDULED_TRANSFERS_EXECUTER_ADDRESS =
  '0xad6330089d9a1fe89f4020292e1afe9969a5a2fc'

export const scheduledTransfersAbi = [
  'function addOrder(ExecutionConfig calldata executionConfig) external',
  'struct ExecutionConfig {uint48 executeInterval;uint16 numberOfExecutions;uint16 numberOfExecutionsCompleted;uint48 startDate;bool isEnabled;uint48 lastExecutionTime;bytes executionData;}',
]
