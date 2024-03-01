/**
 * 链表节点
 */
export interface LinkedNode<T> {
  /**
   * 值
   */
  value: T
  /**
   * 下一个（节点）
   */
  next: LinkedNode<T> | null
}

/**
 * 双向链表节点
 */
export interface DoubleLinkedNode<T> {
  /**
   * 值
   */
  value: T
  /**
   * 上一个（节点）
   */
  prev: DoubleLinkedNode<T> | null
  /**
   * 下一个（节点）
   */
  next: DoubleLinkedNode<T> | null
}

/**
 * 创建链表节点
 * @param value 值
 * @param next 下一个（节点）
 */
export function createLinkedNode<T>(
  value: T,
  next: LinkedNode<T> | null = null,
): LinkedNode<T> {
  return {
    value,
    next,
  }
}

/**
 * 创建双向链表节点
 * @param value 值
 * @param prev 上一个（节点）
 * @param next 下一个（节点）
 */
export function createDoubleLinkedNode<T>(
  value: T,
  prev: DoubleLinkedNode<T> | null = null,
  next: DoubleLinkedNode<T> | null = null,
): DoubleLinkedNode<T> {
  const node = { value, prev, next }
  if (prev) prev.next = node
  if (next) next.prev = node
  return node
}

/**
 * 删除双向链表节点
 * @param node 节点
 */
export function deleteDoubleLinkedNode<T>(node: DoubleLinkedNode<T>): void {
  const { prev, next } = node
  if (prev) prev.next = next
  if (next) next.prev = prev
}
