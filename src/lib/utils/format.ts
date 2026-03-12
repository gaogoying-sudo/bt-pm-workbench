export const formatDate = (value: string) => new Date(value).toLocaleDateString('zh-CN');

export const toTitle = (value: string) =>
  value
    .split('-')
    .map((item) => item[0].toUpperCase() + item.slice(1))
    .join(' ');
