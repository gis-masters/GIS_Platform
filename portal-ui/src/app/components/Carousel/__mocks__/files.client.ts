export const filesClient = {
  getFileDownloadUrl(id: string): string {
    return id.includes('pdf') ? `/assets/images/test/${id}.pdf` : `/assets/images/test/${id}.jpg`;
  }
};
