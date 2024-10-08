import { CallType, Module } from 'src/module/types'

export const MockValidator: Module = {
  address: '0x503b54Ed1E62365F0c9e4caF1479623b08acbe77',
  module: '0x503b54Ed1E62365F0c9e4caF1479623b08acbe77',
  initData: '0x',
  deInitData: '0x',
  additionalContext: '0x',
  type: 'validator',
  hook: '0x73cC9a599d853D4e5a9Bc092578ef3DB7e063179',
}

export const MockExecutor: Module = {
  address: '0x73cC9a599d853D4e5a9Bc092578ef3DB7e063179',
  module: '0x73cC9a599d853D4e5a9Bc092578ef3DB7e063179',
  initData: '0x',
  type: 'executor',
  deInitData: '0x',
  additionalContext: '0x',
  hook: '0x73cC9a599d853D4e5a9Bc092578ef3DB7e063179',
}

export const MockHook: Module = {
  address: '0x688499e4b783375703d7e60c262b62bf40511523',
  module: '0x688499e4b783375703d7e60c262b62bf40511523',
  initData: '0x',
  deInitData: '0x',
  additionalContext: '0x',
  type: 'hook',
}

export const MockFallback: Module = {
  address: '0x510dfc5a624e9dd8518a52271c16063228efe314',
  module: '0x510dfc5a624e9dd8518a52271c16063228efe314',
  initData: '0x150b7a02',
  deInitData: '0x',
  additionalContext: '0x',
  type: 'fallback',
  hook: '0x73cC9a599d853D4e5a9Bc092578ef3DB7e063179',
  selector: '0x150b7a02',
  callType: CallType.CALLTYPE_SINGLE,
}

// Safe Mocks

export const MockSafeFallback: Module = {
  address: '0x510dfc5a624e9dd8518a52271c16063228efe314',
  module: '0x510dfc5a624e9dd8518a52271c16063228efe314',
  initData: '0x150b7a02',
  deInitData: '0x',
  additionalContext: '0x',
  type: 'fallback',
  callType: CallType.CALLTYPE_SINGLE,
  functionSig: '0x150b7a02',
  selector: '0x150b7a02',
}

export const MockSafeHook: Module = {
  address: '0x688499e4b783375703d7e60c262b62bf40511523',
  module: '0x688499e4b783375703d7e60c262b62bf40511523',
  initData: '0x',
  deInitData: '0x',
  additionalContext: '0x',
  type: 'hook',
  hookType: 0,
  selector: '0x150b7a02',
}
