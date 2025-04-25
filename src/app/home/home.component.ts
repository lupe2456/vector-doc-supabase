import { Component } from '@angular/core';

// URL del webhook de n8n
const n8nWebhookUrlPOST = '/webhook/esme-vectordb'; // El proxy debería manejar esta URL

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  selectedFile: File | null = null;

  onFileChange(event: any) {
    this.selectedFile = event.target.files[0];
  }

  upload() {
    if (!this.selectedFile) return;

    const formData = new FormData();
    formData.append('file', this.selectedFile);

    // Aquí deberías hacer el fetch a tu Webhook de n8n
    fetch(n8nWebhookUrlPOST, {
      method: 'POST',
      body: formData,
    })
      .then((res) => console.log('Subido', res))
      .catch((err) => console.error('Error', err));
  }
}
