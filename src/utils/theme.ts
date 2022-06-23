export const getCustomOrRgb = (color?: string) => {
  // 默认arco主题色
  const defaultPrimaryRgb = window
    .getComputedStyle(document.body)
    .getPropertyValue("--primary-6");
  // 默认颜色
  const defaultColor = defaultPrimaryRgb
    ? `rgb(${defaultPrimaryRgb})`
    : "rgb(22,93,255)";
  const _color = color ? color.trim() : defaultColor;
  // 是否为arco自定义css颜色变量
  const isVar = /^rgb\(var\(([-\w\d]*)\)\)$/.test(_color);
  // 提取arco自定义变量key
  const ifVarColorName = _color.replace(/^rgb\(var\(([-\w\d]*)\)\)$/, "$1");
  // 提取arco自定义变量value
  const ifVarColorRgb = window
    .getComputedStyle(document.body)
    .getPropertyValue(ifVarColorName);
  return isVar
    ? ifVarColorRgb
      ? `rgb(${ifVarColorRgb})`
      : defaultColor
    : _color;
};

export const setPrimaryColors = (color: string[]) => {
  color.forEach((c, idx) =>
    document.body.style.setProperty(`--primary-${idx + 1}`, c)
  );
};

export const clearPrimaryColors = () => {
  Array.from({ length: 10 }).forEach((_, idx) =>
    document.body.style.removeProperty(`--primary-${idx + 1}`)
  );
};
