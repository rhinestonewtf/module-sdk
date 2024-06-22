import { CallType, Module } from 'src'

export const MockValidator: Module = {
  module: '0x58e7d1cc62482891d902f0a7b255bac6cd001ac6',
  data: '0x',
  type: 'validator',
  hook: '0x73cC9a599d853D4e5a9Bc092578ef3DB7e063179',
}

export const MockExecutor: Module = {
  module: '0x73cC9a599d853D4e5a9Bc092578ef3DB7e063179',
  data: '0x',
  type: 'executor',
  hook: '0x73cC9a599d853D4e5a9Bc092578ef3DB7e063179',
}

export const MockHook: Module = {
  module: '0x688499e4b783375703d7e60c262b62bf40511523',
  data: '0x',
  type: 'hook',
}

export const MockFallback: Module = {
  module: '0x510dfc5a624e9dd8518a52271c16063228efe314',
  data: '0x150b7a02',
  type: 'fallback',
  hook: '0x73cC9a599d853D4e5a9Bc092578ef3DB7e063179',
  selector: '0x150b7a02',
  callType: CallType.CALLTYPE_SINGLE,
}

// Safe Mocks

export const MockSafeFallback: Module = {
  module: '0x510dfc5a624e9dd8518a52271c16063228efe314',
  data: '0x150b7a02',
  type: 'fallback',
  callType: CallType.CALLTYPE_SINGLE,
  functionSig: '0x150b7a02',
  selector: '0x150b7a02',
}

export const MockSafeHook: Module = {
  module: '0x688499e4b783375703d7e60c262b62bf40511523',
  data: '0x',
  type: 'hook',
  hookType: 0,
  selector: '0x150b7a02',
}
