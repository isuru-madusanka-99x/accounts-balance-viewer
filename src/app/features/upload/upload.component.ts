import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="upload-container">
      <div class="header">
        <h2>Upload Balance Data</h2>
        <p class="subtitle">Upload balance data files (Admin only)</p>
      </div>
      
      <div class="content-card">
        <div class="upload-section">
          <div class="upload-area" 
               (dragover)="onDragOver($event)" 
               (dragleave)="onDragLeave($event)"
               (drop)="onDrop($event)"
               [class.drag-over]="isDragOver">
            <div class="upload-icon">📁</div>
            <h3>Drag & Drop Files Here</h3>
            <p>or</p>
            <input type="file" 
                   #fileInput 
                   (change)="onFileSelect($event)"
                   accept=".csv,.xlsx,.xls"
                   multiple
                   style="display: none;">
            <button class="btn btn-primary" (click)="fileInput.click()">
              Choose Files
            </button>
            <p class="file-info">Supported formats: CSV, Excel (.xlsx, .xls)</p>
          </div>
          
          <div class="selected-files" *ngIf="selectedFiles.length > 0">
            <h4>Selected Files:</h4>
            <div class="file-list">
              <div class="file-item" *ngFor="let file of selectedFiles; let i = index">
                <span class="file-name">📄 {{ file.name }}</span>
                <span class="file-size">{{ formatFileSize(file.size) }}</span>
                <button class="btn-remove" (click)="removeFile(i)">❌</button>
              </div>
            </div>
            <button class="btn btn-success" (click)="uploadFiles()" [disabled]="isUploading">
              {{ isUploading ? 'Uploading...' : 'Upload Files' }}
            </button>
          </div>
        </div>
        
        <div class="upload-history">
          <h3>Recent Uploads</h3>
          <div class="history-list">
            <div class="history-item" *ngFor="let upload of uploadHistory">
              <div class="upload-info">
                <span class="upload-file">{{ upload.fileName }}</span>
                <span class="upload-date">{{ upload.date | date:'medium' }}</span>
              </div>
              <span class="upload-status" [class]="upload.status">
                {{ upload.status === 'success' ? '✅' : '❌' }}
              </span>
            </div>
          </div>
        </div>
        
        <div class="instructions">
          <h3>Upload Instructions</h3>
          <ul>
            <li>Ensure your file contains columns: Account Name, Account Number, Balance</li>
            <li>Use CSV format for best compatibility</li>
            <li>File size limit: 10MB per file</li>
            <li>Duplicate uploads will overwrite existing data</li>
            <li>All uploads are logged for audit purposes</li>
          </ul>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .upload-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
    }
    
    .header {
      text-align: center;
      margin-bottom: 2rem;
    }
    
    .header h2 {
      color: #333;
      font-size: 2rem;
      margin-bottom: 0.5rem;
    }
    
    .subtitle {
      color: #666;
      font-size: 1.1rem;
    }
    
    .content-card {
      background: white;
      border-radius: 16px;
      padding: 2rem;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    }
    
    .upload-area {
      border: 2px dashed #ccc;
      border-radius: 12px;
      padding: 3rem;
      text-align: center;
      transition: all 0.3s ease;
      margin-bottom: 2rem;
    }
    
    .upload-area.drag-over {
      border-color: #667eea;
      background-color: #f0f8ff;
    }
    
    .upload-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
    }
    
    .upload-area h3 {
      color: #333;
      margin-bottom: 0.5rem;
    }
    
    .upload-area p {
      color: #666;
      margin: 0.5rem 0;
    }
    
    .btn {
      padding: 12px 24px;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.3s ease;
    }
    
    .btn-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }
    
    .btn-success {
      background-color: #28a745;
      color: white;
      margin-top: 1rem;
    }
    
    .btn:hover {
      transform: translateY(-2px);
    }
    
    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }
    
    .file-info {
      font-size: 0.9rem;
      color: #666;
      margin-top: 1rem;
    }
    
    .selected-files {
      background: #f8f9fa;
      border-radius: 8px;
      padding: 1.5rem;
      margin-bottom: 2rem;
    }
    
    .file-list {
      margin: 1rem 0;
    }
    
    .file-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem;
      background: white;
      border-radius: 6px;
      margin-bottom: 0.5rem;
    }
    
    .file-name {
      font-weight: 500;
    }
    
    .file-size {
      color: #666;
      font-size: 0.9rem;
    }
    
    .btn-remove {
      background: none;
      border: none;
      cursor: pointer;
      font-size: 1rem;
    }
    
    .upload-history {
      margin-bottom: 2rem;
    }
    
    .history-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      border-bottom: 1px solid #eee;
    }
    
    .upload-info {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }
    
    .upload-file {
      font-weight: 500;
    }
    
    .upload-date {
      font-size: 0.9rem;
      color: #666;
    }
    
    .upload-status {
      font-size: 1.2rem;
    }
    
    .instructions {
      background: #e3f2fd;
      border-radius: 8px;
      padding: 1.5rem;
      border-left: 4px solid #2196f3;
    }
    
    .instructions h3 {
      margin-top: 0;
      color: #1976d2;
    }
    
    .instructions ul {
      margin: 1rem 0 0 0;
      padding-left: 1.5rem;
    }
    
    .instructions li {
      margin-bottom: 0.5rem;
      color: #1976d2;
    }
  `]
})
export class UploadComponent {
  selectedFiles: File[] = [];
  isDragOver = false;
  isUploading = false;
  
  // Mock upload history
  uploadHistory = [
    { fileName: 'accounts_march.csv', date: new Date(2024, 2, 15), status: 'success' },
    { fileName: 'balances_february.xlsx', date: new Date(2024, 1, 28), status: 'success' },
    { fileName: 'data_january.csv', date: new Date(2024, 0, 31), status: 'error' }
  ];

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;
    
    const files = Array.from(event.dataTransfer?.files || []);
    this.addFiles(files);
  }

  onFileSelect(event: any): void {
    const files = Array.from(event.target.files || []) as File[];
    this.addFiles(files);
  }

  addFiles(files: File[]): void {
    const validFiles = files.filter(file => 
      file.type === 'text/csv' || 
      file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      file.type === 'application/vnd.ms-excel'
    );
    
    this.selectedFiles = [...this.selectedFiles, ...validFiles];
  }

  removeFile(index: number): void {
    this.selectedFiles.splice(index, 1);
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  uploadFiles(): void {
    if (this.selectedFiles.length === 0) return;
    
    this.isUploading = true;
    
    // Simulate upload process
    setTimeout(() => {
      // Add to history
      this.selectedFiles.forEach(file => {
        this.uploadHistory.unshift({
          fileName: file.name,
          date: new Date(),
          status: 'success'
        });
      });
      
      // Clear selected files
      this.selectedFiles = [];
      this.isUploading = false;
      
      alert('Files uploaded successfully!');
    }, 2000);
  }
}
