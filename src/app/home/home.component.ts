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
  docs: { uuid: string; name: string; url: string }[] = [];
  customName: string = '';

  ngOnInit() {
    this.loadDocs();
  }

  onFileChange(event: any) {
    this.selectedFile = event.target.files[0];
  }

  upload() {
    if (!this.selectedFile || !this.customName.trim()) return;

    const formData = new FormData();
    formData.append('file', this.selectedFile);
    formData.append('name', this.customName); // nuevo campo

    fetch(n8nWebhookUpload, {
      method: 'POST',
      body: formData,
    })
      .then((res) => {
        if (!res.ok) throw new Error('Error al subir');
        this.selectedFile = null;
        this.customName = '';
        this.loadDocs();
      })
      .catch((err) => console.error('Error', err));
  }

  loadDocs() {
    fetch(n8nWebhookList)
      .then((res) => res.json())
      .then((data) => {
        this.docs = data.map((doc: any) => ({
          uuid: doc.uuid, // ✅ Esta es la propiedad correcta
          name: doc.name,
          url: doc.url,
        }));
      })
      .catch((err) => console.error('Error al cargar docs', err));
  }

  viewPdf(url: string) {
    this.selectedPdfUrl = url;
  }

  deleteDoc(uuid: string) {
    console.log('🧾 UUID que se va a eliminar:', uuid);

    fetch(n8nWebhookDelete, {
      method: 'DELETE', // debe coincidir con lo que acepta tu webhook
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ key: uuid }), // solo mandas lo que tu webhook necesita
    })
      .then((res) => {
        console.log('📬 Respuesta del servidor:', res);
        if (!res.ok) throw new Error('Error al eliminar');
        this.loadDocs();
        this.selectedPdfUrl = null;
      })
      .catch((err) => console.error('❌ Error al eliminar', err));
  }
}
