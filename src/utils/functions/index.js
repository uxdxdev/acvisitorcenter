export const handleCopyToClipboardByRef = (ref) => {
  ref.select();
  // urlInputRef.setSelectionRange(0, 99999);
  document.execCommand("copy");
};
