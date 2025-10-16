import type { Document } from "./types";

const STORAGE_KEY = "debate_documents";

export const documentStorageService = {
  getDocuments: () => {
    const documents = localStorage.getItem("documents");
    return documents ? JSON.parse(documents) : [];
  },
  saveDocuments: (documents: Document[]) => {
    localStorage.setItem("documents", JSON.stringify(documents));
  },
  addDocument: (document: Document) => {
    const documents = documentStorageService.getDocuments();
    documents.push(document);
    documentStorageService.saveDocuments(documents);
  },
  editDocument: (updatedDocument: Document) => {
    const documents = documentStorageService.getDocuments();
    const index = documents.findIndex(
      (doc: Document) => doc.id === updatedDocument.id
    );
    if (index !== -1) {
      documents[index] = updatedDocument;
      documentStorageService.saveDocuments(documents);
    }
  },
  deleteDocument: (documentId: string) => {
    const documents = documentStorageService.getDocuments();
    const updatedDocuments = documents.filter(
      (doc: Document) => doc.id !== documentId
    );
    documentStorageService.saveDocuments(updatedDocuments);
  },
};
