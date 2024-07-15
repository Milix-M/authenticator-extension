/**
 * daisyuiのテーマを設定します.
 */
export const setThemeToDaisyui = (theme: string | null) => {
  const htmltag = document.querySelector("html");

  // htmlタグにテーマ設定
  if (htmltag !== null) {
    if (theme === "syncSystem" || theme === null) {
      htmltag.setAttribute("data-theme", getSystemTheme());
    } else if (theme !== null) {
      htmltag.setAttribute("data-theme", theme);
    }
  }
};

/**
 * システムに設定されているテーマを検出し返却します
 * @returns システム設定のテーマ
 */
export const getSystemTheme = (): string => {
  if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    return "dark";
  } else {
    return "light";
  }
};
