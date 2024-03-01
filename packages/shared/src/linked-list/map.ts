import {
  createDoubleLinkedNode,
  deleteDoubleLinkedNode,
  DoubleLinkedNode,
} from './node'

/**
 * 链表 Map
 */
export interface LinkedMap<K, V> {
  /**
   * 设置值
   * @param key 键值
   * @param value 值
   * @param position 位置
   */
  set(key: K, value: V, position?: LinkedMapPosition<K>): void
  /**
   * 删除值
   * @param key 键值
   */
  delete(key: K): void
  /**
   * 值
   */
  values(): IterableIterator<V>
}

/**
 * 链表 Map 位置
 */
export interface LinkedMapPosition<K> {
  /**
   * 类型，默认: `'after'`
   */
  type?: typeof POSITION_TYPE_BEFORE | typeof POSITION_TYPE_AFTER
  /**
   * 目标键值
   */
  targetKey: K
}

/**
 * 位置类型：前
 */
export const POSITION_TYPE_BEFORE = 'before'

/**
 * 位置类型：后
 */
export const POSITION_TYPE_AFTER = 'after'

/**
 * 创建链表 Map
 */
export function createLinkedMap<K, V>(): LinkedMap<K, V> {
  const m = new Map<K, DoubleLinkedNode<V>>()
  const dummyHead = createDoubleLinkedNode(null as V)
  const dummyTail = createDoubleLinkedNode(null as V, dummyHead)
  const set: LinkedMap<K, V>['set'] = (key, value, position) => {
    del(key)
    if (position) {
      const targetNode = m.get(position.targetKey)
      if (targetNode) {
        if (position.type === POSITION_TYPE_BEFORE) {
          insert(key, value, targetNode.prev, targetNode)
        } else {
          insert(key, value, targetNode, targetNode.next)
        }
        return
      }
    }
    insert(key, value, dummyTail.prev, dummyTail)
  }
  const del: LinkedMap<K, V>['delete'] = (key) => {
    const node = m.get(key)
    if (!node) return
    m.delete(key)
    deleteDoubleLinkedNode(node)
  }
  return {
    set,
    delete: del,
    values,
  }

  function insert(
    key: K,
    value: V,
    prev: DoubleLinkedNode<V> | null,
    next: DoubleLinkedNode<V> | null,
  ): void {
    const node = createDoubleLinkedNode(value, prev, next)
    m.set(key, node)
  }

  function* values(): Generator<V, void, unknown> {
    for (
      let node = dummyHead.next;
      node && node !== dummyTail;
      node = node.next
    ) {
      yield node.value
    }
  }
}
