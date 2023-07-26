function createPdfBlob(data: any) {
  const pdfBlob = new Blob([data], { type: "application/pdf" });
  return URL.createObjectURL(pdfBlob);
}

function openNewTab(url: string) {
  window.open(url, "_blank");
}

export { createPdfBlob, openNewTab };
