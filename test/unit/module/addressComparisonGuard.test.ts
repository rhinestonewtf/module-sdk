import { readdirSync, statSync } from 'fs'
import { join } from 'path'
import * as ts from 'typescript'

// Guard test: type-aware AST scan of the real source tree (not a hand-listed
// file, and not a regex that can miss reordered operands, block bodies, or
// differently-named variables) for the exact anti-pattern that caused this
// bug 7 times across 5 files - a bare `===`/`!==` comparison between two
// values whose static type includes viem's `Address`, reached through a
// `.findIndex(`/`.filter(`/`.find(`/`.some(`/`.every(` callback.
//
// viem's `readContract` always checksums `address`/`address[]` ABI outputs.
// A caller-supplied address in a different case silently fails a raw
// `===`/`!==` comparison even though it is the same address; only a
// checksum-aware comparison (viem's `isAddressEqual`) is correct.
//
// This scans src/ (the whole package source, not just src/module) using the
// TypeScript compiler's own type checker - not a hand-listed set of "known
// fixed" call sites, which is exactly what let this bug recur 7 times after
// the first fix (#131) only touched one of the many sites that needed it,
// and not a name-substring regex, which a differently-named address
// variable (e.g. `candidate`, `target`) would silently evade.

const SRC_ROOT = join(__dirname, '../../../src')
const TSCONFIG_PATH = join(__dirname, '../../../tsconfig.json')

function listTsFiles(dir: string): string[] {
  const entries = readdirSync(dir)
  const files: string[] = []
  for (const entry of entries) {
    const fullPath = join(dir, entry)
    const stat = statSync(fullPath)
    if (stat.isDirectory()) {
      if (
        entry === '_cjs' ||
        entry === '_esm' ||
        entry === '_types' ||
        entry === 'node_modules'
      ) {
        continue
      }
      files.push(...listTsFiles(fullPath))
    } else if (
      entry.endsWith('.ts') &&
      !entry.endsWith('.test.ts') &&
      !entry.endsWith('.d.ts')
    ) {
      files.push(fullPath)
    }
  }
  return files
}

const ARRAY_SEARCH_METHODS = new Set([
  'findIndex',
  'filter',
  'find',
  'some',
  'every',
])

function typeIncludesAddress(type: ts.Type, checker: ts.TypeChecker): boolean {
  const typeString = checker.typeToString(type)
  // viem's `Address` is `` `0x${string}` `` - matching the template literal
  // type's string form is robust to aliasing (`Address`, `Address[]`
  // narrowed to an element, union members, etc.) without needing to resolve
  // viem's own type declarations by name.
  return typeString.includes('0x${string}') || typeString === 'Address'
}

describe('no raw string equality on Address-typed values reached via array-search callbacks', () => {
  it('type-checks src/ for the exact pattern that caused issue-of-record #140/#131 to recur', () => {
    const files = listTsFiles(SRC_ROOT)
    // Sanity: the scan must actually reach real source, or this test would
    // pass vacuously against an empty/wrong directory.
    expect(files.length).toBeGreaterThan(20)

    const configFile = ts.readConfigFile(TSCONFIG_PATH, ts.sys.readFile)
    const parsedConfig = ts.parseJsonConfigFileContent(
      configFile.config,
      ts.sys,
      join(__dirname, '../../..'),
    )

    const program = ts.createProgram({
      rootNames: files,
      options: { ...parsedConfig.options, noEmit: true },
    })
    const checker = program.getTypeChecker()

    const violations: string[] = []

    for (const file of files) {
      const sourceFile = program.getSourceFile(file)
      if (!sourceFile) continue

      const visit = (node: ts.Node) => {
        if (
          ts.isCallExpression(node) &&
          ts.isPropertyAccessExpression(node.expression) &&
          ARRAY_SEARCH_METHODS.has(node.expression.name.text) &&
          node.arguments.length > 0
        ) {
          const callback = node.arguments[0]
          if (
            ts.isArrowFunction(callback) ||
            ts.isFunctionExpression(callback)
          ) {
            const findEqualityExpressions = (n: ts.Node) => {
              if (
                ts.isBinaryExpression(n) &&
                (n.operatorToken.kind ===
                  ts.SyntaxKind.EqualsEqualsEqualsToken ||
                  n.operatorToken.kind ===
                    ts.SyntaxKind.ExclamationEqualsEqualsToken)
              ) {
                const leftType = checker.getTypeAtLocation(n.left)
                const rightType = checker.getTypeAtLocation(n.right)
                if (
                  typeIncludesAddress(leftType, checker) &&
                  typeIncludesAddress(rightType, checker)
                ) {
                  const { line } = sourceFile.getLineAndCharacterOfPosition(
                    n.getStart(sourceFile),
                  )
                  violations.push(
                    `${file}:${line + 1} -> ${n.getText(sourceFile)}`,
                  )
                }
              }
              ts.forEachChild(n, findEqualityExpressions)
            }
            findEqualityExpressions(callback.body)
          }
        }
        ts.forEachChild(node, visit)
      }
      visit(sourceFile)
    }

    expect(violations).toEqual([])
  })
})
