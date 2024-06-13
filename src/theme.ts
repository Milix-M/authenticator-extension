/**
 * daisyuiのテーマを設定します.
 */
export const setThemeToDaisyui = (theme: string | null) => {
  const htmltag = document.querySelector("html");

  // htmlタグにテーマ設定
  if (htmltag !== null) {
    if (theme !== null) {
      htmltag.setAttribute("data-theme", theme);
    } else {
      htmltag.setAttribute("data-theme", "light");
    }
  }
};
