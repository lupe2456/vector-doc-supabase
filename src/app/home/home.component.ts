import { Component, OnInit } from '@angular/core';

// URL del webhook de n8n
const n8nWebhookUpload = '/webhook/esme-vectordb';
const n8nWebhookList = '/webhook/esme-list-docs';
const n8nWebhookDelete = '/webhook/esme-delete-doc';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  selectedFile: File | null = null;
  selectedPdfUrl: string | null = null;
  docs: { id: string; name: string; url: string }[] = [];

  ngOnInit() {
    this.loadDocs();
  }

  onFileChange(event: any) {
    this.selectedFile = event.target.files[0];
  }

  upload() {
    if (!this.selectedFile) return;

    const formData = new FormData();
    formData.append('file', this.selectedFile);

    fetch(n8nWebhookUpload, {
      method: 'POST',
      body: formData,
    })
      .then((res) => {
        if (!res.ok) throw new Error('Error al subir');
        return res.json();
      })
      .then(() => {
        this.selectedFile = null;
        this.loadDocs(); // Refresca lista
      })
      .catch((err) => console.error('Error', err));
  }

  loadDocs() {
    fetch(n8nWebhookList)
      .then((res) => res.json())
      .then((data) => {
        this.docs = data.map((doc: any) => ({
          id: doc.id,
          name: doc.name,
          url: doc.url,
        }));
      })
      .catch((err) => console.error('Error al cargar docs', err));
  }

  viewPdf(url: string) {
    this.selectedPdfUrl = url;
  }

  deleteDoc(id: string) {
    fetch(n8nWebhookDelete, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Error al eliminar');
        this.loadDocs(); // Refresca lista
        if (this.selectedPdfUrl) {
          this.selectedPdfUrl = null;
        }
      })
      .catch((err) => console.error('Error al eliminar', err));
  }
}
