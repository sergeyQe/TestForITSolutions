import { GraphQLScalarType } from 'graphql';

/**
 * Дата без времени. Готового такого типа в @nestjs/graphql нет: встроенные DateTime и Timestamp
 * несут время. Значение берётся только в UTC — иначе полночь по UTC в поясе западнее Гринвича
 * превратилась бы в предыдущий день. Входных данных у API нет, поэтому описан только вывод.
 */
export const DateScalar = new GraphQLScalarType<Date, string>({
  name: 'Date',
  description: 'Дата без времени в формате ГГГГ-ММ-ДД',
  /**
   * Превращает значение поля в строку ответа.
   * @param value - значение из резолвера; ожидается Date (startDate и endDate места работы)
   * @returns строка «ГГГГ-ММ-ДД» по UTC
   * @throws TypeError, если пришёл не Date: это ошибка в коде резолвера, а не в данных
   */
  serialize(value) {
    if (!(value instanceof Date)) {
      throw new TypeError('Скаляр Date ожидает объект Date');
    }
    return value.toISOString().slice(0, 10);
  },
});
