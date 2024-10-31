import * as prism from 'prismjs';

export as namespace codeflask

export type LanguageDefinition = {
  [token: string]: prism.LanguageDefinition | RegExp
}

export interface CodeFlaskOptions {
  language?: string
  rtl?: boolean
  tabSize?: number
  enableAutocorrect?: boolean
  lineNumbers?: boolean
  rightSidebar?: boolean
  defaultTheme?: boolean
  areaId?: string
  ariaLabelledby?: string
  readonly?: boolean
}

export default class CodeFlask {
  constructor(selectorOrElement: Element | string, opts: CodeFlaskOptions)

  updateCode(newCode: string): void 
  updateLanguage(newLanguage: string): void
  addLanguage(name: string, options: LanguageDefinition): void

  elRightSidebarLines: Node[];

  getCode(): string
  onUpdate(callback: (lines: string[]) => void): void

  disableReadonlyMode(): void
  enableReadonlyMode(): void
}
