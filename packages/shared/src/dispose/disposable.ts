/**
 * 可处理
 */
export abstract class Disposable {
  /**
   * 已处理
   */
  public isDisposed = false

  /**
   * 处理
   */
  public abstract dispose(): void
}

/**
 * 通过处理器可处理
 */
export class DisposableByDisposer extends Disposable {
  /**
   * 处理器
   */
  public disposers: Disposer[] = []

  /**
   * 处理
   */
  public dispose(): void {
    if (this.isDisposed) return
    this.isDisposed = true
    for (const disposer of this.disposers) {
      disposer()
    }
  }
}

/**
 * 处理器
 */
export type Disposer = () => void
