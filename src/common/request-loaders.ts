import DataLoader from 'dataloader';

/**
 * Больше ключей в один запрос не попадает: у PostgreSQL предел — 32 767 параметров.
 * Сверх этого загрузчик делает ещё один запрос, а не падает.
 */
const MAX_BATCH_SIZE = 10_000;

/**
 * Загрузчики одного вида — по одному на каждый запрос GraphQL.
 *
 * DataLoader запоминает загруженное, поэтому общий на всё приложение экземпляр отдавал бы
 * данные одного запроса другому. Здесь загрузчик создаётся при первом обращении в рамках запроса
 * и привязывается к объекту контекста этого запроса: Apollo создаёт новый контекст на каждый
 * запрос, а WeakMap отпускает загрузчик вместе с ним.
 */
export class RequestLoaders<Key, Value> {
  private readonly loaders = new WeakMap<object, DataLoader<Key, Value>>(); // загрузчик на каждый контекст запроса

  /**
   * @param loadBatch - пакетная функция: получает ключи одного пакета и возвращает значения
   *   в том же порядке и той же длины (обычно это пакетный метод сервиса + groupByKey)
   */
  constructor(
    private readonly loadBatch: (keys: readonly Key[]) => Promise<Value[]>, // пакетная функция загрузки
  ) {}

  /**
   * Загрузчик запроса, которому принадлежит контекст.
   * @param context - объект контекста GraphQL (`@Context()` в резолвере): свой на каждый запрос
   * @returns DataLoader этого запроса; повторный вызов с тем же контекстом вернёт тот же экземпляр
   */
  forRequest(context: object): DataLoader<Key, Value> {
    // Первое обращение в рамках запроса создаёт загрузчик, следующие получают его же
    let loader = this.loaders.get(context);
    if (!loader) {
      loader = new DataLoader(this.loadBatch, {
        maxBatchSize: MAX_BATCH_SIZE,
      });
      this.loaders.set(context, loader);
    }
    return loader;
  }
}
