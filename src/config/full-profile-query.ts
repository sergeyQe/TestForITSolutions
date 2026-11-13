/**
 * Полный запрос — все поля всех типов. Подставляется в Apollo Sandbox по умолчанию
 * и используется в тестах; при загрузчиках даёт ровно шесть запросов к базе.
 */
export const FULL_PROFILE_QUERY = `# Запрос из задания, дополненный ссылками и достижениями
query Profile {
  profile {
    name
    description
    links {
      type
      label
      url
    }
    skills {
      name
      category
    }
    experience {
      company
      position
      period
      startDate
      endDate
      achievements {
        text
      }
    }
    projects {
      name
      description
      url
    }
  }
}
`;
