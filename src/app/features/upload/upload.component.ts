import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadService } from '../../shared/services/upload.service';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

interface UploadResult {
  fileName: string;
  success: boolean;
  message: string;
  date: Date;
}

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
        <!-- Upload Progress -->
        <div class="upload-progress" *ngIf="isUploading">
          <div class="progress-header">
            <h3>Uploading Files...</h3>
            <span class="progress-text">{{ currentUploadIndex + 1 }} of {{ totalFiles }}</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" [style.width.%]="uploadProgress"></div>
          </div>
          <p class="current-file">Uploading: {{ currentFileName }}</p>
        </div>

        <!-- Upload Results -->
        <div class="upload-results" *ngIf="uploadResults.length > 0 && !isUploading">
          <h3>Upload Results</h3>
          <div class="results-list">
            <div class="result-item" *ngFor="let result of uploadResults" 
                 [class.success]="result.success" 
                 [class.error]="!result.success">
              <div class="result-info">
                <span class="result-file">📄 {{ result.fileName }}</span>
                <span class="result-message">{{ result.message }}</span>
              </div>
              <span class="result-icon">{{ result.success ? '✅' : '❌' }}</span>
            </div>
          </div>
          <button class="btn btn-primary" (click)="clearResults()">Upload More Files</button>
        </div>

        <div class="upload-section" *ngIf="!isUploading && uploadResults.length === 0">
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
              Upload Files ({{ selectedFiles.length }})
            </button>
          </div>
        </div>
        
        <div class="upload-history" *ngIf="!isUploading">
          <h3>Recent Uploads</h3>
          <div class="history-list" *ngIf="uploadHistory.length > 0; else noHistory">
            <div class="history-item" *ngFor="let upload of uploadHistory">
              <div class="upload-info">
                <span class="upload-file">{{ upload.fileName }}</span>
                <span class="upload-date">{{ upload.date | date:'medium' }}</span>
              </div>
              <span class="upload-status" [class]="upload.success">
                {{ upload.success ? '✅' : '❌' }}
              </span>
            </div>
          </div>
          <ng-template #noHistory>
            <p class="no-history">No recent uploads</p>
          </ng-template>
        </div>
        
        <div class="instructions">
          <h3>Upload Instructions</h3>
          <ul>
            <li>Ensure your file contains columns: Account Name, Account Number, Balance</li>
            <li>Use CSV format for best compatibility</li>
            <li>File size limit: 10MB per file</li>
            <li>Files are processed one at a time</li>
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

    .upload-progress {
      background: #f8f9fa;
      border-radius: 12px;
      padding: 2rem;
      margin-bottom: 2rem;
      text-align: center;
    }

    .progress-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .progress-bar {
      width: 100%;
      height: 20px;
      background-color: #e9ecef;
      border-radius: 10px;
      overflow: hidden;
      margin-bottom: 1rem;
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      transition: width 0.3s ease;
    }

    .current-file {
      color: #666;
      font-style: italic;
    }

    .upload-results {
      background: #f8f9fa;
      border-radius: 12px;
      padding: 2rem;
      margin-bottom: 2rem;
    }

    .results-list {
      margin: 1rem 0;
    }

    .result-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      margin-bottom: 0.5rem;
      border-radius: 8px;
      border-left: 4px solid;
    }

    .result-item.success {
      background: #d4edda;
      border-left-color: #28a745;
    }

    .result-item.error {
      background: #f8d7da;
      border-left-color: #dc3545;
    }

    .result-info {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .result-file {
      font-weight: 500;
    }

    .result-message {
      font-size: 0.9rem;
      color: #666;
    }

    .result-icon {
      font-size: 1.2rem;
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

    .no-history {
      color: #666;
      font-style: italic;
      text-align: center;
      padding: 2rem;
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
  uploadResults: UploadResult[] = [];
  uploadHistory: UploadResult[] = [];
  
  // Upload progress tracking
  currentUploadIndex = 0;
  totalFiles = 0;
  currentFileName = '';
  uploadProgress = 0;

  constructor(private uploadService: UploadService) {}

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
    // Clear the input
    event.target.value = '';
  }

  addFiles(files: File[]): void {
    const validFiles = files.filter(file => {
      const validTypes = [
        'text/csv',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel'
      ];
      return validTypes.includes(file.type) || file.name.endsWith('.csv');
    });
    
    // Filter out duplicates
    const newFiles = validFiles.filter(file => 
      !this.selectedFiles.some(existing => existing.name === file.name)
    );
    
    this.selectedFiles = [...this.selectedFiles, ...newFiles];
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

  async uploadFiles(): Promise<void> {
    if (this.selectedFiles.length === 0) return;
    
    this.isUploading = true;
    this.uploadResults = [];
    this.totalFiles = this.selectedFiles.length;
    this.currentUploadIndex = 0;
    this.uploadProgress = 0;
    
    // Upload files one by one
    for (let i = 0; i < this.selectedFiles.length; i++) {
      const file = this.selectedFiles[i];
      this.currentFileName = file.name;
      this.currentUploadIndex = i;
      this.uploadProgress = (i / this.totalFiles) * 100;
      
      try {
        const response = await this.uploadService.uploadBalanceFile(file).toPromise();
        
        const result: UploadResult = {
          fileName: file.name,
          success: response?.success || false,
          message: response?.message || 'Upload completed successfully',
          date: new Date()
        };
        
        this.uploadResults.push(result);
        this.uploadHistory.unshift(result);
        
      } catch (error: any) {
        const result: UploadResult = {
          fileName: file.name,
          success: false,
          message: error?.error?.message || error?.message || 'Upload failed',
          date: new Date()
        };
        
        this.uploadResults.push(result);
        this.uploadHistory.unshift(result);
      }
    }
    
    // Complete progress
    this.uploadProgress = 100;
    
    // Clean up
    setTimeout(() => {
      this.isUploading = false;
      this.selectedFiles = [];
      this.currentFileName = '';
      this.currentUploadIndex = 0;
      this.uploadProgress = 0;
    }, 1000);
  }

  clearResults(): void {
    this.uploadResults = [];
  }
}